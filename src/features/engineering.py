"""Feature transformation strategies."""

from abc import ABC, abstractmethod

import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler, OneHotEncoder, StandardScaler


def _dense_one_hot_encoder(drop="first") -> OneHotEncoder:
    """Return a dense OneHotEncoder across supported scikit-learn versions."""

    try:
        return OneHotEncoder(sparse_output=False, drop=drop)
    except TypeError:
        return OneHotEncoder(sparse=False, drop=drop)


class FeatureEngineeringStrategy(ABC):
    """Interface for feature engineering strategies."""

    @abstractmethod
    def apply_transformation(self, df: pd.DataFrame) -> pd.DataFrame:
        """Return a transformed DataFrame."""


class LogTransformation(FeatureEngineeringStrategy):
    """Apply log1p transformation to selected columns."""

    def __init__(self, features):
        self.features = features

    def apply_transformation(self, df: pd.DataFrame) -> pd.DataFrame:
        df_transformed = df.copy()
        for feature in self.features:
            df_transformed[feature] = np.log1p(df[feature])
        return df_transformed


class StandardScaling(FeatureEngineeringStrategy):
    """Apply standard scaling to selected columns."""

    def __init__(self, features):
        self.features = features
        self.scaler = StandardScaler()

    def apply_transformation(self, df: pd.DataFrame) -> pd.DataFrame:
        df_transformed = df.copy()
        df_transformed[self.features] = self.scaler.fit_transform(df[self.features])
        return df_transformed


class MinMaxScaling(FeatureEngineeringStrategy):
    """Apply min-max scaling to selected columns."""

    def __init__(self, features):
        self.features = features
        self.scaler = MinMaxScaler()

    def apply_transformation(self, df: pd.DataFrame) -> pd.DataFrame:
        df_transformed = df.copy()
        df_transformed[self.features] = self.scaler.fit_transform(df[self.features])
        return df_transformed


class OneHotEncoding(FeatureEngineeringStrategy):
    """One-hot encode selected categorical columns."""

    def __init__(self, features):
        self.features = features
        self.encoder = _dense_one_hot_encoder(drop="first")

    def apply_transformation(self, df: pd.DataFrame) -> pd.DataFrame:
        df_transformed = df.copy()
        encoded = self.encoder.fit_transform(df[self.features])
        encoded_df = pd.DataFrame(
            encoded,
            columns=self.encoder.get_feature_names_out(self.features),
            index=df_transformed.index,
        )
        df_transformed = df_transformed.drop(columns=self.features)
        return pd.concat([df_transformed, encoded_df], axis=1)


class FeatureEngineer:
    """Context class for applying a feature engineering strategy."""

    def __init__(self, strategy: FeatureEngineeringStrategy):
        self._strategy = strategy

    def set_strategy(self, strategy: FeatureEngineeringStrategy):
        self._strategy = strategy

    def apply_feature_engineering(self, df: pd.DataFrame) -> pd.DataFrame:
        return self._strategy.apply_transformation(df)
