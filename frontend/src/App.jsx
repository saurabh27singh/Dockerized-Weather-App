import React, { useState, useEffect } from 'react';
import { Search, MapPin, Thermometer, Droplets, Wind, Eye, Cloud, Sun, Umbrella, CloudRain, Snowflake } from 'lucide-react';
import './App.css';

const WeatherDashboard = () => {
  const [location, setLocation] = useState('Ayodhya, Uttar Pradesh, India');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeatherData = async (loc) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:8000/weather?location=${encodeURIComponent(loc)}&timestep=1d`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(`Failed to fetch weather data: ${err.message}`);
      console.error('Error fetching weather data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load initial data
    fetchWeatherData(location);
  }, []);

  const handleSubmit = () => {
    if (location.trim()) {
      fetchWeatherData(location);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getWeatherIcon = (code) => {
    if (code >= 4000) return <Umbrella className="w-10 h-10 text-blue-400" />;
    if (code >= 3000) return <CloudRain className="w-10 h-10 text-slate-500" />;
    if (code >= 2000) return <Cloud className="w-10 h-10 text-gray-400" />;
    if (code >= 1000) return <Snowflake className="w-10 h-10 text-blue-200" />;
    return <Sun className="w-10 h-10 text-amber-400" />;
  };

  const getTemperatureColor = (temp) => {
    if (temp >= 30) return 'temp-hot';
    if (temp >= 20) return 'temp-warm';
    if (temp >= 10) return 'temp-mild';
    if (temp >= 0) return 'temp-cool';
    return 'temp-cold';
  };

  const WeatherCard = ({ day, index }) => (
    <div className="weather-card">
      <div className="card-header">
        <div>
          <h3 className="card-date">
            {index === 0 ? 'Today' : formatDate(day.time).split(',')[0]}
          </h3>
          {index !== 0 && (
            <p className="card-full-date">
              {formatDate(day.time).split(',').slice(1).join(',')}
            </p>
          )}
        </div>
        <div className="card-weather-icon">
          {getWeatherIcon(day.values.weatherCodeMax)}
        </div>
      </div>
      
      <div className="temperature-display">
        <div className="temperature-main">
          <span className={`temp-max ${getTemperatureColor(day.values.temperatureMax)}`}>
            {Math.round(day.values.temperatureMax)}°
          </span>
          <span className="temp-min">
            / {Math.round(day.values.temperatureMin)}°
          </span>
        </div>
        <div className="temperature-bar">
          <div 
            className="temperature-indicator"
            style={{ width: `${Math.min(100, (day.values.temperatureMax + 10) * 2)}%` }}
          />
        </div>
      </div>
      
      <div className="metrics-grid">
        <div className="metric-item metric-humidity">
          <Droplets className="w-5 h-5 text-blue-500" />
          <div>
            <p className="metric-label">Humidity</p>
            <p className="metric-value">{Math.round(day.values.humidityAvg)}%</p>
          </div>
        </div>
        
        <div className="metric-item metric-wind">
          <Wind className="w-5 h-5 text-slate-500" />
          <div>
            <p className="metric-label">Wind</p>
            <p className="metric-value">{Math.round(day.values.windSpeedAvg)} m/s</p>
          </div>
        </div>
        
        <div className="metric-item metric-visibility">
          <Eye className="w-5 h-5 text-purple-500" />
          <div>
            <p className="metric-label">Visibility</p>
            <p className="metric-value">{Math.round(day.values.visibilityAvg)} km</p>
          </div>
        </div>
        
        <div className="metric-item metric-uv">
          <Sun className="w-5 h-5 text-amber-500" />
          <div>
            <p className="metric-label">UV Index</p>
            <p className="metric-value">{Math.round(day.values.uvIndexMax)}</p>
          </div>
        </div>
      </div>
      
      <div className="card-footer">
        <div className="rain-probability">
          <div className="rain-indicator" />
          <span>Rain: {Math.round(day.values.precipitationProbabilityAvg)}%</span>
        </div>
        {day.values.rainAccumulationSum > 0 && (
          <div className="rain-accumulation">
            <Droplets className="w-3 h-3" />
            <span>{day.values.rainAccumulationSum.toFixed(1)} mm</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="weather-dashboard">
      <div className="weather-container">
        {/* Header */}
        <div className="weather-header">
          <h1 className="weather-title">Weather Dashboard</h1>
          <p className="weather-subtitle">Get detailed weather forecasts for any location</p>
          <div className="weather-divider" />
        </div>

        {/* Search Form */}
        <div className="weather-search">
          <div className="search-container">
            <div className="search-form">
              <div className="search-input-group">
                <MapPin />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location (e.g., New York, London)"
                  className="search-input"
                />
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="search-button"
              >
                <Search className="w-5 h-5" />
                <span>{loading ? 'Searching...' : 'Search'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner" />
          </div>
        )}

        {/* Weather Data */}
        {weatherData && !loading && (
          <div>
            {/* Location Info */}
            <div className="location-info">
              <div className="location-header">
                <div className="location-icon">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="location-name">{weatherData.location.name}</h2>
                  <p className="location-coords">
                    {weatherData.location.lat.toFixed(4)}, {weatherData.location.lon.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>

            {/* Weather Cards */}
            <div className="weather-grid">
              {weatherData.timelines.daily.map((day, index) => (
                <WeatherCard key={day.time} day={day} index={index} />
              ))}
            </div>

            {/* Additional Information */}
            <div className="additional-info">
              <h3 className="additional-info-title">
                <div className="title-indicator" />
                <span>Additional Information</span>
              </h3>
              <div className="info-grid">
                <div className="info-item">
                  <p className="info-label">Data Source</p>
                  <p className="info-value">Tomorrow.io API</p>
                </div>
                <div className="info-item">
                  <p className="info-label">Last Updated</p>
                  <p className="info-value">{new Date().toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherDashboard;