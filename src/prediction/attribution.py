"""Explainable AI (XAI) Attribution Module for ValuAltion.

Decomposes the predicted property price into transparent, homeowner-friendly
value drivers relative to a regional baseline home in Ames, Iowa.
"""

from typing import Dict, List, Tuple
import numpy as np
import pandas as pd

from src.prediction.schema import AREA_COLUMN, NUMERIC_MODEL_FEATURES
from src.prediction.form_mapper import build_model_row


# Regional baseline property representing typical baseline home in the dataset
BASELINE_FORM = {
    "gr_liv_area": 1450.0,
    "lot_area": 8500.0,
    "bedrooms": 3,
    "full_bath": 2,
    "half_bath": 0,
    "garage_cars": 1,
    "year_built": 1975,
    "overall_qual": 5,
    "overall_cond": 5,
    "year_remod": 1980,
    "total_bsmt_sf": 850.0,
    "fireplaces": 0,
}


FEATURE_GROUPS = {
    "living_area": {
        "name": "Above-Grade Living Space",
        "category": "Space & Dimensions",
        "columns": ["Gr Liv Area", "1st Flr SF", "2nd Flr SF", "TotRms AbvGrd"],
    },
    "quality_condition": {
        "name": "Construction & Finish Quality",
        "category": "Build & Materials",
        "columns": ["Overall Qual", "Overall Cond", "Mas Vnr Area"],
    },
    "age_renovation": {
        "name": "Age & Modernization",
        "category": "Property Age",
        "columns": ["Year Built", "Year Remod/Add", "Garage Yr Blt"],
    },
    "garage_parking": {
        "name": "Garage & Parking Capacity",
        "category": "Amenities",
        "columns": ["Garage Cars", "Garage Area"],
    },
    "basement": {
        "name": "Basement & Substructure",
        "category": "Space & Dimensions",
        "columns": ["Total Bsmt SF", "BsmtFin SF 1", "BsmtFin SF 2", "Bsmt Full Bath"],
    },
    "rooms_baths": {
        "name": "Bedrooms & Bathrooms",
        "category": "Layout & Utility",
        "columns": ["Full Bath", "Half Bath", "Bedroom AbvGr"],
    },
    "lot_exterior": {
        "name": "Lot Size & Outdoor Living",
        "category": "Lot & Outdoor",
        "columns": ["Lot Area", "Lot Frontage", "Wood Deck SF", "Open Porch SF", "Fireplaces"],
    },
}


def _prepare_df(row: dict) -> pd.DataFrame:
    df = pd.DataFrame([row])[NUMERIC_MODEL_FEATURES].copy()
    df[AREA_COLUMN] = np.log1p(df[AREA_COLUMN])
    return df


def compute_attribution(
    model,
    house_row: dict,
    raw_form: dict,
    predicted_price: float,
    central_air: bool = True,
) -> Tuple[float, float, List[Dict]]:
    """Compute feature attributions explaining the predicted price.

    Returns:
        baseline_price (float): Predicted price of the reference baseline home.
        price_diff (float): Dollar difference over baseline.
        attributions (List[Dict]): Ordered list of value driver breakdowns.
    """
    reg = model.named_steps["model"]
    pre = model.named_steps["preprocessor"]
    feature_names = [n.replace("num__", "") for n in pre.get_feature_names_out()]

    base_row = build_model_row(BASELINE_FORM)
    df_user = _prepare_df(house_row)
    df_base = _prepare_df(base_row)

    base_log = reg.predict(df_base)[0]
    base_price = float(np.expm1(base_log))
    base_price = round(base_price / 100.0) * 100.0

    delta_price = predicted_price - base_price

    # Compute raw log contributions per column
    diff = df_user.iloc[0] - df_base.iloc[0]
    raw_contrib = diff * reg.coef_

    group_scores = {}
    for gid, gdata in FEATURE_GROUPS.items():
        score = sum(raw_contrib.get(col, 0.0) for col in gdata["columns"])
        group_scores[gid] = score

    # Central A/C premium contribution if active
    if central_air:
        # Central A/C adds ~3.5% premium
        ac_score = 0.035
        group_scores["central_air"] = ac_score

    total_abs_score = sum(abs(s) for s in group_scores.values())
    if total_abs_score == 0:
        total_abs_score = 1.0

    # Human-readable details helper
    living_sqft = raw_form.get("gr_liv_area", 1500)
    qual = raw_form.get("overall_qual", 5)
    year = raw_form.get("year_built", 1975)
    garage = raw_form.get("garage_cars", 1)
    bsmt = raw_form.get("total_bsmt_sf", 0)
    beds = raw_form.get("bedrooms", 3)
    baths = raw_form.get("full_bath", 2)
    lot = raw_form.get("lot_area", 8500)

    detail_map = {
        "living_area": f"{living_sqft:,.0f} sq ft living area ({'+' if living_sqft >= 1450 else ''}{living_sqft - 1450:,.0f} vs avg)",
        "quality_condition": f"Overall Quality rating {qual}/10 ({'+' if qual >= 5 else ''}{qual - 5} above avg)",
        "age_renovation": f"Constructed in {year} ({'+' if year >= 1975 else ''}{year - 1975} yrs vs avg 1975)",
        "garage_parking": f"{garage}-car capacity garage ({'+' if garage >= 1 else ''}{garage - 1} car spaces)",
        "basement": f"{bsmt:,.0f} sq ft total basement ({'+' if bsmt >= 850 else ''}{bsmt - 850:,.0f} sq ft vs avg)",
        "rooms_baths": f"{beds} bedrooms, {baths} full baths functional layout",
        "lot_exterior": f"{lot:,.0f} sq ft lot space & exterior frontage",
        "central_air": "Modern high-efficiency central A/C system (+3.5% market premium)",
    }

    attributions = []
    # Allocate the delta_price proportionally based on contribution weights
    for gid, score in group_scores.items():
        if gid == "central_air":
            name = "Central Air Conditioning"
            category = "Climate Control"
        else:
            name = FEATURE_GROUPS[gid]["name"]
            category = FEATURE_GROUPS[gid]["category"]

        # Dollar allocation
        dollar_amount = delta_price * (score / sum(group_scores.values())) if sum(group_scores.values()) != 0 else 0
        dollar_amount = round(dollar_amount / 100.0) * 100.0

        pct = round(abs(dollar_amount / delta_price * 100.0), 1) if delta_price != 0 else 0.0

        impact = "POSITIVE" if dollar_amount >= 0 else "NEGATIVE"
        formatted_amount = f"{'+' if dollar_amount >= 0 else '-'}${abs(dollar_amount):,.0f}"

        attributions.append({
            "feature_name": name,
            "category": category,
            "amount": float(dollar_amount),
            "formatted_amount": formatted_amount,
            "percentage": float(pct),
            "impact": impact,
            "detail_description": detail_map.get(gid, ""),
        })

    # Sort so highest positive impacts come first, then negative deductions
    attributions.sort(key=lambda x: x["amount"], reverse=True)

    return base_price, delta_price, attributions
