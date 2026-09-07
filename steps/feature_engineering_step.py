import pandas as pd
from zenml import step

# Import strategies
from src.feature_engineering import (
    FeatureEngineer,
    LogTransformation,
    MinMaxScaling,
    OneHotEncoding,
    StandardScaling,
)


@step
def feature_engineering_step(
    df: pd.DataFrame, strategy: str = "log", features: list = None
) -> pd.DataFrame:
    """
    Applies feature engineering techniques to selected features
    """

    # Ensure features list exists
    if features is None:
        features = []

    # 🔸 Select transformation strategy

    if strategy == "log":
        engineer = FeatureEngineer(LogTransformation(features))

    elif strategy == "standard_scaling":
        engineer = FeatureEngineer(StandardScaling(features))

    elif strategy == "minmax_scaling":
        engineer = FeatureEngineer(MinMaxScaling(features))

    elif strategy == "onehot_encoding":
        engineer = FeatureEngineer(OneHotEncoding(features))

    else:
        raise ValueError(f"Unsupported feature engineering strategy: {strategy}")

    # 🔸 Apply transformation
    transformed_df = engineer.apply_feature_engineering(df)

    return transformed_df