import logging
from typing import Tuple

import pandas as pd
from sklearn.pipeline import Pipeline
from zenml import step

# 🔹 Import evaluator and strategy
from src.model_evaluator import (
    ModelEvaluator,
    RegressionModelEvaluationStrategy,
)


@step(enable_cache=False)
def model_evaluator_step(
    trained_model: Pipeline,   # full pipeline (preprocessing + model)
    X_test: pd.DataFrame,      # test features
    y_test: pd.Series          # actual values
) -> Tuple[dict, float]:
    """
    Evaluates trained model and returns metrics.
    """

    # 🔸 Input validation
    if not isinstance(X_test, pd.DataFrame):
        raise TypeError("X_test must be a pandas DataFrame")

    if not isinstance(y_test, pd.Series):
        raise TypeError("y_test must be a pandas Series")

    logging.info("Applying preprocessing to test data")

    # 🔸 Step 1: Apply SAME preprocessing as training
    # (very important for correct predictions)
    X_test_processed = trained_model.named_steps["preprocessor"].transform(X_test)

    # 🔸 Step 2: Initialize evaluator with regression strategy
    evaluator = ModelEvaluator(
        strategy=RegressionModelEvaluationStrategy()
    )

    # 🔸 Step 3: Evaluate model
    evaluation_metrics = evaluator.evaluate(
        trained_model.named_steps["model"],  # extract trained model
        X_test_processed,                    # processed features
        y_test                              # actual values
    )

    # 🔸 Step 4: Ensure output is dictionary
    if not isinstance(evaluation_metrics, dict):
        raise ValueError("Evaluation metrics must be a dictionary")

    # 🔸 Step 5: Extract MSE separately (useful for tracking)
    mse = evaluation_metrics.get("Mean Squared Error", None)

    # 🔸 Return:
    # - full metrics
    # - mse (important for optimization)
    return evaluation_metrics, mse