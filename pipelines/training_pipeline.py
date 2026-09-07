import os
import sys
import threading
import traceback
from pathlib import Path

# Must run before importing ZenML. Rich's excepthook often breaks on Windows
# terminals (encoding), which hides the real error behind "Error in sys.excepthook".
os.environ.setdefault("ZENML_ENABLE_RICH_TRACEBACK", "false")
os.environ.setdefault("ZENML_DISABLE_INTERACTIVE_INPUT", "true")

# Microsoft Store Python: keep artifact paths under the repo so resolve() matches.
_root = Path(__file__).resolve().parent.parent
os.environ.setdefault("ZENML_LOCAL_STORES_PATH", str(_root / ".zenml" / "local_stores"))

# `python pipelines\training_pipeline.py` puts `pipelines/` on sys.path, not repo root — `steps` lives next to it.
_repo = str(_root)
if _repo not in sys.path:
    sys.path.insert(0, _repo)

_import_done = threading.Event()


def _slow_import_hint() -> None:
    """ZenML + sklearn/pandas can take minutes on first load (esp. with Windows AV)."""
    if not _import_done.wait(timeout=25):
        print(
            "\nStill importing... ZenML pulls a large dependency tree; "
            "your steps then load pandas/sklearn. This is normal -- keep waiting.\n",
            flush=True,
        )


threading.Thread(target=_slow_import_hint, daemon=True).start()

try:
    print("Loading ZenML (can take 1-3 min the first time)...", flush=True)
    # Model lives on the zenml package root, not zenml.model (that package has no re-export).
    from zenml import Model, pipeline

    print("ZenML loaded. Loading steps (pandas / sklearn / etc.)...", flush=True)
    from steps.data_ingestion_step import data_ingestion_step
    from steps.handle_missing_values_step import handle_missing_values_step
    from steps.feature_engineering_step import feature_engineering_step
    from steps.outlier_detection_step import outlier_detection_step
    from steps.data_splitter_step import data_splitter_step
    from steps.model_building_step import model_building_step
    from steps.model_evaluator_step import model_evaluator_step
except BaseException:
    log_path = _root / "pipeline_import_error.log"
    try:
        log_path.write_text(traceback.format_exc(), encoding="utf-8")
    except OSError:
        pass
    print(
        "\n*** Import failed — full error saved to:\n"
        f"    {log_path}\n"
        "\nCommon fixes:\n"
        '  pip install "pydantic-core>=2.41.5"   # pydantic mismatch\n'
        '  pip install "pyparsing>=3.1.0"      # matplotlib / one_of\n',
        file=sys.stderr,
        flush=True,
    )
    raise
finally:
    _import_done.set()

print("All imports done. Starting pipeline when you submit below.", flush=True)


@pipeline(
    model=Model(name="prices_predictor"),
    enable_cache=False,
)
def ml_pipeline():

    # 🔹 Step 1: Data ingestion
    raw_data = data_ingestion_step(
        file_path=str(_root / "Data" / "archive.zip")
    )

    # 🔹 Step 2: Handle missing values
    filled_data = handle_missing_values_step(raw_data)

    # 🔹 Step 3: Feature engineering
    engineered_data = feature_engineering_step(
        filled_data,
        strategy="log",
        features=["Gr Liv Area", "SalePrice"],
    )

    # 🔹 Step 4: Outlier detection
    clean_data = outlier_detection_step(
        engineered_data,
        column_name="SalePrice",
    )

    # 🔹 Step 5: Train-test split
    X_train, X_test, y_train, y_test = data_splitter_step(
        clean_data,
        target_column="SalePrice",
    )

    # 🔹 Step 6: Model training
    model = model_building_step(
        X_train=X_train,
        y_train=y_train,
    )

    # 🔹 Step 7: Model evaluation
    evaluation_metrics, mse = model_evaluator_step(
        trained_model=model,
        X_test=X_test,
        y_test=y_test,
    )

    return model


if __name__ == "__main__":
    print("Submitting pipeline run...\n", flush=True)
    ml_pipeline()
    print(
        "\nFinished. If you saw almost nothing, steps were likely cached; "
        "change code or clear ZenML cache to re-run steps.",
        flush=True,
    )