import pandas as pd
import joblib
from sklearn.ensemble import RandomForestRegressor

print("🚀 Flood AI model training started...")

# Dataset
data = pd.read_csv("data/flood_data.csv")

print(f"✅ Dataset loaded: {len(data)} rows")

# Features
features = [
    "rainfall",
    "river_level",
    "temperature",
    "humidity",
    "elevation",
    "soil_moisture",
    "historical_flood"
]

X = data[features]
y = data["flood_probability"]

print("✅ Features loaded")

# Model
model = RandomForestRegressor(
    n_estimators=50,
    max_depth=6,
    random_state=42
)

print("🤖 Training model...")

model.fit(X, y)

# Save model
joblib.dump(
    model,
    "model/flood_model.joblib"
)

print("✅ Flood AI model trained successfully!")
print("💾 Model saved at:")
print("model/flood_model.joblib")