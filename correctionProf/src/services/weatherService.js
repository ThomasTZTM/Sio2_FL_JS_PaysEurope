import { OPENWEATHER_API_KEY } from '../config/api-keys.js';

export const getWeatherForCity = async (cityName) => {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=fr&appid=${OPENWEATHER_API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération de la météo');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erreur météo:', error);
        throw error;
    }
}; 