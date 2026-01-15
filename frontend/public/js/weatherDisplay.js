/**
 * Weather Display Module
 * 
 * Responsabilité : Gérer l'affichage et la mise à jour de l'interface utilisateur
 * - Mise à jour des valeurs de température et humidité
 * - Application des couleurs dynamiques selon la température
 * - Gestion des indicateurs de statut
 * - Formatage des dates
 */

import { CONFIG } from './config.js';

/**
 * Classe de gestion de l'affichage météo
 * Encapsule toute la logique de manipulation du DOM
 */
export class WeatherDisplay {
    constructor() {
        try {
            // Références aux éléments DOM
            this.elements = {
                tempValue: document.getElementById('tempValue'),
                humValue: document.getElementById('humValue'),
                lastUpdate: document.getElementById('lastUpdate'),
                statusIndicator: document.getElementById('statusIndicator'),
                statusText: document.querySelector('.status-text'),
                temperatureSection: document.querySelector('.temperature-section')
            };

            // Vérifier que tous les éléments existent
            this.validateElements();
        } catch (error) {
            console.error('❌ Erreur initialisation WeatherDisplay:', error);
            throw error;
        }
    }

    /**
     * Valide que tous les éléments DOM requis sont présents
     * Permet de détecter rapidement des erreurs de structure HTML
     */
    validateElements() {
        try {
            for (const [key, element] of Object.entries(this.elements)) {
                if (!element) {
                    console.error(`❌ Élément DOM manquant: ${key}`);
                    throw new Error(`Élément DOM requis introuvable: ${key}`);
                }
            }
            console.log('✅ Tous les éléments DOM sont présents');
        } catch (error) {
            console.error('❌ Erreur validation DOM:', error);
            throw error;
        }
    }

    /**
     * Met à jour l'affichage avec les nouvelles données météo
     * 
     * @param {Object} data - Objet contenant temp et hum
     * @param {number|null} data.temp - Température en °C
     * @param {number|null} data.hum - Humidité en %
     */
    updateWeatherData(data) {
        // Mise à jour de la température
        this.updateTemperature(data.temp);
        
        // Mise à jour de l'humidité
        this.updateHumidity(data.hum);
        
        // Mise à jour de l'horodatage
        this.updateLastUpdateTime();
        
        // Mise à jour du statut (connecté)
        this.setStatus('connected');
    }

    /**
     * Met à jour l'affichage de la température
     * Applique les couleurs dynamiques selon la valeur
     * 
     * @param {number|null} temp - Température en °C
     */
    updateTemperature(temp) {
        const numberElement = this.elements.tempValue.querySelector('.value-number');
        
        if (temp === null || temp === undefined) {
            numberElement.textContent = CONFIG.DEFAULT_VALUE;
            this.removeTemperatureColorClasses();
        } else {
            numberElement.textContent = temp.toFixed(1);
            this.applyTemperatureColor(temp);
        }
    }

    /**
     * Met à jour l'affichage de l'humidité
     * 
     * @param {number|null} hum - Humidité en %
     */
    updateHumidity(hum) {
        const numberElement = this.elements.humValue.querySelector('.value-number');
        
        if (hum === null || hum === undefined) {
            numberElement.textContent = CONFIG.DEFAULT_VALUE;
        } else {
            numberElement.textContent = Math.round(hum);
        }
    }

    /**
     * Applique la couleur dynamique selon la température
     * Utilise les seuils définis dans CONFIG
     * 
     * @param {number} temp - Température en °C
     */
    applyTemperatureColor(temp) {
        const section = this.elements.temperatureSection;
        
        // Supprimer toutes les classes de couleur existantes
        this.removeTemperatureColorClasses();
        
        // Appliquer la classe correspondante selon la température
        if (temp < CONFIG.TEMPERATURE_THRESHOLDS.COLD) {
            section.classList.add('temp-cold');
        } else if (temp < CONFIG.TEMPERATURE_THRESHOLDS.COMFORT) {
            section.classList.add('temp-comfort');
        } else if (temp < CONFIG.TEMPERATURE_THRESHOLDS.WARM) {
            section.classList.add('temp-warm');
        } else {
            section.classList.add('temp-hot');
        }
    }

    /**
     * Supprime toutes les classes CSS de couleur de température
     */
    removeTemperatureColorClasses() {
        const section = this.elements.temperatureSection;
        section.classList.remove('temp-cold', 'temp-comfort', 'temp-warm', 'temp-hot');
    }

    /**
     * Met à jour l'horodatage de la dernière mise à jour
     * Utilise le format défini dans CONFIG
     */
    updateLastUpdateTime() {
        const now = new Date();
        const formattedDate = now.toLocaleString(
            CONFIG.DATE_FORMAT.locale,
            CONFIG.DATE_FORMAT.options
        );
        
        this.elements.lastUpdate.textContent = `Dernière mise à jour : ${formattedDate}`;
    }

    /**
     * Met à jour l'indicateur de statut de connexion
     * 
     * @param {string} status - Type de statut ('connecting', 'connected', 'error')
     */
    setStatus(status) {
        const indicator = this.elements.statusIndicator;
        const statusText = this.elements.statusText;
        
        // Supprimer toutes les classes de statut existantes
        indicator.classList.remove('connected', 'error');
        
        // Appliquer la nouvelle classe et le texte correspondant
        switch (status) {
            case 'connected':
                indicator.classList.add('connected');
                statusText.textContent = CONFIG.STATUS_MESSAGES.CONNECTED;
                break;
                
            case 'error':
                indicator.classList.add('error');
                statusText.textContent = CONFIG.STATUS_MESSAGES.ERROR;
                break;
                
            case 'connecting':
            default:
                statusText.textContent = CONFIG.STATUS_MESSAGES.CONNECTING;
                break;
        }
    }

    /**
     * Affiche un message d'erreur à l'utilisateur
     * 
     * @param {string} errorMessage - Message d'erreur à afficher
     */
    showError(errorMessage) {
        console.error('❌', errorMessage);
        
        // Mettre à jour le statut
        this.setStatus('error');
        
        // Afficher l'erreur dans le footer
        this.elements.lastUpdate.textContent = `Erreur : ${errorMessage}`;
        
        // Réinitialiser les valeurs
        this.updateTemperature(null);
        this.updateHumidity(null);
    }

    /**
     * Affiche l'état initial "en attente"
     */
    showWaitingState() {
        this.setStatus('connecting');
        this.elements.lastUpdate.textContent = CONFIG.STATUS_MESSAGES.NO_DATA;
    }

    /**
     * Met à jour l'affichage des moyennes de température
     * 
     * @param {number|null} avg7 - Moyenne sur 7 jours
     * @param {number|null} avg30 - Moyenne sur 30 jours
     */
    updateAverages(avg7, avg30) {
        const avg7Element = document.getElementById('avg7days');
        const avg30Element = document.getElementById('avg30days');
        
        if (avg7Element) {
            const numberElement = avg7Element.querySelector('.value-number');
            numberElement.textContent = avg7 !== null ? avg7.toFixed(1) : CONFIG.DEFAULT_VALUE;
        }
        
        if (avg30Element) {
            const numberElement = avg30Element.querySelector('.value-number');
            numberElement.textContent = avg30 !== null ? avg30.toFixed(1) : CONFIG.DEFAULT_VALUE;
        }
    }
}