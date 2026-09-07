"""Missing-value handling strategies."""

import logging
from abc import ABC, abstractmethod

import pandas as pd


class MissingValueHandlingStrategy(ABC):
    """Interface for missing-value handling strategies."""

    @abstractmethod
    def handle(self, df: pd.DataFrame) -> pd.DataFrame:
        """Return a DataFrame with missing values handled."""


class DropMissingValuesStrategy(MissingValueHandlingStrategy):
    """Drop rows or columns containing missing values."""

    def __init__(self, axis=0, thresh=None):
        self.axis = axis
        self.thresh = thresh

    def handle(self, df: pd.DataFrame) -> pd.DataFrame:
        logging.info("Dropping missing values (axis=%s, thresh=%s)", self.axis, self.thresh)
        return df.dropna(axis=self.axis, thresh=self.thresh)


class FillMissingValuesStrategy(MissingValueHandlingStrategy):
    """Fill missing values using a simple strategy."""

    def __init__(self, method="mean", fill_value=None):
        self.method = method
        self.fill_value = fill_value

    def handle(self, df: pd.DataFrame) -> pd.DataFrame:
        logging.info("Filling missing values using method: %s", self.method)
        df_cleaned = df.copy()

        if self.method == "mean":
            num_cols = df_cleaned.select_dtypes(include="number").columns
            df_cleaned[num_cols] = df_cleaned[num_cols].fillna(df_cleaned[num_cols].mean())
        elif self.method == "median":
            num_cols = df_cleaned.select_dtypes(include="number").columns
            df_cleaned[num_cols] = df_cleaned[num_cols].fillna(df_cleaned[num_cols].median())
        elif self.method == "mode":
            for col in df_cleaned.columns:
                if not df_cleaned[col].mode().empty:
                    df_cleaned[col] = df_cleaned[col].fillna(df_cleaned[col].mode()[0])
        elif self.method == "constant":
            df_cleaned = df_cleaned.fillna(self.fill_value)
        else:
            logging.warning("Invalid missing-value method. No changes applied.")

        return df_cleaned


class MissingValueHandler:
    """Context class for applying a missing-value strategy."""

    def __init__(self, strategy: MissingValueHandlingStrategy):
        self._strategy = strategy

    def set_strategy(self, strategy: MissingValueHandlingStrategy):
        logging.info("Switching missing-value strategy")
        self._strategy = strategy

    def handle_missing_values(self, df: pd.DataFrame) -> pd.DataFrame:
        return self._strategy.handle(df)
