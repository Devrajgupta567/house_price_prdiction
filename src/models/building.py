"""Model building strategies."""

import logging
from abc import ABC, abstractmethod

import pandas as pd
from sklearn.base import RegressorMixin
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler


class ModelBuildingStrategy(ABC):
    """Interface for model training strategies."""

    @abstractmethod
    def build_and_train_model(self, X_train: pd.DataFrame, y_train: pd.Series) -> RegressorMixin:
        """Build and train a model."""


class LinearRegressionStrategy(ModelBuildingStrategy):
    """Train a linear regression model with standard scaling."""

    def build_and_train_model(self, X_train: pd.DataFrame, y_train: pd.Series) -> Pipeline:
        if not isinstance(X_train, pd.DataFrame):
            raise TypeError("X_train must be a pandas DataFrame")
        if not isinstance(y_train, pd.Series):
            raise TypeError("y_train must be a pandas Series")

        logging.info("Initializing Linear Regression pipeline")
        pipeline = Pipeline(
            [
                ("scaler", StandardScaler()),
                ("model", LinearRegression()),
            ]
        )
        logging.info("Training model")
        pipeline.fit(X_train, y_train)
        logging.info("Model training completed")
        return pipeline


class ModelBuilder:
    """Context class for applying a model building strategy."""

    def __init__(self, strategy: ModelBuildingStrategy):
        self._strategy = strategy

    def set_strategy(self, strategy: ModelBuildingStrategy):
        logging.info("Switching model strategy")
        self._strategy = strategy

    def build_model(self, X_train: pd.DataFrame, y_train: pd.Series) -> RegressorMixin:
        return self._strategy.build_and_train_model(X_train, y_train)
