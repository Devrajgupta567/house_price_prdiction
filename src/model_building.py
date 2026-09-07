"""Backward-compatible imports for model building.

New code should import from ``src.models.building``.
"""

from src.models.building import LinearRegressionStrategy, ModelBuilder, ModelBuildingStrategy

__all__ = ["LinearRegressionStrategy", "ModelBuilder", "ModelBuildingStrategy"]
