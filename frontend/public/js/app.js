/**
 * Application Main Module
 * 
 * Responsabilité : Orchestration de l'application
 * - Initialisation des modules
 * - Gestion du cycle de rafraîchissement
 * - Coordination entre le service et l'affichage
 */

import { CONFIG, validateConfig } from './config.js';
import { WeatherService } from './weatherService.js';
import { WeatherDisplay } from './weatherDisplay.js';
import { PWAManager } from './pwaManager.js';
import { ThemeManager } from './themeManager.js';

/**
 * Classe principale de l'application météo
 * Coordonne les interactions entre le service et l'affichage
 */
class WeatherApp {
    constructor() {
        // Instances des modules
        this.weatherService = new WeatherService();
        this.weatherDisplay = new WeatherDisplay();
        this.pwaManager = new PWAManager();
        this.themeManager = new ThemeManager();
        
        // ID du timer de rafraîchissement
        this.refreshTimerId = null;
        
        // État de l'application
        this.isRunning = false;
    }

    /**
     * Initialise et démarre l'application
     * Point d'entrée principal
     */
    async init() {
        try {
            console.log('🚀 Démarrage de l\'application météo...');
            
            // Valider la configuration
            validateConfig();
            
            // Afficher l'état initial
            this.weatherDisplay.showWaitingState();
            
            // Effectuer la première récupération de données
            await this.fetchAndUpdateWeather();
            
            // Démarrer le rafraîchissement automatique
            this.startAutoRefresh();
            
            console.log('✅ Application démarrée avec succès');
            console.log(`🔄 Rafraîchissement automatique toutes les ${CONFIG.API.REFRESH_INTERVAL / 1000}s`);
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation:', error);
            this.weatherDisplay.showError(error.message);
        }
    }

    /**
     * Récupère les données météo et met à jour l'affichage
     * Gère les erreurs de manière robuste
     */
    async fetchAndUpdateWeather() {
        try {
            console.log('📡 Récupération des données...');
            
            // Récupérer les données depuis l'API
            const data = await this.weatherService.fetchWeatherData();
            
            // Appliquer le thème selon la température
            if (data.temp !== null) {
                this.themeManager.applyThemeByTemperature(data.temp);
            }
            
            // Mettre à jour l'affichage
            this.weatherDisplay.updateWeatherData(data);
            
            // Récupérer les moyennes
            const avg7 = await this.weatherService.fetchAverageData(7);
            const avg30 = await this.weatherService.fetchAverageData(30);
            
            this.weatherDisplay.updateAverages(avg7, avg30);
            
            console.log('✅ Mise à jour réussie');
            
        } catch (error) {
            console.error('❌ Erreur lors de la récupération:', error.message);
            this.weatherDisplay.showError(error.message);
        }
    }

    /**
     * Démarre le rafraîchissement automatique des données
     * Utilise setInterval pour répéter l'opération
     */
    startAutoRefresh() {
        // Éviter de créer plusieurs timers
        if (this.refreshTimerId) {
            console.warn('⚠️ Timer déjà actif');
            return;
        }
        
        this.isRunning = true;
        
        // Créer le timer de rafraîchissement
        this.refreshTimerId = setInterval(
            () => this.fetchAndUpdateWeather(),
            CONFIG.API.REFRESH_INTERVAL
        );
        
        console.log('⏱️ Rafraîchissement automatique activé');
    }

    /**
     * Arrête le rafraîchissement automatique
     * Utile pour économiser les ressources si l'onglet devient inactif
     */
    stopAutoRefresh() {
        if (this.refreshTimerId) {
            clearInterval(this.refreshTimerId);
            this.refreshTimerId = null;
            this.isRunning = false;
            console.log('⏹️ Rafraîchissement automatique arrêté');
        }
    }

    /**
     * Redémarre le rafraîchissement automatique
     */
    restartAutoRefresh() {
        this.stopAutoRefresh();
        this.startAutoRefresh();
        console.log('🔄 Rafraîchissement automatique redémarré');
    }
}

/**
 * Gestion du cycle de vie de la page
 * Optimise les performances quand l'onglet devient inactif
 */
class PageLifecycleManager {
    constructor(app) {
        this.app = app;
        this.setupEventListeners();
    }

    /**
     * Configure les écouteurs d'événements du cycle de vie
     */
    setupEventListeners() {
        // Détecter quand l'onglet devient invisible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('👀 Onglet masqué - Pause du rafraîchissement');
                this.app.stopAutoRefresh();
            } else {
                console.log('👁️ Onglet visible - Reprise du rafraîchissement');
                this.app.fetchAndUpdateWeather(); // Mise à jour immédiate
                this.app.startAutoRefresh();
            }
        });

        // Nettoyer les ressources avant de quitter la page
        window.addEventListener('beforeunload', () => {
            console.log('👋 Fermeture de l\'application');
            this.app.stopAutoRefresh();
        });

        // Détecter la perte/reprise de connexion
        window.addEventListener('online', () => {
            console.log('🌐 Connexion rétablie');
            this.app.fetchAndUpdateWeather();
        });

        window.addEventListener('offline', () => {
            console.log('📡 Connexion perdue');
            this.app.weatherDisplay.showError('Pas de connexion Internet');
        });
    }
}

/**
 * Point d'entrée de l'application
 * S'exécute quand le DOM est complètement chargé
 */
document.addEventListener('DOMContentLoaded', () => {
    // Créer et initialiser l'application
    const app = new WeatherApp();
    app.init();
    
    // Configurer la gestion du cycle de vie
    new PageLifecycleManager(app);
    
    // Exposer l'application dans le contexte global pour debug
    // Permet d'accéder à l'app via la console : window.weatherApp
    window.weatherApp = app;
    
    console.log('💡 App accessible via: window.weatherApp');
});