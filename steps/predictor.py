import json

import numpy as np
import pandas as pd
from zenml import step
from zenml.integrations.mlflow.services import MLFlowDeploymentService

from src.prediction.schema import NUMERIC_MODEL_FEATURES


@step(enable_cache=False)
def predictor(
    service: MLFlowDeploymentService,
    input_data: str,
) -> np.ndarray:
    """Run an inference request against a prediction service.

    Args:
        service (MLFlowDeploymentService): The deployed MLFlow service for prediction.
        input_data (str): The input data as a JSON string.

    Returns:
        np.ndarray: The model's prediction.
    """

    # Start the service (should be a NOP if already started)
    service.start(timeout=10)

    # Load the input data from JSON string
    data = json.loads(input_data)

    # Extract the actual data and expected columns
    data.pop("columns", None)  # Remove 'columns' if it's present
    data.pop("index", None)  # Remove 'index' if it's present

    # Convert the data into a DataFrame with the correct columns
    df = pd.DataFrame(data["data"], columns=NUMERIC_MODEL_FEATURES)

    
    prediction = service.predict(df)
    
    return prediction
