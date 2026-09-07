import pandas as pd
from zenml import step
from src.ingest_data import DataIngestorFactory


@step
def data_ingestion_step(file_path: str) -> pd.DataFrame:
    
    ingestor = DataIngestorFactory.get_data_ingestor(file_path)

    # Load data
    df = ingestor.ingest(file_path)

    return df