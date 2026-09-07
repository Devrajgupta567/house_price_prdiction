import pandas as pd
from zenml import step

from src.handle_missing_values import (
    DropMissingValuesStrategy,
    FillMissingValuesStrategy,
    MissingValueHandler,
)


@step
def handle_missing_values_step(
    df: pd.DataFrame, strategy: str = "mean"
) -> pd.DataFrame:
    """
    Handles missing values using a selected strategy.
    """

    # 🔹 Choose strategy
    if strategy == "drop":
        handler = MissingValueHandler(
            DropMissingValuesStrategy(axis=0)
        )

    elif strategy in ["mean", "median", "mode", "constant"]:
        handler = MissingValueHandler(
            FillMissingValuesStrategy(method=strategy)
        )

    else:
        raise ValueError(f"Unsupported strategy: {strategy}")

    # 🔹 Apply strategy
    cleaned_df = handler.handle_missing_values(df)

    return cleaned_df