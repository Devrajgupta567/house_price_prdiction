"""Model evaluation strategies and metrics."""

import logging
from abc import ABC, abstractmethod

import pandas as pd
from sklearn.base import RegressorMixin
from sklearn.metrics import mean_squared_error, r2_score


class ModelEvaluationStrategy(ABC):
    """Interface for model evaluation strategies."""

    @abstractmethod
    def evaluate_model(
        self,
        model: RegressorMixin,
        X_test: pd.DataFrame,
        y_test: pd.Series,
    ) -> dict:
        """Evaluate a model and return metrics."""


class RegressionModelEvaluationStrategy(ModelEvaluationStrategy):
    """Evaluate a regression model with MSE and R-squared."""

    def evaluate_model(
        self,
        model: RegressorMixin,
        X_test: pd.DataFrame,
        y_test: pd.Series,
    ) -> dict:
        logging.info("Making predictions on test data")
        y_pred = model.predict(X_test)
        logging.info("Calculating evaluation metrics")
        metrics = {
            "Mean Squared Error": mean_squared_error(y_test, y_pred),
            "R-Squared": r2_score(y_test, y_pred),
        }
        logging.info("Evaluation results: %s", metrics)
        return metrics


class ModelEvaluator:
    """Context class for applying an evaluation strategy."""

    def __init__(self, strategy: ModelEvaluationStrategy):
        self._strategy = strategy

    def set_strategy(self, strategy: ModelEvaluationStrategy):
        logging.info("Switching evaluation strategy")
        self._strategy = strategy

    def evaluate(
        self,
        model: RegressorMixin,
        X_test: pd.DataFrame,
        y_test: pd.Series,
    ) -> dict:
        return self._strategy.evaluate_model(model, X_test, y_test)
