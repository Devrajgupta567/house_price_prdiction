"""Outlier detection and handling strategies."""

import logging
from abc import ABC, abstractmethod

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns


class OutlierDetectionStrategy(ABC):
    """Interface for outlier detection strategies."""

    @abstractmethod
    def detect_outliers(self, df: pd.DataFrame) -> pd.DataFrame:
        """Return a boolean DataFrame where True means outlier."""


class ZScoreOutlierDetection(OutlierDetectionStrategy):
    """Detect outliers using absolute z-score."""

    def __init__(self, threshold=3):
        self.threshold = threshold

    def detect_outliers(self, df: pd.DataFrame) -> pd.DataFrame:
        logging.info("Detecting outliers using Z-score method")
        z_scores = np.abs((df - df.mean()) / df.std())
        return z_scores > self.threshold


class IQROutlierDetection(OutlierDetectionStrategy):
    """Detect outliers using the interquartile range rule."""

    def detect_outliers(self, df: pd.DataFrame) -> pd.DataFrame:
        logging.info("Detecting outliers using IQR method")
        q1 = df.quantile(0.25)
        q3 = df.quantile(0.75)
        iqr = q3 - q1
        return (df < (q1 - 1.5 * iqr)) | (df > (q3 + 1.5 * iqr))


class OutlierDetector:
    """Context class for detecting and handling outliers."""

    def __init__(self, strategy: OutlierDetectionStrategy):
        self._strategy = strategy

    def set_strategy(self, strategy: OutlierDetectionStrategy):
        logging.info("Switching outlier detection strategy")
        self._strategy = strategy

    def detect_outliers(self, df: pd.DataFrame) -> pd.DataFrame:
        return self._strategy.detect_outliers(df)

    def handle_outliers(self, df: pd.DataFrame, method="remove") -> pd.DataFrame:
        outliers = self.detect_outliers(df)

        if method == "remove":
            logging.info("Removing outliers")
            return df[(~outliers).all(axis=1)]
        if method == "cap":
            logging.info("Capping outliers")
            return df.clip(lower=df.quantile(0.01), upper=df.quantile(0.99), axis=1)

        logging.warning("Unknown outlier handling method. Returning original data.")
        return df

    def visualize_outliers(self, df: pd.DataFrame, features: list):
        for feature in features:
            plt.figure(figsize=(10, 6))
            sns.boxplot(x=df[feature])
            plt.title(f"Boxplot of {feature}")
            plt.show()
