"""Train/test splitting strategies."""

import logging
from abc import ABC, abstractmethod

import pandas as pd
from sklearn.model_selection import train_test_split


class DataSplittingStrategy(ABC):
    """Interface for data splitting strategies."""

    @abstractmethod
    def split_data(self, df: pd.DataFrame, target_column: str):
        """Split a DataFrame into train/test features and targets."""


class SimpleTrainTestSplitStrategy(DataSplittingStrategy):
    """Basic train/test split."""

    def __init__(self, test_size=0.2, random_state=42):
        self.test_size = test_size
        self.random_state = random_state

    def split_data(self, df: pd.DataFrame, target_column: str):
        logging.info("Splitting data using train-test split")
        x = df.drop(columns=[target_column])
        y = df[target_column]

        id_cols = [c for c in ("Order", "PID") if c in x.columns]
        if id_cols:
            x = x.drop(columns=id_cols)

        cat_cols = x.select_dtypes(include=["object", "category"]).columns.tolist()
        if cat_cols:
            x = x.drop(columns=cat_cols)

        return train_test_split(
            x,
            y,
            test_size=self.test_size,
            random_state=self.random_state,
        )


class DataSplitter:
    """Context class for applying a data splitting strategy."""

    def __init__(self, strategy: DataSplittingStrategy):
        self.strategy = strategy

    def split(self, df: pd.DataFrame, target_column: str):
        return self.strategy.split_data(df, target_column)
