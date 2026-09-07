"""Backward-compatible imports for training data splitting.

New code should import from ``src.training.splitter``.
"""

from src.training.splitter import DataSplitter, DataSplittingStrategy, SimpleTrainTestSplitStrategy

__all__ = ["DataSplitter", "DataSplittingStrategy", "SimpleTrainTestSplitStrategy"]
