import urllib.request
import json
import time

BASE_URL = "http://127.0.0.1:8088/api/v1"

def test_api():
    print("--- 1. Testing Health Endpoint ---")
    req = urllib.request.Request(f"{BASE_URL}/health")
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        print(f"Health Response: {data}")
        assert data.get("status") == "UP"

    print("\n--- 2. Testing Valuation Estimation Endpoint ---")
    val_payload = {
        "address": "742 Evergreen Terrace",
        "neighborhood": "Northridge Heights",
        "gr_liv_area": 2350.0,
        "lot_area": 9200.0,
        "bedrooms": 4,
        "full_bath": 3,
        "half_bath": 1,
        "year_built": 2018,
        "overall_qual": 8,
        "overall_cond": 6,
        "garage_cars": 2
    }
    req = urllib.request.Request(
        f"{BASE_URL}/valuation/estimate",
        data=json.dumps(val_payload).encode(),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        val_data = json.loads(resp.read().decode())
        print(f"Valuation Output: Estimated Price: ${val_data.get('estimatedValue'):,.2f}")
        print(f"Price Range: ${val_data.get('rangeLow'):,.2f} - ${val_data.get('rangeHigh'):,.2f}")
        print(f"Confidence: {val_data.get('confidenceScore')}% ({val_data.get('confidenceLevel')})")
        print(f"Comparables count: {len(val_data.get('comparables', []))}")
        assert val_data.get("estimatedValue") > 0

    print("\n--- 3. Testing Authentication (Signup & JWT) ---")
    user_email = f"architect_{int(time.time())}@valualtion.com"
    signup_payload = {
        "email": user_email,
        "password": "StrongPassword2026!",
        "fullName": "Enterprise Architect",
        "role": "ROLE_HOMEOWNER"
    }
    req = urllib.request.Request(
        f"{BASE_URL}/auth/signup",
        data=json.dumps(signup_payload).encode(),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        auth_data = json.loads(resp.read().decode())
        token = auth_data.get("token")
        print(f"Registered User: {auth_data.get('email')} (ID: {auth_data.get('id')})")
        print(f"JWT Token generated: {token[:25]}...")
        assert token is not None

    print("\n--- 4. Testing Authenticated /auth/me Endpoint ---")
    req = urllib.request.Request(
        f"{BASE_URL}/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    with urllib.request.urlopen(req) as resp:
        me_data = json.loads(resp.read().decode())
        print(f"Current User Profile: {me_data}")
        assert me_data.get("email") == user_email

    print("\n--- 5. Testing Saving a Property ---")
    prop_payload = {
        "address": "742 Evergreen Terrace",
        "neighborhood": "Northridge Heights",
        "livingAreaSqft": 2350.0,
        "lotArea": 9200.0,
        "bedrooms": 4,
        "fullBath": 3,
        "halfBath": 1,
        "yearBuilt": 2018,
        "overallQual": 8,
        "overallCond": 6,
        "garageCars": 2
    }
    req = urllib.request.Request(
        f"{BASE_URL}/properties",
        data=json.dumps(prop_payload).encode(),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        }
    )
    with urllib.request.urlopen(req) as resp:
        prop_data = json.loads(resp.read().decode())
        print(f"Saved Property ID: {prop_data.get('id')} at {prop_data.get('address')}")
        assert prop_data.get("id") is not None

    print("\n--- 6. Listing User's Saved Properties ---")
    req = urllib.request.Request(
        f"{BASE_URL}/properties",
        headers={"Authorization": f"Bearer {token}"}
    )
    with urllib.request.urlopen(req) as resp:
        props_list = json.loads(resp.read().decode())
        print(f"User has {len(props_list)} saved property(ies):")
        for p in props_list:
            print(f" - {p.get('address')} ({p.get('bedrooms')} bed, {p.get('fullBath')} bath, {p.get('livingAreaSqft')} sqft)")
        assert len(props_list) == 1

    print("\n==========================================")
    print("ALL JAVA BACKEND & ML INTEGRATION TESTS PASSED!")
    print("==========================================")

if __name__ == "__main__":
    test_api()
