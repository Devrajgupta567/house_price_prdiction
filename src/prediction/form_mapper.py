"""Map a short user form onto the numeric columns the trained model expects."""

from src.prediction.schema import NUMERIC_MODEL_FEATURES

# Ames Housing typical values for fields the website does not ask.
_DEFAULT_LOT_FRONTAGE = 68.0
_GARAGE_AREA_PER_CAR = 280.0
_AMES_LAST_SALE_YEAR = 2010


def build_model_row(form: dict) -> dict:
    """Turn basic house details into one full model feature row.

    Required keys: gr_liv_area, lot_area, bedrooms, full_bath, garage_cars,
    year_built, overall_qual, overall_cond.
    Optional keys: half_bath, year_remod, total_bsmt_sf, second_flr_sf,
    garage_area, fireplaces, lot_frontage.
    """
    living = float(form["gr_liv_area"])
    lot_area = float(form["lot_area"])
    bedrooms = int(form["bedrooms"])
    full_bath = int(form["full_bath"])
    half_bath = int(form.get("half_bath") or 0)
    garage_cars = int(form.get("garage_cars") or 0)
    year_built = int(form["year_built"])
    overall_qual = int(form["overall_qual"])
    overall_cond = int(form["overall_cond"])

    year_remod = int(form["year_remod"]) if form.get("year_remod") else year_built
    second_flr = float(form.get("second_flr_sf") or 0)
    total_bsmt = float(form.get("total_bsmt_sf") or 0)
    fireplaces = int(form.get("fireplaces") or 0)
    lot_frontage = float(form["lot_frontage"]) if form.get("lot_frontage") else _DEFAULT_LOT_FRONTAGE

    # Smart story estimation if second floor wasn't explicitly given
    if second_flr == 0 and bedrooms >= 3 and living > 1400:
        first_flr = round(living * 0.52)
        second_flr = living - first_flr
        ms_subclass = 60
    elif second_flr > 0:
        first_flr = max(living - second_flr, 0.0)
        ms_subclass = 60
    else:
        first_flr = living
        second_flr = 0.0
        ms_subclass = 20

    garage_area = form.get("garage_area")
    if garage_area is None or garage_area == "":
        garage_area = garage_cars * _GARAGE_AREA_PER_CAR if garage_cars else 0.0
    else:
        garage_area = float(garage_area)

    total_rooms = max(bedrooms + 3, 4)
    garage_yr = year_built if garage_cars > 0 else year_built

    # Smart basement finish estimation
    bsmt_fin = total_bsmt * 0.6 if total_bsmt > 0 and overall_qual >= 6 else 0.0
    bsmt_unf = total_bsmt - bsmt_fin

    # Quality based exterior finish
    mas_vnr = 180.0 if overall_qual >= 8 else (80.0 if overall_qual >= 7 else 0.0)
    wood_deck = 140.0 if overall_qual >= 7 else (60.0 if overall_qual >= 6 else 0.0)
    open_porch = 60.0 if overall_qual >= 7 else 25.0

    row = {
        "MS SubClass": ms_subclass,
        "Lot Frontage": lot_frontage,
        "Lot Area": lot_area,
        "Overall Qual": overall_qual,
        "Overall Cond": overall_cond,
        "Year Built": year_built,
        "Year Remod/Add": year_remod,
        "Mas Vnr Area": mas_vnr,
        "BsmtFin SF 1": bsmt_fin,
        "BsmtFin SF 2": 0.0,
        "Bsmt Unf SF": bsmt_unf,
        "Total Bsmt SF": total_bsmt,
        "1st Flr SF": first_flr,
        "2nd Flr SF": second_flr,
        "Low Qual Fin SF": 0.0,
        "Gr Liv Area": living,
        "Bsmt Full Bath": 1 if total_bsmt > 0 and overall_qual >= 7 else 0,
        "Bsmt Half Bath": 0,
        "Full Bath": full_bath,
        "Half Bath": half_bath,
        "Bedroom AbvGr": bedrooms,
        "Kitchen AbvGr": 1,
        "TotRms AbvGrd": total_rooms,
        "Fireplaces": fireplaces,
        "Garage Yr Blt": garage_yr,
        "Garage Cars": garage_cars,
        "Garage Area": garage_area,
        "Wood Deck SF": wood_deck,
        "Open Porch SF": open_porch,
        "Enclosed Porch": 0.0,
        "3Ssn Porch": 0.0,
        "Screen Porch": 0.0,
        "Pool Area": 0.0,
        "Misc Val": 0.0,
        "Mo Sold": 6,
        "Yr Sold": _AMES_LAST_SALE_YEAR,
    }

    missing = [col for col in NUMERIC_MODEL_FEATURES if col not in row]
    if missing:
        raise ValueError(f"Mapper did not produce columns: {missing}")
    return row


def is_legacy_feature_payload(payload: dict) -> bool:
    """True when the client already sent Ames model column names."""
    return "Gr Liv Area" in payload
