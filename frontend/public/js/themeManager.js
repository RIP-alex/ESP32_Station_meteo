/**
 * Theme Manager Module
 * Responsabilité : Gestion des palettes de couleurs dynamiques selon la température
 */

export class ThemeManager {
    constructor() {
        this.currentTheme = null;
    }

    /**
     * Applique une palette de couleurs selon la température
     * @param {number} temp - Température en °C
     */
    applyThemeByTemperature(temp) {
        let theme;

        if (temp < 18) {
            theme = 'cold'; // Bleu
        } else if (temp < 25) {
            theme = 'comfort'; // Vert
        } else if (temp < 30) {
            theme = 'warm'; // Orange
        } else {
            theme = 'hot'; // Rouge
        }

        if (this.currentTheme !== theme) {
            this.currentTheme = theme;
            this.setTheme(theme);
        }
    }

    /**
     * Définit les variables CSS selon le thème
     * @param {string} theme - Nom du thème (cold, comfort, warm, hot)
     */
    setTheme(theme) {
        const root = document.documentElement;
        const themes = {
            cold: {
                '--bg-primary': '#dbeafe',
                '--bg-secondary': '#bfdbfe',
                '--bg-card': '#ffffff',
                '--text-primary': '#1e3a8a',
                '--text-secondary': '#1e40af',
                '--text-muted': '#3b82f6',
                '--color-accent': '#2563eb',
                '--chart-color': '#3b82f6',
                '--chart-bg': 'rgba(59, 130, 246, 0.1)'
            },
            comfort: {
                '--bg-primary': '#d1fae5',
                '--bg-secondary': '#a7f3d0',
                '--bg-card': '#ffffff',
                '--text-primary': '#064e3b',
                '--text-secondary': '#065f46',
                '--text-muted': '#059669',
                '--color-accent': '#10b981',
                '--chart-color': '#10b981',
                '--chart-bg': 'rgba(16, 185, 129, 0.1)'
            },
            warm: {
                '--bg-primary': '#fed7aa',
                '--bg-secondary': '#fdba74',
                '--bg-card': '#ffffff',
                '--text-primary': '#7c2d12',
                '--text-secondary': '#9a3412',
                '--text-muted': '#c2410c',
                '--color-accent': '#f97316',
                '--chart-color': '#f97316',
                '--chart-bg': 'rgba(249, 115, 22, 0.1)'
            },
            hot: {
                '--bg-primary': '#fecaca',
                '--bg-secondary': '#fca5a5',
                '--bg-card': '#ffffff',
                '--text-primary': '#7f1d1d',
                '--text-secondary': '#991b1b',
                '--text-muted': '#dc2626',
                '--color-accent': '#ef4444',
                '--chart-color': '#ef4444',
                '--chart-bg': 'rgba(239, 68, 68, 0.1)'
            }
        };

        const colors = themes[theme];
        for (const [property, value] of Object.entries(colors)) {
            root.style.setProperty(property, value);
        }

        console.log(`🎨 Thème appliqué : ${theme}`);
    }

    /**
     * Réinitialise au thème par défaut
     */
    resetTheme() {
        this.setTheme('comfort');
    }
}
