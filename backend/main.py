from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import joblib
import os


# ==================================================
# MODEL
# ==================================================

MODEL_PATH = "model/flood_model.joblib"

model = None

if os.path.exists(MODEL_PATH):
    try:
        model = joblib.load(MODEL_PATH)
        print("✅ Flood AI ML model loaded")
    except Exception as e:
        print("⚠️ Model loading failed:", e)
else:
    print("⚠️ ML model not found")


# ==================================================
# CWC CONFIG
# ==================================================

# Official NWIC/CWC API endpoints can be supplied
# through environment variables when available.
CWC_RIVER_API_URL = os.getenv(
    "CWC_RIVER_API_URL",
    ""
)

CWC_RAINFALL_API_URL = os.getenv(
    "CWC_RAINFALL_API_URL",
    ""
)

CWC_API_KEY = os.getenv(
    "CWC_API_KEY",
    ""
)


# ==================================================
# APP
# ==================================================

app = FastAPI(
    title="Flood AI API",
    description="AI-Powered Flood Risk Prediction System",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================================================
# HOME
# ==================================================

@app.get("/")
def home():

    return {
        "message": "Flood AI Backend is running",
        "status": "online",
        "ml_model_loaded": model is not None,
        "cwc_river_configured": bool(CWC_RIVER_API_URL),
        "cwc_rainfall_configured": bool(
            CWC_RAINFALL_API_URL
        )
    }


   # ==================================================
# LOCATION
# ==================================================

def get_location(location):

    url = "https://geocoding-api.open-meteo.com/v1/search"

    params = {
        "name": location,
        "count": 10,
        "language": "en",
        "format": "json"
    }

    response = requests.get(
        url,
        params=params,
        timeout=10
    )

    response.raise_for_status()

    data = response.json()

    results = data.get("results", [])

    if not results:
        return None

    # ------------------------------------------
    # Prefer India
    # ------------------------------------------

    india_results = [
        place
        for place in results
        if str(
            place.get("country_code", "")
        ).upper() == "IN"
    ]

    if india_results:
        results = india_results

    # ------------------------------------------
    # Prefer Uttar Pradesh
    # ------------------------------------------

    up_results = [
        place
        for place in results
        if str(
            place.get("admin1", "")
        ).lower()
        in [
            "uttar pradesh",
            "uttar pradesh state"
        ]
    ]

    if up_results:
        results = up_results

    # ------------------------------------------
    # Select best result
    # ------------------------------------------

    place = results[0]

    return {
        "name": place.get("name"),
        "latitude": place.get("latitude"),
        "longitude": place.get("longitude"),
        "country": place.get("country"),
        "admin1": place.get("admin1")
    }

# ==================================================
# WEATHER
# ==================================================

def get_weather(
    latitude,
    longitude
):

    url = (
        "https://api.open-meteo.com/v1/forecast"
    )

    params = {

        "latitude": latitude,

        "longitude": longitude,

        "current": (
            "temperature_2m,"
            "relative_humidity_2m,"
            "precipitation,"
            "rain"
        ),

        "hourly": (
            "precipitation,"
            "precipitation_probability"
        ),

        "forecast_days": 1,

        "timezone": "auto"
    }

    response = requests.get(
        url,
        params=params,
        timeout=10
    )

    response.raise_for_status()

    return response.json()


# ==================================================
# ELEVATION
# ==================================================

def get_elevation(
    latitude,
    longitude
):

    url = (
        "https://api.open-meteo.com/v1/elevation"
    )

    params = {
        "latitude": latitude,
        "longitude": longitude
    }

    response = requests.get(
        url,
        params=params,
        timeout=10
    )

    response.raise_for_status()

    data = response.json()

    elevation = data.get(
        "elevation"
    )

    if elevation is None:
        return None

    if isinstance(
        elevation,
        (int, float)
    ):
        return float(elevation)

    if isinstance(
        elevation,
        list
    ):

        if elevation:

            return float(
                elevation[0]
            )

    return None


# ==================================================
# SOIL MOISTURE
# ==================================================

def get_soil_moisture(
    latitude,
    longitude
):

    url = (
        "https://api.open-meteo.com/v1/forecast"
    )

    params = {

        "latitude": latitude,

        "longitude": longitude,

        "hourly":
            "soil_moisture_0_to_7cm",

        "forecast_days": 1,

        "timezone": "auto"
    }

    response = requests.get(
        url,
        params=params,
        timeout=10
    )

    response.raise_for_status()

    data = response.json()

    hourly = data.get(
        "hourly",
        {}
    )

    moisture = hourly.get(
        "soil_moisture_0_to_7cm",
        []
    )

    if moisture:

        return moisture[0]

    return None


# ==================================================
# CWC RIVER DATA
# ==================================================

def get_cwc_river_data(
    latitude,
    longitude
):

    # CWC endpoint is intentionally configurable.
    # Do not hard-code an unverified endpoint.

    if not CWC_RIVER_API_URL:

        return None

    try:

        headers = {}

        if CWC_API_KEY:

            headers["Authorization"] = (
                f"Bearer {CWC_API_KEY}"
            )

        params = {

            "latitude": latitude,

            "longitude": longitude
        }

        response = requests.get(
            CWC_RIVER_API_URL,
            params=params,
            headers=headers,
            timeout=10
        )

        response.raise_for_status()

        data = response.json()

        # Try common field names.
        for key in [
            "river_discharge",
            "water_level",
            "level",
            "riverWaterLevel"
        ]:

            if key in data:

                value = data[key]

                if isinstance(
                    value,
                    list
                ):

                    if value:

                        return float(
                            value[0]
                        )

                if value is not None:

                    return float(value)

        return None

    except Exception as e:

        print(
            "⚠️ CWC river API unavailable:",
            e
        )

        return None


# ==================================================
# FALLBACK RIVER DATA
# ==================================================

def get_open_meteo_river_data(
    latitude,
    longitude
):

    url = (
        "https://flood-api.open-meteo.com/v1/flood"
    )

    params = {

        "latitude": latitude,

        "longitude": longitude,

        "daily":
            "river_discharge",

        "forecast_days": 1,

        "timezone": "auto"
    }

    try:

        response = requests.get(
            url,
            params=params,
            timeout=10
        )

        response.raise_for_status()

        data = response.json()

        daily = data.get(
            "daily",
            {}
        )

        discharge = daily.get(
            "river_discharge",
            []
        )

        if discharge:

            return discharge[0]

        return None

    except Exception as e:

        print(
            "⚠️ Open-Meteo river fallback unavailable:",
            e
        )

        return None


     # ==================================================
# RIVER DISCHARGE
# ==================================================

def get_river_discharge(latitude, longitude):

    url = "https://flood-api.open-meteo.com/v1/flood"

    params = {
        "latitude": latitude,
        "longitude": longitude,

        "daily": "river_discharge",

        "forecast_days": 1,

        "timezone": "auto"
    }

    try:

        response = requests.get(
            url,
            params=params,
            timeout=10
        )

        response.raise_for_status()

        data = response.json()

        daily = data.get(
            "daily",
            {}
        )

        discharge = daily.get(
            "river_discharge",
            []
        )

        if discharge:

            return float(discharge[0])

        return None

    except Exception as e:

        print(
            "⚠️ River discharge unavailable:",
            e
        )

        return None

    # First preference: CWC

    cwc_value = get_cwc_river_data(
        latitude,
        longitude
    )

    if cwc_value is not None:

        print(
            "✅ River data source: CWC"
        )

        return cwc_value

    # Temporary fallback

    fallback = get_open_meteo_river_data(
        latitude,
        longitude
    )

    if fallback is not None:

        print(
            "ℹ️ River data source: Open-Meteo fallback"
        )

    return fallback


# ==================================================
# FORECAST RAINFALL
# ==================================================

def get_forecast_rainfall(
    latitude,
    longitude
):

    url = (
        "https://api.open-meteo.com/v1/forecast"
    )

    params = {

        "latitude": latitude,

        "longitude": longitude,

        "hourly": (
            "precipitation,"
            "precipitation_probability"
        ),

        "forecast_days": 1,

        "timezone": "auto"
    }

    response = requests.get(
        url,
        params=params,
        timeout=10
    )

    response.raise_for_status()

    data = response.json()

    hourly = data.get(
        "hourly",
        {}
    )

    rainfall = hourly.get(
        "precipitation",
        []
    )

    probability = hourly.get(
        "precipitation_probability",
        []
    )

    total_rainfall = sum(
        value or 0
        for value in rainfall
    )

    max_probability = max(
        probability or [0]
    )

    return {

        "forecast_rainfall":
            round(
                total_rainfall,
                2
            ),

        "rain_probability":
            max_probability
    }


# ==================================================
# ML PREDICTION
# ==================================================

def predict_with_model(
    rainfall,
    river_level,
    temperature,
    humidity,
    elevation,
    soil_moisture
):

    if model is None:

        return None

    values = [

        0 if rainfall is None
        else float(rainfall),

        0 if river_level is None
        else float(river_level),

        0 if temperature is None
        else float(temperature),

        0 if humidity is None
        else float(humidity),

        0 if elevation is None
        else float(elevation),

        0 if soil_moisture is None
        else float(soil_moisture),

        # Historical flood feature.
        # Live API does not directly provide it.
        0
    ]

    try:

        # If classifier supports probability
        if hasattr(
            model,
            "predict_proba"
        ):

            probability = (
                model.predict_proba(
                    [values]
                )[0]
            )

            # Positive class probability
            if len(probability) >= 2:

                return round(
                    float(
                        probability[1] * 100
                    )
                )

        # Fallback
        prediction = model.predict(
            [values]
        )[0]

        return round(
            float(prediction)
        )

    except Exception as e:

        print(
            "⚠️ ML prediction failed:",
            e
        )

        return None


# ==================================================
# TEMPORARY FALLBACK FLOOD SCORE
# ==================================================

def calculate_flood_score(
    rainfall,
    humidity,
    soil_moisture,
    forecast_rainfall,
    river_discharge=None
):

    rainfall = rainfall or 0

    humidity = humidity or 0

    soil_moisture = (
        soil_moisture or 0
    )

    forecast_rainfall = (
        forecast_rainfall or 0
    )

    score = (

        rainfall * 4

        + humidity * 0.12

        + soil_moisture * 15

        + forecast_rainfall * 1.5
    )

    if river_discharge is not None:

        try:

            score += min(
                float(river_discharge) * 0.05,
                10
            )

        except Exception:
            pass

    return min(
        100,
        round(score)
    )


# ==================================================
# RISK LEVEL
# ==================================================

def get_risk_level(
    score
):

    if score < 30:

        return "Low"

    elif score < 60:

        return "Moderate"

    elif score < 80:

        return "High"

    else:

        return "Critical"


# ==================================================
# ALERT
# ==================================================

def get_alert(
    risk_level
):

    if risk_level == "Low":

        return (
            "Current conditions indicate "
            "low flood risk."
        )

    elif risk_level == "Moderate":

        return (
            "Rainfall and environmental "
            "conditions should be monitored."
        )

    elif risk_level == "High":

        return (
            "High flood risk indicators "
            "detected. Stay alert."
        )

    return (
        "Critical flood conditions detected. "
        "Immediate monitoring is recommended."
    )


# ==================================================
# MAIN PREDICTION API
# ==================================================

@app.get("/predict")
def predict(
    location: str = "Lucknow"
):

    try:

        # ------------------------------------------
        # 1. LOCATION
        # ------------------------------------------

        place = get_location(
            location
        )

        if not place:

            return {
                "error":
                    "Location not found"
            }

        latitude = place[
            "latitude"
        ]

        longitude = place[
            "longitude"
        ]


        # ------------------------------------------
        # 2. WEATHER
        # ------------------------------------------

        weather = get_weather(
            latitude,
            longitude
        )

        current = weather.get(
            "current",
            {}
        )

        temperature = current.get(
            "temperature_2m"
        )

        humidity = current.get(
            "relative_humidity_2m"
        )

        rainfall = current.get(
            "precipitation"
        )


        # ------------------------------------------
        # 3. ELEVATION
        # ------------------------------------------

        elevation = get_elevation(
            latitude,
            longitude
        )


        # ------------------------------------------
        # 4. SOIL
        # ------------------------------------------

        soil_moisture = (
            get_soil_moisture(
                latitude,
                longitude
            )
        )


        # ------------------------------------------
        # 5. RIVER
        # ------------------------------------------

        river_discharge = get_river_discharge(
          latitude,
         longitude
          )

        # ------------------------------------------
        # 6. FORECAST
        # ------------------------------------------

        forecast = (
            get_forecast_rainfall(
                latitude,
                longitude
            )
        )

        forecast_rainfall = (
            forecast[
                "forecast_rainfall"
            ]
        )

        rain_probability = (
            forecast[
                "rain_probability"
            ]
        )


        # ------------------------------------------
        # 7. ML PREDICTION
        # ------------------------------------------
        flood_probability = calculate_flood_score(

    rainfall,

    humidity,

    soil_moisture,

    forecast_rainfall,

    river_discharge
)

        # ------------------------------------------
        # 8. FALLBACK
        # ------------------------------------------

        prediction_source = "ML Model"

        if flood_probability is None:

            flood_probability = (
                calculate_flood_score(

                    rainfall,

                    humidity,

                    soil_moisture,

                    forecast_rainfall,

                    river_level
                )
            )

            prediction_source = (
                "Rule-based fallback"
            )


        flood_probability = min(
            max(
                float(flood_probability),
                0
            ),
            100
        )

        flood_probability = round(
            flood_probability
        )


        # ------------------------------------------
        # 9. RISK
        # ------------------------------------------

        risk_level = get_risk_level(
            flood_probability
        )


        # ------------------------------------------
        # 10. ALERT
        # ------------------------------------------

        alert = get_alert(
            risk_level
        )


        # ------------------------------------------
        # 11. RESPONSE
        # ------------------------------------------

        return {

            "location":
                place["name"],

            "country":
                place["country"],

            "region":
                place["admin1"],

            "latitude":
                latitude,

            "longitude":
                longitude,

            "flood_probability":
                flood_probability,

            "risk_level":
                risk_level,

            "prediction_source":
                prediction_source,

            "rainfall":
                rainfall,

            "forecast_rainfall":
                forecast_rainfall,

            "rain_probability":
                rain_probability,

            "river_discharge":
            river_discharge,

            "temperature":
                temperature,

            "humidity":
                humidity,

            "elevation":
                elevation,

            "soil_moisture":
                soil_moisture,

            "alert":
                alert
        }


    except Exception as e:

        print(
            "❌ Prediction error:",
            e
        )

        return {
            "error": str(e)
        }