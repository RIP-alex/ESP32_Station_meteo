/**
 * Configuration Module
 * 
 * Centralise toutes les constantes et paramètres de configuration
 * de l'application météo. Facilite la maintenance et les modifications.
 */

export const CONFIG = {
    /**
     * Configuration de l'API Backend
     */
    API: {
        // URL de base de l'API
        BASE_URL: 'http://VOTRE_IP_SERVEUR:8000',
        
        // URL de l'endpoint pour récupérer les données en temps réel
        URL: 'http://VOTRE_IP_SERVEUR:8000/data/live',
        
        // Intervalle de rafraîchissement des données (en millisecondes)
        REFRESH_INTERVAL: 5000,
        
        // Timeout pour les requêtes HTTP (en millisecondes)
        TIMEOUT: 10000,
        
        // Nombre de tentatives en cas d'échec
        MAX_RETRIES: 3,
        
        // Délai entre les tentatives (en millisecondes)
        RETRY_DELAY: 2000
    },

    /**
     * Seuils de température pour les couleurs dynamiques
     * Utilisés pour appliquer les classes CSS correspondantes
     */
    TEMPERATURE_THRESHOLDS: {
        COLD: 18,      // Température < 18°C = Froid (bleu cyan)
        COMFORT: 25,   // 18°C ≤ Température < 25°C = Confort (vert)
        WARM: 30       // 25°C ≤ Température < 30°C = Chaud (orange)
                       // Température ≥ 30°C = Très chaud (rouge)
    },

    /**
     * Seuils d'humidité pour les alertes
     */
    HUMIDITY_THRESHOLDS: {
        LOW: 30,       // Humidité < 30% = Trop sec
        OPTIMAL_MIN: 40,  // Humidité optimale min
        OPTIMAL_MAX: 60,  // Humidité optimale max
        HIGH: 70       // Humidité > 70% = Trop humide
    },

    /**
     * Messages de statut affichés à l'utilisateur
     */
    STATUS_MESSAGES: {
        CONNECTING: 'Connexion en cours...',
        CONNECTED: 'Connecté',
        ERROR: 'Erreur de connexion',
        NO_DATA: 'En attente de données...',
        OFFLINE: 'Mode hors ligne',
        RECONNECTING: 'Reconnexion...'
    },

    /**
     * Valeur par défaut affichée quand les données sont indisponibles
     */
    DEFAULT_VALUE: '--',

    /**
     * Format de date/heure pour l'affichage de la dernière mise à jour
     */
    DATE_FORMAT: {
        locale: 'fr-FR',
        options: {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }
    },

    /**
     * Configuration PWA
     */
    PWA: {
        // Nom de l'application
        APP_NAME: 'Station Météo ESP32',
        
        // Version de l'application
        VERSION: '1.2.0',
        
        // Activer les notifications (si supporté)
        ENABLE_NOTIFICATIONS: false,
        
        // Durée de cache des données API (en millisecondes)
        CACHE_DURATION: 300000 // 5 minutes
    },

    /**
     * Configuration des animations
     */
    ANIMATIONS: {
        // Activer les animations (peut être désactivé pour les performances)
        ENABLED: true,
        
        // Durée des animations de mise à jour (en millisecondes)
        UPDATE_DURATION: 800,
        
        // Délai entre les animations d'éléments multiples
        STAGGER_DELAY: 100
    },

    /**
     * Configuration du débogage
     */
    DEBUG: {
        // Activer les logs détaillés
        VERBOSE_LOGGING: true,
        
        // Afficher les données brutes dans la console
        LOG_RAW_DATA: false,
        
        // Simuler des erreurs pour les tests (développement uniquement)
        SIMULATE_ERRORS: false
    }
};

/**
 * Fonction utilitaire pour valider la configuration au démarrage
 * Permet de détecter rapidement des erreurs de configuration
 */
export function validateConfig() {
    // Validation API
    if (!CONFIG.API.URL) {
        throw new Error('CONFIG.API.URL doit être définie');
    }
    
    if (CONFIG.API.REFRESH_INTERVAL < 1000) {
        console.warn('⚠️ REFRESH_INTERVAL très court (< 1s), risque de surcharge');
    }
    
    if (CONFIG.API.TIMEOUT < CONFIG.API.REFRESH_INTERVAL) {
        console.warn('⚠️ TIMEOUT inférieur à REFRESH_INTERVAL');
    }
    
    // Validation seuils
    const tempThresholds = CONFIG.TEMPERATURE_THRESHOLDS;
    if (tempThresholds.COLD >= tempThresholds.COMFORT || 
        tempThresholds.COMFORT >= tempThresholds.WARM) {
        console.warn('⚠️ Seuils de température incohérents');
    }
    
    const humThresholds = CONFIG.HUMIDITY_THRESHOLDS;
    if (humThresholds.LOW >= humThresholds.OPTIMAL_MIN || 
        humThresholds.OPTIMAL_MIN >= humThresholds.OPTIMAL_MAX ||
        humThresholds.OPTIMAL_MAX >= humThresholds.HIGH) {
        console.warn('⚠️ Seuils d\'humidité incohérents');
    }
    
    console.log('✅ Configuration validée');
}

/**
 * Utilitaire pour obtenir des informations sur l'environnement
 */
export function getEnvironmentInfo() {
    return {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        screen: {
            width: screen.width,
            height: screen.height,
            colorDepth: screen.colorDepth
        },
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight
        },
        timestamp: new Date().toISOString()
    };
}