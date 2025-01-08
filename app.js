// Fonction utilitaire pour créer des éléments HTML avec des attributs et du contenu
function createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);
    // Parcours des attributs pour les ajouter à l'élément
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'style' && typeof value === 'object') {
            Object.assign(element.style, value);
        } else {
            element.setAttribute(key, value);
        }
    });
    if (content) element.textContent = content;
    return element;
}

// Fonction pour récupérer les données météo d'une ville
async function testmeteo(ville) {
    try {
        // Configuration de l'API météo
        const API_KEY = '649f54ff2e8832fb0ec8a228f1a0f37d';
        const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${ville}&units=metric&lang=fr&appid=${API_KEY}`;

        // Appel à l'API météo
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération de la météo');
        }
        const data = await response.json();

        // Création de la carte météo
        const weatherCard = createElement('div', { class: 'card mt-3 mb-3' });
        const cardBody = createElement('div', { class: 'card-body' });

        // Titre de la section météo
        const weatherTitle = createElement('h5', { class: 'card-title mb-3' }, `Météo actuelle de la capitale`);

        // Création du contenu de la carte météo
        const weatherContent = createElement('div', { class: 'weather-content' });

        // Température et description
        const tempDiv = createElement('div', { class: 'mb-2' });
        const temp = createElement('span', { class: 'fs-2 fw-bold' }, `${Math.round(data.main.temp)}°C`);
        const description = createElement('span', { class: 'ms-3 text-capitalize' }, data.weather[0].description);
        tempDiv.append(temp, description);

        // Informations supplémentaires
        const detailsDiv = createElement('div', { class: 'weather-details' });
        const feelsLike = createElement('p', { class: 'mb-1' }, `Ressenti: ${Math.round(data.main.feels_like)}°C`);
        const humidity = createElement('p', { class: 'mb-1' }, `Humidité: ${data.main.humidity}%`);
        detailsDiv.append(feelsLike, humidity);

        // Assemblage de la carte météo
        weatherContent.append(tempDiv, detailsDiv);
        cardBody.append(weatherTitle, weatherContent);
        weatherCard.appendChild(cardBody);

        return weatherCard;
    } catch (error) {
        console.error('Erreur météo:', error);
        // En cas d'erreur, on retourne une carte d'erreur
        const errorCard = createElement('div', { class: 'card mt-3 mb-3 bg-light' });
        const errorBody = createElement('div', { class: 'card-body' });
        const errorMessage = createElement('p', { class: 'text-danger' }, 'Impossible de charger les données météo');
        errorBody.appendChild(errorMessage);
        errorCard.appendChild(errorBody);
        return errorCard;
    }
}

// Fonction pour afficher les détails d'un pays
async function afficherPaysDetail(country) {
    // Récupération du conteneur principal
    const detailContainer = document.getElementById('country-detail');
    detailContainer.innerHTML = '';

    // Création de la carte principale
    const card = createElement('div', { class: 'card mb-4 border-4 border-danger' });
    const row = createElement('div', { class: 'row g-0' });

    // Colonne de gauche avec le drapeau et le bouton
    const imgCol = createElement('div', { class: 'ms-2 col-md-3 text-center mt-2' });
    const img = createElement('img', {
        src: country.flags.png,
        alt: country.flags.alt || `Drapeau de ${country.translations.fra.common}`,
        class: 'img-fluid rounded-start'
    });
    const bouton = createElement('button', { class: 'btn btn-danger w-75 mt-5 mb-3'}, "FERMER" );
    imgCol.append(img, bouton);

    // Colonne de droite avec les informations
    const infoCol = createElement('div', { class: 'col-md-8' });
    const cardBody = createElement('div', { class: 'card-body' });
    const title = createElement('h5', { class: 'card-title mb-4' }, country.translations.fra.common);
    const list = createElement('ul', { class: 'list-group list-group-flush' });

    // Liste des informations du pays
    const details = [
        ['Capitale', country.capital?.join(', ')],
        ['Population', country.population.toLocaleString()],
        ['Région', country.region],
        ['Sous-région', country.subregion],
        ['Langues', Object.values(country.languages || {}).join(', ')],
        ['Monnaies', Object.values(country.currencies || {})
            .map(currency => `${currency.name} (${currency.symbol})`).join(', ')],
        ['Superficie', `${country.area.toLocaleString()} km²`],
        ['Code pays', country.cca2]
    ];

    // Création des éléments de la liste
    details.forEach(([label, value]) => {
        if (value) {  // On vérifie que la valeur existe
            const li = createElement('li', { class: 'list-group-item' });
            const strong = createElement('strong', {}, `${label}: `);
            li.append(strong, document.createTextNode(value));
            list.appendChild(li);
        }
    });

    // Ajout des informations de base
    cardBody.appendChild(title);
    cardBody.appendChild(list);

    // Ajout de la météo si une capitale est définie
    if (country.capital?.[0]) {
        const weatherCard = await testmeteo(country.capital[0]);
        cardBody.appendChild(weatherCard);
    }

    // Assemblage final de la carte
    infoCol.appendChild(cardBody);
    row.append(imgCol, infoCol);
    card.appendChild(row);
    detailContainer.appendChild(card);

    // Gestionnaire d'événement pour le bouton de fermeture
    bouton.addEventListener('click', () => detailContainer.innerHTML = '');
}

// Fonction pour afficher la liste des pays
function afficherPays(countries) {
    const container = document.getElementById('countries-list');
    container.innerHTML = '';

    // Création d'une carte pour chaque pays
    countries.forEach(country => {
        const col = createElement('div', { class: 'col' });
        const card = createElement('div', {
            class: 'card h-100',
            style: { cursor: 'pointer' }
        });

        // Ajout de l'événement de clic pour afficher les détails
        card.addEventListener('click', () => afficherPaysDetail(country));

        // Création de l'image du drapeau
        const img = createElement('img', {
            src: country.flags.png,
            alt: country.flags.alt || `Drapeau de ${country.translations.fra.common}`,
            class: 'card-img-top',
            style: { height: '160px', objectFit: 'cover' }
        });

        // Création du corps de la carte
        const cardBody = createElement('div', { class: 'card-body' });
        const title = createElement('h5', { class: 'card-title' }, country.translations.fra.common);
        const list = createElement('ul', { class: 'list-unstyled mb-0' });

        // Ajout des informations de base
        const capital = createElement('li', {}, '');
        capital.appendChild(createElement('strong', {}, 'Capitale: '));
        capital.appendChild(document.createTextNode(country.capital?.join(', ') || 'Non définie'));

        const population = createElement('li', {}, '');
        population.appendChild(createElement('strong', {}, 'Population: '));
        population.appendChild(document.createTextNode(country.population.toLocaleString()));

        // Assemblage de la carte
        list.append(capital, population);
        cardBody.append(title, list);
        card.append(img, cardBody);
        col.appendChild(card);
        container.appendChild(col);
    });
}

// Fonction principale pour récupérer les données des pays
async function test() {
    try {
        // Récupération des pays d'Europe
        const response = await fetch('https://restcountries.com/v3.1/region/europe');
        if (!response.ok) throw new Error('Erreur lors de la récupération des pays');

        const countries = await response.json();
        afficherPays(countries);
    } catch (error) {
        console.error('Erreur:', error);
        // Affichage de l'erreur à l'utilisateur
        const errorDiv = createElement('div', {
            class: 'alert alert-danger m-4',
            role: 'alert'
        }, error.message);
        document.getElementById('countries-list').appendChild(errorDiv);
    }
}

// Chargement des pays au démarrage de la page
document.addEventListener('DOMContentLoaded', test);
