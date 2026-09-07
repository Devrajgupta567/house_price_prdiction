"""Backward-compatible imports for outlier handling.

New code should import from ``src.preprocessing.outliers``.
"""

from src.preprocessing.outliers import (
    IQROutlierDetection,
    OutlierDetectionStrategy,
    OutlierDetector,
    ZScoreOutlierDetection,
)

__all__ = [
    "IQROutlierDetection",
    "OutlierDetectionStrategy",
    "OutlierDetector",
    "ZScoreOutlierDetection",
]
