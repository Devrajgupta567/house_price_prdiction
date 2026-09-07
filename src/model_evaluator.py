"""Backward-compatible imports for model evaluation.

New code should import from ``src.evaluation.metrics``.
"""

from src.evaluation.metrics import (
    ModelEvaluationStrategy,
    ModelEvaluator,
    RegressionModelEvaluationStrategy,
)

__all__ = [
    "ModelEvaluationStrategy",
    "ModelEvaluator",
    "RegressionModelEvaluationStrategy",
]
