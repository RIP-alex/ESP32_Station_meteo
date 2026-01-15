/**
 * Weather Service Module
 * 
 * Responsabilité : Gérer la communication avec l'API Backend
 * - Récupération des données via fetch()
 * - Gestion des erreurs réseau
 * - Gestion des timeouts
 * - Validation des données reçues
 */

import { CONFIG } from './config.js';

/**
 * Classe de gestion du service météo
 * Encapsule toute la logique de communication avec l'API
 */
export class WeatherService {
    constructor() {
        this.abortController = null;
    }

    /**
     * Récupère les données météo depuis l'API
     * 
     * @returns {Promise<Object>} Objet contenant temp et hum (ou null si erreur)
     * @throws {Error} En cas d'erreur réseau ou timeout
     */
    async fetchWeatherData() {
        if (CONFIG.DEBUG.DEMO_MODE) {
            return this.generateDemoData();
        }

        if (this.abortController) {
            this.abortController.abort();
        }

        this.abortController = new AbortController();
        const timeoutId = setTimeout(() => {
            this.abortController.abort();
        }, CONFIG.API.TIMEOUT);

        try {
            const response = await fetch(CONFIG.API.URL, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                signal: this.abortController.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return this.validateAndNormalizeData(data);

        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new Error('Timeout: La requête a pris trop de temps');
            }
            
            if (error instanceof TypeError) {
                throw new Error('Erreur réseau: Impossible de contacter le serveur');
            }

            throw new Error(`Erreur API: ${error.message}`);
        }
    }

    /**
     * Récupère la moyenne de température sur N jours
     * 
     * @param {number} days - Nombre de jours (7 ou 30)
     * @returns {Promise<number|null>} Moyenne de température ou null
     */
    async fetchAverageData(days) {
        if (CONFIG.DEBUG.DEMO_MODE) {
            return 22 + Math.random() * 3;
        }

        try {
            const response = await fetch(`${CONFIG.API.BASE_URL}/data/average/${days}`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();
            return data.temp_avg;

        } catch (error) {
            console.error(`Erreur récupération moyenne ${days}j:`, error);
            return null;
        }
    }

    /**
     * Génère des données simulées pour le mode démo
     * 
     * @returns {Object} Données simulées {temp, hum}
     */
    generateDemoData() {
        const temp = 20 + Math.random() * 10; // 20-30°C
        const hum = 40 + Math.random() * 30;  // 40-70%
        
        console.log('🎭 Mode démo - Données simulées:', { temp, hum });
        
        return { temp, hum };
    }

    /**
     * Valide et normalise les données reçues de l'API
     * Convertit les valeurs null/undefined en null JavaScript
     * 
     * @param {Object} rawData - Données brutes de l'API
     * @returns {Object} Données validées {temp, hum}
     */
    validateAndNormalizeData(rawData) {
        // Vérifier que l'objet reçu est valide
        if (!rawData || typeof rawData !== 'object') {
            console.warn('⚠️ Données invalides reçues:', rawData);
            return { temp: null, hum: null };
        }

        // Normaliser les valeurs (null/undefined/NaN deviennent null)
        const temp = this.normalizeValue(rawData.temp);
        const hum = this.normalizeValue(rawData.hum);

        // Logger les données pour debug
        console.log('📊 Données reçues:', { temp, hum });

        return { temp, hum };
    }

    /**
     * Normalise une valeur numérique
     * null, undefined, NaN, ou valeurs non-numériques deviennent null
     * 
     * @param {*} value - Valeur à normaliser
     * @returns {number|null} Valeur normalisée
     */
    normalizeValue(value) {
        // Cas où la valeur est déjà null/undefined
        if (value == null) {
            return null;
        }

        // Convertir en nombre
        const numValue = Number(value);

        // Vérifier si c'est un nombre valide
        if (isNaN(numValue)) {
            console.warn('⚠️ Valeur non-numérique détectée:', value);
            return null;
        }

        return numValue;
    }

    /**
     * Teste la connexion à l'API
     * Utile au démarrage de l'application
     * 
     * @returns {Promise<boolean>} true si la connexion fonctionne
     */
    async testConnection() {
        try {
            await this.fetchWeatherData();
            console.log('✅ Connexion à l\'API réussie');
            return true;
        } catch (error) {
            console.error('❌ Test de connexion échoué:', error.message);
            return false;
        }
    }
}