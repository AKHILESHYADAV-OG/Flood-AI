import { useState } from "react";
import "./App.css";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

const API_URL = "http://127.0.0.1:8000";

/* =====================================================
   MAP CONTROLLER
===================================================== */

function MapController({ latitude, longitude }) {
  const map = useMap();

  if (
    latitude !== null &&
    latitude !== undefined &&
    longitude !== null &&
    longitude !== undefined
  ) {
    map.setView(
      [Number(latitude), Number(longitude)],
      11,
      {
        animate: true
      }
    );
  }

  return null;
}

/* =====================================================
   MAIN APP
===================================================== */

function App() {
  const [page, setPage] = useState("login");

  const [user, setUser] = useState(null);

  const handleLogin = (name, email) => {
    setUser({
      name,
      email
    });

    setPage("dashboard");
  };

  const handleSignup = (name, email) => {
    setUser({
      name,
      email
    });

    setPage("dashboard");
  };

  const handleLogout = () => {
    setUser(null);

    setPage("login");
  };

  if (page === "login") {
    return (
      <Login
        onLogin={handleLogin}
        goToSignup={() => setPage("signup")}
      />
    );
  }

  if (page === "signup") {
    return (
      <Signup
        onSignup={handleSignup}
        goToLogin={() => setPage("login")}
      />
    );
  }

  return (
    <Dashboard
      user={user}
      onLogout={handleLogout}
    />
  );
}

/* =====================================================
   LOGIN
===================================================== */

function Login({
  onLogin,
  goToSignup
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitLogin = (e) => {
    e.preventDefault();

    const username =
      email.split("@")[0] || "User";

    onLogin(
      username,
      email
    );
  };

  return (
    <div className="auth-page">

      <div className="auth-brand-section">

        <div className="brand">

          <div className="brand-icon">
            🌊
          </div>

          <div>
            <h1>FloodGuard AI</h1>

            <p>
              AI-Powered Flood Intelligence
            </p>
          </div>

        </div>

        <div className="auth-hero">

          <div className="hero-symbol">
            🌱
          </div>

          <h2>
            Predict Floods.
            <br />
            Protect Communities.
          </h2>

          <p>
            FloodGuard AI combines rainfall,
            river levels, weather,
            terrain and historical data
            to predict flood risk using
            artificial intelligence.
          </p>

          <div className="feature-list">

            <span>
              ✓ AI Risk Prediction
            </span>

            <span>
              ✓ Weather Intelligence
            </span>

            <span>
              ✓ Smart Flood Alerts
            </span>

          </div>

        </div>

      </div>

      <div className="auth-form-section">

        <div className="auth-form">

          <div className="mobile-brand">
            🌊 FloodGuard AI
          </div>

          <h2>
            Welcome Back
          </h2>

          <p className="auth-description">
            Sign in to access your
            flood intelligence dashboard.
          </p>

          <form onSubmit={submitLogin}>

            <label>
              Email Address
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            <div className="form-options">

              <label className="remember">

                <input type="checkbox" />

                Remember me

              </label>

              <button
                type="button"
                className="link-button"
              >
                Forgot Password?
              </button>

            </div>

            <button
              type="submit"
              className="primary-button"
            >
              Sign In →
            </button>

          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <button className="google-button">

            <strong>
              G
            </strong>

            Continue with Google

          </button>

          <p className="switch-text">

            Don't have an account?

            <button onClick={goToSignup}>
              Create Account
            </button>

          </p>

        </div>

      </div>

    </div>
  );
}

/* =====================================================
   SIGNUP
===================================================== */

function Signup({
  onSignup,
  goToLogin
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitSignup = (e) => {
    e.preventDefault();

    onSignup(
      name,
      email
    );
  };

  return (
    <div className="auth-page">

      <div className="auth-brand-section">

        <div className="brand">

          <div className="brand-icon">
            🌊
          </div>

          <div>

            <h1>
              FloodGuard AI
            </h1>

            <p>
              AI-Powered Flood Intelligence
            </p>

          </div>

        </div>

        <div className="auth-hero">

          <div className="hero-symbol">
            🛡️
          </div>

          <h2>
            Stay Ahead
            <br />
            of Floods.
          </h2>

          <p>
            Create your FloodGuard AI
            account and monitor
            environmental conditions
            for any location.
          </p>

          <div className="feature-list">

            <span>
              ✓ Location Analysis
            </span>

            <span>
              ✓ Environmental Data
            </span>

            <span>
              ✓ AI Flood Insights
            </span>

          </div>

        </div>

      </div>

      <div className="auth-form-section">

        <div className="auth-form">

          <div className="mobile-brand">
            🌊 FloodGuard AI
          </div>

          <h2>
            Create Account
          </h2>

          <p className="auth-description">
            Start monitoring flood risks
            with AI.
          </p>

          <form onSubmit={submitSignup}>

            <label>
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />

            <label>
              Email Address
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            <label className="remember terms">

              <input
                type="checkbox"
                required
              />

              I agree to the Terms &
              Privacy Policy

            </label>

            <button
              type="submit"
              className="primary-button"
            >
              Create Account →
            </button>

          </form>

          <p className="switch-text">

            Already have an account?

            <button onClick={goToLogin}>
              Sign In
            </button>

          </p>

        </div>

      </div>

    </div>
  );
}

/* =====================================================
   DASHBOARD
===================================================== */

function Dashboard({
  user,
  onLogout
}) {
  const [location, setLocation] = useState("");

  const [
    analyzedLocation,
    setAnalyzedLocation
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [riskData, setRiskData] =
    useState({

      location: "",
      country: "",
      region: "",

      latitude: null,
      longitude: null,

      flood_probability: null,
      risk_level: "",

      rainfall: null,
      forecast_rainfall: null,
      rain_probability: null,

      river_discharge: null,

      temperature: null,
      humidity: null,

      elevation: null,
      soil_moisture: null,

      alert: ""

    });

  /* ===================================================
     ANALYZE LOCATION
  =================================================== */

  const analyzeLocation = async () => {

    const searchedLocation =
      location.trim();

    if (!searchedLocation) {

      setError(
        "Please enter a location."
      );

      return;
    }

    setLoading(true);
    setError("");

    try {

      const response =
        await fetch(
          `${API_URL}/predict?location=${encodeURIComponent(
            searchedLocation
          )}`
        );

      if (!response.ok) {

        throw new Error(
          `Backend returned ${response.status}`
        );

      }

      const data =
        await response.json();

      console.log(
        "FloodGuard AI API Response:",
        data
      );

      if (data.error) {

        throw new Error(
          data.error
        );

      }

      setRiskData({

        location:
          data.location ??
          searchedLocation,

        country:
          data.country ??
          "",

        region:
          data.region ??
          "",

        latitude:
          data.latitude ??
          null,

        longitude:
          data.longitude ??
          null,

        flood_probability:
          data.flood_probability ??
          null,

        risk_level:
  data.risk_level ??
  "",

rainfall:
  data.rainfall ??
  null,

forecast_rainfall:
  data.forecast_rainfall ??
  null,

rain_probability:
  data.rain_probability ??
  null,

river_discharge:
  data.river_discharge ??
  null,

temperature:
  data.temperature ??
  null,

humidity:
  data.humidity ??
  null,

elevation:
  data.elevation ??
  null,

soil_moisture:
  data.soil_moisture ??
  null,

alert:
  data.alert ??
  "No alert information available."

      });

      setAnalyzedLocation(
        data.location ??
        searchedLocation
      );

    } catch (err) {

      console.error(
        "FloodGuard AI Error:",
        err
      );

      setError(
        `Unable to analyze location: ${err.message}`
      );

    } finally {

      setLoading(false);

    }
  };

  /* ===================================================
     FORMATTING
  =================================================== */

  const formatValue = (
    value,
    unit = "",
    decimals = 1
  ) => {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "--";
    }

    const number =
      Number(value);

    if (Number.isNaN(number)) {
      return "--";
    }

    return `${number.toFixed(
      decimals
    )}${unit}`;
  };

  /* ===================================================
     SOIL MOISTURE
  =================================================== */

  const soilMoisturePercent =
    () => {

      const value =
        riskData.soil_moisture;

      if (
        value === null ||
        value === undefined ||
        value === ""
      ) {
        return null;
      }

      const number =
        Number(value);

      if (
        Number.isNaN(number)
      ) {
        return null;
      }

      if (number <= 1) {
        return number * 100;
      }

      return number;
    };

  /* ===================================================
     DYNAMIC RISK PROBABILITY
  =================================================== */

  const getRiskProbability =
    () => {

      const value =
        Number(
          riskData.flood_probability
        );

      if (
        Number.isNaN(value)
      ) {
        return 0;
      }

      return Math.min(
        Math.max(
          value,
          0
        ),
        100
      );
    };

  /* ===================================================
     DYNAMIC RISK COLOR
  =================================================== */

  const getRiskColor =
    () => {

      const probability =
        getRiskProbability();

      if (
        probability >= 80
      ) {
        return "#dc2626";
      }

      if (
        probability >= 60
      ) {
        return "#f97316";
      }

      if (
        probability >= 30
      ) {
        return "#eab308";
      }

      return "#16a34a";
    };

  /* ===================================================
     DYNAMIC RISK LABEL
  =================================================== */

  const getRiskLabel =
    () => {

      const probability =
        getRiskProbability();

      if (
        probability >= 80
      ) {
        return "Critical";
      }

      if (
        probability >= 60
      ) {
        return "High";
      }

      if (
        probability >= 30
      ) {
        return "Moderate";
      }

      return "Low";
    };

  /* ===================================================
     SINGLE DYNAMIC RISK SOURCE
  =================================================== */

  const riskProbability =
    getRiskProbability();

  const riskColor =
    getRiskColor();

  const riskLabel =
    getRiskLabel();

  /*
    IMPORTANT:

    Map marker now uses exactly the same
    color as the risk circle, progress bar,
    status and alert.

    API probability
        ↓
    riskProbability
        ↓
    riskColor
        ↓
    mapColor
  */

  const mapColor =
    riskColor;
    /* ===================================================
   AI INSIGHTS
=================================================== */
const getInsights = () => {

  const insights = [];

  const rainfall =
    Number(riskData.rainfall);

  const forecastRainfall =
    Number(riskData.forecast_rainfall);

  const riverDischarge =
    Number(riskData.river_discharge);

  const soil =
    soilMoisturePercent();

  const humidity =
    Number(riskData.humidity);

  const probability =
    Number(riskData.flood_probability);

  // Heavy rainfall
  if (
    !Number.isNaN(rainfall) &&
    rainfall >= 50
  ) {

    insights.push({

      title:
        "Heavy rainfall",

      text:
        `Rainfall is currently ${rainfall.toFixed(
          1
        )} mm and may increase flood risk.`

    });

  }

  // Forecast rainfall
  if (
    !Number.isNaN(forecastRainfall) &&
    forecastRainfall >= 20
  ) {

    insights.push({

      title:
        "Rain expected",

      text:
        `Forecast rainfall is ${forecastRainfall.toFixed(
          1
        )} mm.`

    });

  }

  // River monitoring
  if (
    !Number.isNaN(riverDischarge) &&
    riverDischarge > 0
  ) {

    insights.push({

      title:
        "River monitoring",

      text:
        `Current river discharge is ${riverDischarge.toFixed(
          2
        )} m³/s.`

    });

  }

  // Soil moisture
  if (
    soil !== null &&
    soil >= 70
  ) {

    insights.push({

      title:
        "High soil moisture",

      text:
        `Soil moisture is ${soil.toFixed(
          1
        )}%, which may increase water accumulation.`

    });

  }

  // Humidity
  if (
    !Number.isNaN(humidity) &&
    humidity >= 85
  ) {

    insights.push({

      title:
        "High humidity",

      text:
        `Humidity is currently ${humidity.toFixed(
          1
        )}%.`

    });

  }

  // Flood probability
  if (
    !Number.isNaN(probability) &&
    probability >= 60
  ) {

    insights.push({

      title:
        "Elevated flood probability",

      text:
        `AI currently estimates a ${probability.toFixed(
          0
        )}% flood probability.`

    });

  }

  // No insights
  if (
    insights.length === 0
  ) {

    insights.push({

      title:
        "Conditions currently stable",

      text:
        "Available environmental indicators do not show a major immediate risk."

    });

  }

  return insights.slice(
    0,
    3
  );
};


const insights =
  getInsights();
  /* ===================================================
     RISK CLASS
  =================================================== */

  const getRiskClass =
    () => {

      const level =
        String(
          riskData.risk_level ||
          ""
        ).toLowerCase();

      if (
        level.includes(
          "critical"
        )
      ) {
        return "risk-critical";
      }

      if (
        level.includes("high")
      ) {
        return "risk-high";
      }

      if (
        level.includes(
          "moderate"
        )
      ) {
        return "risk-moderate";
      }

      if (
        level.includes("low")
      ) {
        return "risk-low";
      }

      return "";
    };

  return (

    <div className="dashboard">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="sidebar">

        <div className="sidebar-brand">

          <div className="sidebar-logo">
            🌊
          </div>

          <div>

            <h2>
              FloodGuard AI
            </h2>

            <span>
              Intelligence Platform
            </span>

          </div>

        </div>

        <nav>

          <p className="menu-title">
            MAIN MENU
          </p>

          <button className="menu-item active">

            <span>
              ▦
            </span>

            Dashboard

          </button>

          <button className="menu-item">

            <span>
              🗺️
            </span>

            Risk Map

          </button>

          <button className="menu-item">

            <span>
              📊
            </span>

            Analytics

          </button>

          <button className="menu-item">

            <span>
              🔔
            </span>

            Alerts

            <small>
              {riskData.alert
                ? "1"
                : "0"}
            </small>

          </button>

          <p className="menu-title">
            SYSTEM
          </p>

          <button className="menu-item">

            <span>
              ⚙️
            </span>

            Settings

          </button>

          <button className="menu-item">

            <span>
              ❓
            </span>

            Help Center

          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="eco-card">

            <span>
              🌱
            </span>

            <strong>
              Eco Intelligence
            </strong>

            <p>
              Smart technology for safer
              communities.
            </p>

          </div>

          <button
            className="logout-button"
            onClick={onLogout}
          >
            ↪ Logout
          </button>

        </div>

      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="main">

        <header className="topbar">

          <div>

            <span className="top-label">
              FLOOD INTELLIGENCE
            </span>

            <h1>
              Good Afternoon,{" "}
              {user?.name ||
                "User"} 👋
            </h1>

          </div>

          <div className="user-area">

            <button className="notification">
              🔔
            </button>

            <div className="user-profile">

              <div className="avatar">

                {(user?.name ||
                  "U")
                  .charAt(0)
                  .toUpperCase()}

              </div>

              <div className="user-info">

                <strong>
                  {user?.name ||
                    "User"}
                </strong>

                <span>
                  Flood Monitor
                </span>

              </div>

            </div>

          </div>

        </header>

        {/* =================================================
            LOCATION ANALYSIS
        ================================================= */}

        <section className="analysis-banner">

          <div className="banner-content">

            <span className="banner-label">
              AI LOCATION ANALYSIS
            </span>

            <h2>
              Check Flood Risk
            </h2>

            <p>
              Analyze environmental
              conditions for any location.
            </p>

          </div>

          <div>

            <div className="location-box">

              <span>
                📍
              </span>

              <input
                type="text"
                placeholder="Enter location e.g. Lucknow"
                value={location}
                onChange={(e) =>
                  setLocation(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {

                  if (
                    e.key === "Enter"
                  ) {
                    analyzeLocation();
                  }

                }}
              />

              <button
                onClick={
                  analyzeLocation
                }
                disabled={loading}
              >

                {loading
                  ? "Analyzing..."
                  : "Analyze"}

              </button>

            </div>

            {error && (

              <p className="analysis-error">
                ⚠️ {error}
              </p>

            )}

          </div>

        </section>

        {/* =================================================
            RISK
        ================================================= */}

        <section className="risk-layout">

          <div className="risk-card">

            <div className="card-top">

              <div>

                <span className="card-label">
                  CURRENT FLOOD RISK
                </span>

                <h2>
                  {analyzedLocation ||
                    "No location analyzed"}
                </h2>

              </div>

              <span className="live">
                ● LIVE
              </span>

            </div>

            <div className="risk-body">

              {/* =================================================
                  DYNAMIC RISK CIRCLE
              ================================================= */}

              <div
                className="risk-score"
                style={{
                  background: `
                    radial-gradient(
                      circle,
                      white 57%,
                      transparent 58%
                    ),
                    conic-gradient(
                      ${riskColor} 0 ${riskProbability}%,
                      #e7eeea ${riskProbability}% 100%
                    )
                  `
                }}
              >

                <div className="score-inner">

                  <strong>
                    {riskData.flood_probability !==
                    null
                      ? Math.round(
                          riskProbability
                        )
                      : "--"}
                  </strong>

                  {riskData.flood_probability !==
                    null && (
                    <span>
                      %
                    </span>
                  )}

                  <small>
                    Probability
                  </small>

                </div>

              </div>

              <div className="risk-info">

                <div
                  className={`risk-status ${getRiskClass()}`}
                >

                  <i
                    style={{
                      background:
                        riskColor
                    }}
                  ></i>

                  <strong
                    style={{
                      color:
                        riskData.flood_probability !==
                        null
                          ? riskColor
                          : undefined
                    }}
                  >

                    {riskData.flood_probability !==
                    null
                      ? `${riskLabel} Risk`
                      : "Waiting for analysis"}

                  </strong>

                </div>

                <p>

                  {riskData.alert ||
                    "Enter a location and analyze it to receive AI flood intelligence."}

                </p>

                {/* =================================================
                    DYNAMIC PROGRESS
                ================================================= */}

                <div className="progress">

                  <div
                    style={{
                      width:
                        `${riskProbability}%`,

                      background:
                        riskColor,

                      transition:
                        "width 0.5s ease, background 0.3s ease"
                    }}
                  ></div>

                </div>

                <div className="progress-labels">

                  <span>
                    Low
                  </span>

                  <span>
                    Moderate
                  </span>

                  <span>
                    High
                  </span>

                  <span>
                    Critical
                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* ALERT */}

          <div
            className="alert-box"
            style={{
              borderTop:
                `4px solid ${riskColor}`
            }}
          >

            <div className="alert-symbol">
              ⚠️
            </div>

            <span className="card-label">
              AI ALERT
            </span>

            <h3>

              {riskData.flood_probability !==
              null
                ? `${riskLabel} Conditions`
                : "Awaiting Analysis"}

            </h3>

            <p>

              {riskData.alert ||
                "Analyze a location to receive flood alerts."}

            </p>

            <button>
              View Alert →
            </button>

          </div>

        </section>

        {/* =================================================
            ENVIRONMENT
        ================================================= */}

        <section className="section-title">

          <div>

            <h2>
              Environmental Conditions
            </h2>

            <p>
              Latest environmental indicators
            </p>

          </div>

          <span>

            ●{" "}
            {analyzedLocation
              ? "Updated from API"
              : "Waiting for analysis"}

          </span>

        </section>

        <section className="stats">

          <Stat
            icon="🌧️"
            name="Rainfall"
            value={
              riskData.rainfall
            }
            unit="mm"
            trend="LIVE"
          />

         <Stat
        icon="🌊"
          name="River Discharge"
        value={
       riskData.river_discharge
        }
        unit="m³/s"
          trend="LIVE"
         decimals={2}
         />

          <Stat
            icon="🌡️"
            name="Temperature"
            value={
              riskData.temperature
            }
            unit="°C"
            trend="LIVE"
          />

          <Stat
            icon="💧"
            name="Humidity"
            value={
              riskData.humidity
            }
            unit="%"
            trend="LIVE"
          />

          <Stat
            icon="⛰️"
            name="Elevation"
            value={
              riskData.elevation
            }
            unit="m"
            trend="LIVE"
          />

          <Stat
            icon="🌱"
            name="Soil Moisture"
            value={
              soilMoisturePercent()
            }
            unit="%"
            trend="LIVE"
          />

        </section>

        {/* =================================================
            LOCATION INFORMATION
        ================================================= */}

        {analyzedLocation && (

          <section className="location-details">

            <div>

              <strong>
                📍 {analyzedLocation}
              </strong>

              <span>

                {riskData.region
                  ? `${riskData.region}, `
                  : ""}

                {riskData.country ||
                  ""}

              </span>

            </div>

            {riskData.latitude !==
              null &&
              riskData.longitude !==
                null && (

              <span>

                Coordinates:{" "}

                {Number(
                  riskData.latitude
                ).toFixed(4)}

                ,{" "}

                {Number(
                  riskData.longitude
                ).toFixed(4)}

              </span>

            )}

          </section>

        )}

        {/* =================================================
            LOWER SECTION
        ================================================= */}

        <section className="lower-section">

          {/* =================================================
              REAL MAP
          ================================================= */}

          <div className="map-card">

            <div className="card-heading">

              <div>

                <h2>
                  🗺️ Flood Risk Map
                </h2>

                <p>
                  Real geographic risk visualization
                </p>

              </div>

              <button>
                Full Map →
              </button>

            </div>

            <div className="map-area">

              <MapContainer
                center={[
                  riskData.latitude ??
                    26.8393,

                  riskData.longitude ??
                    80.9231
                ]}
                zoom={11}
                scrollWheelZoom={true}
                className="real-map"
              >

                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController
                  latitude={
                    riskData.latitude
                  }
                  longitude={
                    riskData.longitude
                  }
                />

                {riskData.latitude !==
                  null &&
                  riskData.longitude !==
                    null && (

                  <CircleMarker

                    center={[
                      Number(
                        riskData.latitude
                      ),

                      Number(
                        riskData.longitude
                      )
                    ]}

                    radius={14}

                    pathOptions={{
                      /*
                        SAME riskColor used by:
                        - Risk circle
                        - Progress bar
                        - Risk status
                        - Alert
                        - Map marker
                      */

                      color:
                        mapColor,

                      fillColor:
                        mapColor,

                      fillOpacity:
                        0.75,

                      weight: 3
                    }}

                  >

                    <Popup>

                      <div className="map-popup">

                        <strong>
                          📍{" "}
                          {analyzedLocation}
                        </strong>

                        <br />

                        <span>
                          Flood Risk:{" "}
                          <b
                            style={{
                              color:
                                mapColor
                            }}
                          >
                            {riskData.flood_probability !==
                            null
                              ? riskLabel
                              : riskData.risk_level ||
                                "--"}
                          </b>
                        </span>

                        <br />

                        <span>
                          Probability:{" "}
                          <b
                            style={{
                              color:
                                mapColor
                            }}
                          >
                            {riskData.flood_probability !==
                            null
                              ? `${Math.round(
                                  riskProbability
                                )}%`
                              : "--"}
                          </b>
                        </span>

                      </div>

                    </Popup>

                  </CircleMarker>

                )}

              </MapContainer>

              {/* MAP LEGEND */}

              <div className="legend">

                <span>

                  <i className="green"></i>

                  Low

                </span>

                <span>

                  <i className="yellow"></i>

                  Moderate

                </span>

                <span>

                  <i className="orange"></i>

                  High

                </span>

                <span>

                  <i className="red"></i>

                  Critical

                </span>

              </div>

            </div>

          </div>

          {/* =================================================
              AI INSIGHTS
          ================================================= */}

          <div className="ai-card">

            <div className="card-heading">

              <div>

                <h2>
                  🤖 AI Insights
                </h2>

                <p>
                  Risk factors detected
                  from live data
                </p>

              </div>

            </div>

            {insights.map(
              (
                item,
                index
              ) => (

                <Insight
                  key={index}
                  number={String(
                    index + 1
                  ).padStart(
                    2,
                    "0"
                  )}
                  title={
                    item.title
                  }
                  text={
                    item.text
                  }
                />

              )
            )}

            <button
              className="report-button"
            >
              View AI Report →
            </button>

          </div>

        </section>

        {/* FOOTER */}

        <footer>

          <span>
            © 2026 FloodGuard AI
          </span>

          <span>
            🌱 Built for safer &
            sustainable communities
          </span>

        </footer>

      </main>

    </div>
  );
}

/* =====================================================
   STAT COMPONENT
===================================================== */

function Stat({
  icon,
  name,
  value,
  unit,
  trend,
  decimals = 1
}) {

  const displayValue =
    value === null ||
    value === undefined ||
    value === ""
      ? "--"
      : Number.isNaN(
          Number(value)
        )
        ? "--"
        : Number(value).toFixed(
            decimals
          );

  return (

    <div className="stat-card">

      <div className="stat-header">

        <div className="stat-icon">
          {icon}
        </div>

        <span>
          {trend}
        </span>

      </div>

      <p>
        {name}
      </p>

      <div className="stat-number">

        <strong>
          {displayValue}
        </strong>

        <small>

          {displayValue !==
          "--"
            ? unit
            : ""}

        </small>

      </div>

    </div>

  );
}

/* =====================================================
   AI INSIGHT COMPONENT
===================================================== */

function Insight({
  number,
  title,
  text
}) {

  return (

    <div className="insight">

      <span>
        {number}
      </span>

      <div>

        <strong>
          {title}
        </strong>

        <p>
          {text}
        </p>

      </div>

    </div>

  );
}

export default App;