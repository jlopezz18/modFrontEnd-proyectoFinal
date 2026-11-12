import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// clima actual para las cards del inicio
export const getCurrentWeather = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric', 
        lang: 'es'
      }
    });
    return response.data;
  } catch (error) {
    console.error('error al pedir el clima:', error);
    throw error;
  }
};

// pronostico de 5 dias y por horas
export const getForecast = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
        lang: 'es'
      }
    });
    return response.data;
  } catch (error) {
    console.error('error al pedir el pronostico:', error);
    throw error;
  }
};