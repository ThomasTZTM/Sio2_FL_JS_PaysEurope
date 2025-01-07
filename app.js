// Fonction pour créer un élément avec des attributs et du contenu
function createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);
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

// Fonction pour afficher le détail d'un pays
function afficherPaysDetail(country) {
    const detailContainer = document.getElementById('country-detail');
    detailContainer.innerHTML = '';

    const card = createElement('div', { class: 'card mb-4 border-4 border-danger' });
    const row = createElement('div', { class: 'row g-0' });

    // Colonne de gauche avec l'image
    const imgCol = createElement('div', { class: 'ms-2 col-md-3 text-center mt-2' });
    const img = createElement('img', {
        src: country.flags.png,
        alt: country.flags.alt,
        class: 'img-fluid rounded-start'
    });

    // Colonne de droite bouton fermer
    const bouton = createElement('button', { class: 'btn btn-danger w-75 mt-5'}, "FERMER" );

    // Ajouter les enfants
    imgCol.appendChild(img);
    imgCol.appendChild(bouton)

    // Colonne de droite avec les informations
    const infoCol = createElement('div', { class: 'col-md-8' });
    const cardBody = createElement('div', { class: 'card-body' });
    const title = createElement('h5', { class: 'card-title' }, country.translations.fra.common);
    const list = createElement('ul', { class: 'list-group list-group-flush' });

    // Création des éléments de la liste
    const details = [
        ['Capitale', country.capital?.join(', ')],
        ['Population', country.population.toLocaleString()],
        ['Région', country.region],
        ['Sous-région', country.subregion],
        ['Langues', Object.values(country.languages).join(', ')],
        ['Monnaies', Object.values(country.currencies)
            .map(currency => `${currency.name} (${currency.symbol})`).join(', ')],
        ['Superficie', `${country.area.toLocaleString()} km²`],
        ['Code pays', country.cca2]
    ];

    details.forEach(([label, value]) => {
        const li = createElement('li', { class: 'list-group-item' });
        const strong = createElement('strong', {}, `${label}: `);
        li.appendChild(strong);
        li.appendChild(document.createTextNode(value));
        list.appendChild(li);
    });

    // Assemblage de la structure
    cardBody.appendChild(title);
    cardBody.appendChild(list);
    infoCol.appendChild(cardBody);
    row.append(imgCol, infoCol);
    card.appendChild(row);
    detailContainer.appendChild(card);

    // Ecouter
    bouton.addEventListener('click', () => detailContainer.innerHTML = '');
}

// Fonction pour afficher la liste des pays
function afficherPays(countries) {
    const container = document.getElementById('countries-list');
    container.innerHTML = '';

    countries.forEach(country => {
        const col = createElement('div', { class: 'col' });
        const card = createElement('div', {
            class: 'card h-100',
            style: { cursor: 'pointer' }
        });

        // Ajout de l'événement de clic
        card.addEventListener('click', () => afficherPaysDetail(country));

        // Création de l'image
        const img = createElement('img', {
            src: country.flags.png,
            alt: country.flags.alt,
            class: 'card-img-top',
            style: { height: '160px', objectFit: 'cover' }
        });

        // Création du corps de la carte
        const cardBody = createElement('div', { class: 'card-body' });
        const title = createElement('h5', { class: 'card-title' }, country.translations.fra.common);
        const list = createElement('ul', { class: 'list-unstyled' });

        // Ajout des informations de base
        const capital = createElement('li', {}, '');
        capital.appendChild(createElement('strong', {}, 'Capitale: '));
        capital.appendChild(document.createTextNode(country.capital?.join(', ')));

        const population = createElement('li', {}, '');
        population.appendChild(createElement('strong', {}, 'Population: '));
        population.appendChild(document.createTextNode(country.population.toLocaleString()));

        list.append(capital, population);
        cardBody.append(title, list);
        card.append(img, cardBody);
        col.appendChild(card);
        container.appendChild(col);
    });
}

// Fonction asynchrone pour récupérer les pays depuis l'API
async function test() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/region/europe');
        if (!response.ok) throw new Error('Erreur lors de la récupération des pays');
        const countries = await response.json();
        afficherPays(countries);
    } catch (error) {
        console.error('Erreur:', error);
        const errorDiv = createElement('div', {
            class: 'alert alert-danger m-4',
            role: 'alert'
        }, error.message);
        document.getElementById('countries-list').appendChild(errorDiv);
    }
}

// Chargement des pays au démarrage
document.addEventListener('DOMContentLoaded', test);