import logging
import pandas as pd
from zenml import step

from src.outlier_detection import OutlierDetector, ZScoreOutlierDetection


@step
def outlier_detection_step(df: pd.DataFrame, column_name: str) -> pd.DataFrame:
    """Remove rows that are outliers on one column, keeping every other feature."""

    logging.info("Starting outlier detection with shape: %s", df.shape)

    if df is None or not isinstance(df, pd.DataFrame):
        raise ValueError("Input must be a pandas DataFrame")
    if column_name not in df.columns:
        raise ValueError(f"Column '{column_name}' not found")

    detector = OutlierDetector(ZScoreOutlierDetection(threshold=3))
    outlier_flags = detector.detect_outliers(df[[column_name]])
    df_cleaned = df[(~outlier_flags).all(axis=1)].copy()

    logging.info("Shape after outlier removal: %s", df_cleaned.shape)
    return df_cleaned
