"""Backward-compatible imports for feature engineering.

New code should import from ``src.features.engineering``.
"""

from src.features.engineering import (
    FeatureEngineer,
    FeatureEngineeringStrategy,
    LogTransformation,
    MinMaxScaling,
    OneHotEncoding,
    StandardScaling,
)

__all__ = [
    "FeatureEngineer",
    "FeatureEngineeringStrategy",
    "LogTransformation",
    "MinMaxScaling",
    "OneHotEncoding",
    "StandardScaling",
]
