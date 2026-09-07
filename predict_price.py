import argparse
import json
from pathlib import Path

import mlflow.sklearn
import numpy as np
import pandas as pd

from src.prediction.schema import AREA_COLUMN, NUMERIC_MODEL_FEATURES, SAMPLE_HOUSE


def latest_mlflow_model_dir(project_root: Path) -> Path:
    stable_model = project_root / "models" / "house_price_model" / "MLmodel"
    if stable_model.exists():
        return stable_model.parent

    mlmodels = sorted(
        project_root.glob(".zenml/local_stores/**/mlruns/**/models/**/artifacts/MLmodel"),
        key=lambda path: path.stat().st_mtime,
        reverse=True,
    )
    if not mlmodels:
        raise FileNotFoundError(
            "No trained MLflow model found. Run `python run_pipeline.py` first."
        )
    return mlmodels[0].parent


def load_records(input_path: str | None) -> list[dict]:
    if input_path is None:
        return [SAMPLE_HOUSE]

    with open(input_path, "r", encoding="utf-8") as f:
        payload = json.load(f)

    if isinstance(payload, dict) and "dataframe_records" in payload:
        return payload["dataframe_records"]
    if isinstance(payload, dict):
        return [payload]
    if isinstance(payload, list):
        return payload

    raise ValueError("Input JSON must be a feature object or a list of feature objects.")


def prepare_features(records: list[dict]) -> pd.DataFrame:
    df = pd.DataFrame(records)

    missing_columns = [col for col in NUMERIC_MODEL_FEATURES if col not in df.columns]
    if missing_columns:
        raise ValueError(f"Missing required columns: {missing_columns}")

    df = df[NUMERIC_MODEL_FEATURES].copy()

    # The training pipeline applies log1p to Gr Liv Area before model training.
    df[AREA_COLUMN] = np.log1p(df[AREA_COLUMN])

    return df


def main() -> None:
    parser = argparse.ArgumentParser(description="Predict house price locally.")
    parser.add_argument(
        "--input",
        help="Optional JSON file containing one feature object, a list of objects, or dataframe_records.",
    )
    parser.add_argument(
        "--actual-price",
        type=float,
        help="Optional actual SalePrice for comparing the first prediction.",
    )
    args = parser.parse_args()

    project_root = Path(__file__).resolve().parent
    model_dir = latest_mlflow_model_dir(project_root)
    model = mlflow.sklearn.load_model(str(model_dir))

    records = load_records(args.input)
    features = prepare_features(records)

    log_predictions = model.predict(features)
    price_predictions = np.expm1(log_predictions)

    print(f"Loaded model: {model_dir}")
    for index, price in enumerate(price_predictions, start=1):
        print(f"House {index} predicted price: {price:,.2f}")
        actual_price = None
        if index == 1 and args.actual_price is not None:
            actual_price = args.actual_price
        elif "SalePrice" in records[index - 1]:
            actual_price = float(records[index - 1]["SalePrice"])

        if actual_price is not None:
            error = price - actual_price
            percent_error = abs(error) / actual_price * 100
            print(f"House {index} actual price: {actual_price:,.2f}")
            print(f"House {index} error: {error:,.2f} ({percent_error:.2f}%)")


if __name__ == "__main__":
    main()
