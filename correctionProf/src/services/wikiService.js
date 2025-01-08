export const getWikiSummary = async (countryName) => {
    try {
        const response = await fetch(
            `https://fr.wikipedia.org/api/rest_v1/page/summary/${countryName}`
        );
        
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération du résumé Wikipedia');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erreur Wikipedia:', error);
        throw error;
    }
}; 