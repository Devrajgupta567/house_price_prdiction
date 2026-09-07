"""Backward-compatible imports for data ingestion.

New code should import from ``src.data.ingestion``.
"""

from src.data.ingestion import CsvDataIngestor, DataIngestor, DataIngestorFactory, ZipDataIngestor

__all__ = ["CsvDataIngestor", "DataIngestor", "DataIngestorFactory", "ZipDataIngestor"]
