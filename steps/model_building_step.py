import logging
from typing import Annotated

import mlflow
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import OneHotEncoder

from zenml import step, ArtifactConfig, Model
from zenml.client import Client


# 🔹 Define model metadata
model = Model(
    name="prices_predictor",
    version=None,
    license="Apache 2.0",
    description="House price prediction model",
)

# Default stack often has no experiment_tracker; only pass name if one exists.
_experiment_tracker = Client().active_stack.experiment_tracker
_step_kwargs: dict = {"enable_cache": False, "model": model}
if _experiment_tracker is not None:
    _step_kwargs["experiment_tracker"] = _experiment_tracker.name


# 🔹 ZenML Step (MLflow inside the step still runs without a stack tracker)
@step(**_step_kwargs)
def model_building_step(
    X_train: pd.DataFrame,
    y_train: pd.Series,
) -> Annotated[
    Pipeline,
    ArtifactConfig(name="sklearn_pipeline", is_model_artifact=True),
]:
    """
    Builds and trains a Linear Regression model with preprocessing.
    """

    # 🔸 Input validation
    if not isinstance(X_train, pd.DataFrame):
        raise TypeError("X_train must be a pandas DataFrame")

    if not isinstance(y_train, pd.Series):
        raise TypeError("y_train must be a pandas Series")

    # 🔸 Separate columns
    categorical_cols = X_train.select_dtypes(
        include=["object", "category"]
    ).columns

    numerical_cols = X_train.select_dtypes(
        exclude=["object", "category"]
    ).columns

    logging.info(f"Categorical columns: {list(categorical_cols)}")
    logging.info(f"Numerical columns: {list(numerical_cols)}")

    # 🔸 Numerical preprocessing
    numerical_transformer = SimpleImputer(strategy="mean")

    # 🔸 Categorical preprocessing
    categorical_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),  # fill missing
            ("onehot", OneHotEncoder(handle_unknown="ignore")),    # encode
        ]
    )

    # 🔸 Combine both preprocessing
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numerical_transformer, numerical_cols),
            ("cat", categorical_transformer, categorical_cols),
        ]
    )

    # 🔸 Final pipeline (preprocessing + model)
    pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("model", LinearRegression()),
        ]
    )

    # 🔸 Start MLflow tracking
    if not mlflow.active_run():
        mlflow.start_run()

    try:
        # Enable automatic logging
        mlflow.sklearn.autolog()

        logging.info("Training model...")

        # 🔸 Train pipeline
        pipeline.fit(X_train, y_train)

        logging.info("Model training completed")

        # 🔸 Get expected feature names after encoding
        onehot = (
            pipeline.named_steps["preprocessor"]
            .transformers_[1][1]
            .named_steps["onehot"]
        )

        onehot.fit(X_train[categorical_cols])

        expected_columns = list(numerical_cols) + list(
            onehot.get_feature_names_out(categorical_cols)
        )

        logging.info(f"Model expects columns: {expected_columns}")

    except Exception as e:
        logging.error(f"Error during training: {e}")
        raise e

    finally:
        # 🔸 End MLflow run
        mlflow.end_run()

    # 🔸 Return trained model pipeline
    return pipeline