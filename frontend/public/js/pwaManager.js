/**
 * PWA Manager Module
 * Responsabilité : Gestion PWA (Service Worker + Installation)
 */

export class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }

    async init() {
        await this.registerServiceWorker();
        this.setupInstallPrompt();
    }

    async registerServiceWorker() {
        if (!('serviceWorker' in navigator)) return;
        
        try {
            await navigator.serviceWorker.register('/js/sw.js');
            console.log('✅ Service Worker enregistré');
        } catch (error) {
            console.error('❌ Erreur SW:', error);
        }
    }

    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });
    }

    showInstallButton() {
        const btn = document.createElement('button');
        btn.id = 'pwa-install-btn';
        btn.textContent = '📱 Installer';
        btn.onclick = () => this.install();
        btn.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            background: var(--color-accent); color: white;
            border: none; border-radius: 25px; padding: 12px 20px;
            cursor: pointer; z-index: 1000;
        `;
        document.body.appendChild(btn);
    }

    async install() {
        if (!this.deferredPrompt) return;
        
        this.deferredPrompt.prompt();
        await this.deferredPrompt.userChoice;
        this.deferredPrompt = null;
        
        const btn = document.getElementById('pwa-install-btn');
        if (btn) btn.remove();
    }

    getStatus() {
        return {
            canInstall: !!this.deferredPrompt,
            isOnline: navigator.onLine
        };
    }
}
