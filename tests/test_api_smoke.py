import sys
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import unittest
from api.main import app, health, predict

class TestApiSmoke(unittest.TestCase):
    def setUp(self):
        try:
            from fastapi.testclient import TestClient
            self.client = TestClient(app)
        except Exception:
            self.client = None

    def test_health_check(self):
        if self.client:
            response = self.client.get("/health")
            self.assertEqual(response.status_code, 200)
            data = response.json()
            self.assertEqual(data.get("status"), "ok")
        else:
            data = health()
            self.assertEqual(data.get("status"), "ok")

    def test_predict_endpoint(self):
        payload = {
            "gr_liv_area": 1800.0,
            "lot_area": 8500.0,
            "bedrooms": 3,
            "full_bath": 2,
            "half_bath": 1,
            "garage_cars": 2,
            "year_built": 2005,
            "overall_qual": 7,
            "overall_cond": 5,
            "central_air": True
        }
        if self.client:
            response = self.client.post("/predict", json=payload)
            self.assertEqual(response.status_code, 200)
            data = response.json()
        else:
            res = predict(payload)
            data = res.model_dump()

        self.assertIn("predicted_price", data)
        self.assertGreater(data["predicted_price"], 0)
        self.assertIn("attributions", data)
        self.assertGreater(len(data["attributions"]), 0)

if __name__ == "__main__":
    unittest.main()
