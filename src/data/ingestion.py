"""Reusable data ingestion components."""

import os
import zipfile
from abc import ABC, abstractmethod

import pandas as pd


class DataIngestor(ABC):
    """Interface for loading a dataset into a DataFrame."""

    @abstractmethod
    def ingest(self, file_path: str) -> pd.DataFrame:
        """Load data from ``file_path``."""


class ZipDataIngestor(DataIngestor):
    """Load the first CSV file found inside a ZIP archive."""

    def __init__(self, extract_path: str = "extracted_data"):
        self.extract_path = extract_path

    def ingest(self, file_path: str) -> pd.DataFrame:
        if not file_path.endswith(".zip"):
            raise ValueError("File must be a .zip file")

        if not os.path.exists(self.extract_path):
            os.makedirs(self.extract_path)

        with zipfile.ZipFile(file_path, "r") as zip_ref:
            zip_ref.extractall(self.extract_path)

        files = os.listdir(self.extract_path)
        csv_files = [file for file in files if file.endswith(".csv")]
        if not csv_files:
            raise FileNotFoundError("No CSV file found in zip")

        csv_path = os.path.join(self.extract_path, csv_files[0])
        return pd.read_csv(csv_path)


class CsvDataIngestor(DataIngestor):
    """Load a CSV file from disk."""

    def ingest(self, file_path: str) -> pd.DataFrame:
        if not file_path.lower().endswith(".csv"):
            raise ValueError("File must be a .csv file")
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"CSV not found: {file_path}")
        return pd.read_csv(file_path)


class DataIngestorFactory:
    """Factory for selecting a data ingestor by file type."""

    @staticmethod
    def get_data_ingestor(file_path: str) -> DataIngestor:
        lower = file_path.lower()
        if lower.endswith(".zip"):
            return ZipDataIngestor()
        if lower.endswith(".csv"):
            return CsvDataIngestor()
        raise ValueError("Unsupported file format")
