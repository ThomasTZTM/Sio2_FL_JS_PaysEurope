import { getEuropeanCountries, getCountryDetails } from '../services/countryService.js';
import { getWeatherForCity } from '../services/weatherService.js';
import { getWikiSummary } from '../services/wikiService.js';

const container = document.getElementById('countries-container');
let selectedCountryId = null;

const formatPopulation = (population) => {
    return new Intl.NumberFormat('fr-FR').format(population);
};

const displayError = (message) => {
    container.innerHTML = `
        <div class="col-12">
            <div class="alert alert-danger" role="alert">
                ${message}
            </div>
        </div>
    `;
};

const highlightSelectedCountry = (selectedCard) => {
    // Réinitialiser tous les pays
    document.querySelectorAll('.country-card').forEach(card => {
        card.classList.remove('border-primary', 'border-3');
    });
    
    // Mettre en évidence le pays sélectionné
    if (selectedCard) {
        selectedCard.classList.add('border-primary', 'border-3');
    }
};

const getWeatherIcon = (weatherCode) => {
    // Mapping des codes météo avec les icônes Bootstrap
    const weatherIcons = {
        // Orages
        '2': 'bi bi-cloud-lightning-rain',
        // Pluie
        '3': 'bi bi-cloud-drizzle',
        '5': 'bi bi-cloud-rain',
        // Neige
        '6': 'bi bi-snow',
        // Brouillard
        '7': 'bi bi-cloud-fog',
        // Dégagé
        '800': 'bi bi-sun',
        // Nuageux
        '801': 'bi bi-cloud-sun',
        '802': 'bi bi-cloud',
        '803': 'bi bi-clouds',
        '804': 'bi bi-clouds-fill',
    };

    // Extraire le premier chiffre du code météo pour les cas généraux
    const generalCode = weatherCode.toString()[0];
    return weatherIcons[weatherCode] || weatherIcons[generalCode] || 'bi bi-cloud-slash';
};

const displayCountryDetails = async (country, cardElement) => {
    try {
        const details = await getCountryDetails(country.name.common);
        let weatherHtml = '';
        let wikiHtml = '';
        
        // Récupérer la description Wikipedia
        try {
            const wikiData = await getWikiSummary(details.translations?.fra?.common || country.name.common);
            if (wikiData.extract) {
                wikiHtml = `
                    <div class="mt-3">
                        <h4>À propos</h4>
                        <p>${wikiData.extract}</p>
                    </div>`;
            }
        } catch (wikiError) {
            console.error('Erreur Wikipedia:', wikiError);
        }

        // Récupérer la météo si une capitale existe
        if (details.capital?.[0]) {
            try {
                const weather = await getWeatherForCity(details.capital[0]);
                weatherHtml = `
                    <div class="mt-3 p-3 bg-light rounded">
                        <h4 class="mb-3">Météo à ${details.capital[0]}</h4>
                        <div class="d-flex align-items-center">
                            <div class="me-3 text-center">
                                <i class="${getWeatherIcon(weather.weather[0].id)}" style="font-size: 2.5rem;"></i>
                                <img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" 
                                     alt="${weather.weather[0].description}"
                                     style="width: 60px; height: 60px; display: none;">
                            </div>
                            <div class="ms-3">
                                <p class="mb-1">
                                    <i class="bi bi-thermometer-half me-2"></i>
                                    <strong>Température:</strong> ${Math.round(weather.main.temp)}°C
                                </p>
                                <p class="mb-1">
                                    <i class="bi bi-person-lines-fill me-2"></i>
                                    <strong>Ressenti:</strong> ${Math.round(weather.main.feels_like)}°C
                                </p>
                                <p class="mb-1">
                                    <i class="bi bi-droplet me-2"></i>
                                    <strong>Humidité:</strong> ${weather.main.humidity}%
                                </p>
                                <p class="mb-0">
                                    <i class="bi bi-cloud me-2"></i>
                                    <strong>Conditions:</strong> ${weather.weather[0].description}
                                </p>
                            </div>
                        </div>
                    </div>`;
            } catch (weatherError) {
                console.error('Erreur météo:', weatherError);
                weatherHtml = `
                    <div class="alert alert-warning mt-3">
                        Impossible de charger les données météo pour ${details.capital[0]}
                    </div>`;
            }
        }

        const detailsHtml = `
            <div class="card mb-4">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <img src="${details.flags.png}" class="img-fluid" alt="Drapeau">
                        </div>
                        <div class="col-md-8">
                            <h3 class="mb-3">${details.translations?.fra?.common || details.name.common}</h3>
                            ${wikiHtml}
                            <div class="row mt-3">
                                <div class="col-md-6">
                                    <p><strong>Capitale:</strong> ${details.capital?.[0] || 'N/A'}</p>
                                    <p><strong>Population:</strong> ${formatPopulation(details.population)}</p>
                                    <p><strong>Région:</strong> ${details.region}</p>
                                    <p><strong>Sous-région:</strong> ${details.subregion || 'N/A'}</p>
                                </div>
                                <div class="col-md-6">
                                    <p><strong>Langues:</strong> ${Object.values(details.languages || {}).join(', ') || 'N/A'}</p>
                                    <p><strong>Monnaies:</strong> ${Object.values(details.currencies || {}).map(c => c.name).join(', ') || 'N/A'}</p>
                                    <p><strong>Superficie:</strong> ${formatPopulation(details.area)} km²</p>
                                    <p><strong>Code pays:</strong> ${details.cca2}</p>
                                </div>
                            </div>
                            ${weatherHtml}
                        </div>
                    </div>
                </div>
            </div>`;

        // On récupère ou crée le conteneur pour les détails
        let detailsContainer = document.getElementById('country-details-container');
        if (!detailsContainer) {
            detailsContainer = document.createElement('div');
            detailsContainer.id = 'country-details-container';
            container.parentNode.insertBefore(detailsContainer, container);
        }
        detailsContainer.innerHTML = detailsHtml;

        // Mettre en évidence le pays sélectionné
        highlightSelectedCountry(cardElement);

        // Scroll vers les détails
        detailsContainer.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        displayError('Erreur lors de la récupération des détails du pays');
    }
};

const displayCountries = (countries) => {
    container.innerHTML = countries.map(country => {
        const countryName = country.translations?.fra?.common || country.name.common;
        return `
            <div class="col-md-4 col-lg-3">
                <div class="card h-100 shadow-sm country-card" role="button">
                    <img src="${country.flags.png}" 
                         class="card-img-top" 
                         alt="Drapeau ${countryName}"
                         style="height: 160px; object-fit: cover;"
                        >
                    <div class="card-body">
                        <h5 class="card-title fw-bold">${countryName}</h5>
                        <p class="card-text">
                            <span class="d-block mb-2">
                                <i class="bi bi-building"></i>
                                <strong>Capitale:</strong> ${country.capital?.[0] || 'N/A'}
                            </span>
                            <span class="d-block">
                                <i class="bi bi-people"></i>
                                <strong>Population:</strong> ${formatPopulation(country.population)}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Ajout des écouteurs d'événements pour les clics
    document.querySelectorAll('.card').forEach((card, index) => {
        card.addEventListener('click', async () => {
            await displayCountryDetails(countries[index], card);
        });
    });
};

const initialize = async () => {
    try {
        const countries = await getEuropeanCountries();
        displayCountries(countries);
    } catch (error) {
        displayError('Une erreur est survenue lors du chargement des pays');
    }
};

//document.addEventListener('DOMContentLoaded', initialize); 
initialize