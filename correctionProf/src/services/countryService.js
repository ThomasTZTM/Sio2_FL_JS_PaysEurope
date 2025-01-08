export const getEuropeanCountries = async () => {
    try {
        const response = await fetch('https://restcountries.com/v3.1/region/europe?fields=name,capital,population,flags,translations');
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des pays');
        }
        const countries = await response.json();
        console.log(countries);
        return countries.sort((a, b) => {
            const nameA = a.translations?.fra?.common || a.name.common;
            const nameB = b.translations?.fra?.common || b.name.common;
            return nameA.localeCompare(nameB);
        });
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
};

export const getCountryDetails = async (countryName) => {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des détails du pays');
        }
        const data = await response.json();
        console.log(data);
        //const [country] = data;
        return data[0]
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
}; 