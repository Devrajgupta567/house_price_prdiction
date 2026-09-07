from pathlib import Path
from typing import Optional
import json

import mlflow.sklearn
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, ConfigDict, Field

from predict_price import latest_mlflow_model_dir, prepare_features
from src.prediction.form_mapper import build_model_row, is_legacy_feature_payload

PROJECT_ROOT = Path(__file__).resolve().parent.parent

app = FastAPI(title="House Price API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:8000",
        "http://localhost:8000",
        "http://127.0.0.1:5173",
        "http://localhost:5173",
        "*",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

_model = None


class HouseEstimateRequest(BaseModel):
    """Basic details a homeowner can enter on the website."""

    model_config = ConfigDict(populate_by_name=True)

    gr_liv_area: float = Field(..., gt=0, le=20000, description="Above-grade living area (sq ft)")
    lot_area: float = Field(..., gt=0, le=500000, description="Lot size (sq ft)")
    bedrooms: int = Field(..., ge=0, le=15)
    full_bath: int = Field(..., ge=0, le=8)
    half_bath: int = Field(0, ge=0, le=8)
    garage_cars: int = Field(0, ge=0, le=6)
    year_built: int = Field(..., ge=1800, le=2026)
    overall_qual: int = Field(..., ge=1, le=10)
    overall_cond: int = Field(..., ge=1, le=10)
    year_remod: Optional[int] = Field(None, ge=1800, le=2026)
    total_bsmt_sf: float = Field(0, ge=0, le=20000)
    second_flr_sf: float = Field(0, ge=0, le=10000)
    garage_area: Optional[float] = Field(None, ge=0, le=5000)
    fireplaces: int = Field(0, ge=0, le=5)
    lot_frontage: Optional[float] = Field(None, ge=0, le=500)


class PredictResponse(BaseModel):
    predicted_price: float
    currency: str = "USD"
    input_mode: str


def get_model():
    global _model
    if _model is None:
        model_dir = latest_mlflow_model_dir(PROJECT_ROOT)
        _model = mlflow.sklearn.load_model(str(model_dir))
    return _model


def _predict_row(house: dict) -> float:
    model = get_model()
    features = prepare_features([house])
    log_pred = model.predict(features)
    return float(np.expm1(log_pred)[0])


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/model-info")
def model_info():
    metrics_path = PROJECT_ROOT / "models" / "metrics.json"
    if not metrics_path.exists():
        return {
            "model_name": "prices_predictor",
            "status": "metrics file not found",
        }
    return json.loads(metrics_path.read_text(encoding="utf-8"))


@app.post("/predict", response_model=PredictResponse)
def predict(payload: dict):
    try:
        if is_legacy_feature_payload(payload):
            house = payload
            mode = "legacy_columns"
        else:
            form = HouseEstimateRequest.model_validate(payload)
            house = build_model_row(form.model_dump())
            mode = "basic_form"

        price = _predict_row(house)
        return PredictResponse(
            predicted_price=round(price, 2),
            input_mode=mode,
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/")
def home():
    return FileResponse(PROJECT_ROOT / "frontend" / "index.html")
