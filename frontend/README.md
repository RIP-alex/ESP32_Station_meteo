# 🎨 Interface Web

Interface web moderne avec palette de couleurs dynamique selon la température.

## ✨ Fonctionnalités

### Palette Dynamique
L'interface change automatiquement de couleur selon la température :
- **< 18°C** : Palette bleue (froid) ❄️
- **18-25°C** : Palette verte (confort) 🌿
- **25-30°C** : Palette orange (chaud) 🔥
- **> 30°C** : Palette rouge (canicule) 🌡️

### Graphiques Interactifs
- Moyennes sur 7 jours
- Moyennes sur 30 jours
- Chart.js responsive

### Design
- Responsive mobile/desktop
- Accessible WCAG AA
- Ombres douces et élégantes
- Animations fluides

## 📁 Structure

```
frontend/
├── public/
│   ├── styles/              # CSS modulaire
│   │   ├── variables.css    # Variables CSS
│   │   ├── base.css         # Reset et base
│   │   ├── card.css         # Carte principale
│   │   ├── weather-section.css  # Sections météo
│   │   ├── charts.css       # Graphiques
│   │   ├── status.css       # Indicateur statut
│   │   ├── animations.css   # Animations
│   │   └── responsive.css   # Media queries
│   ├── main.css             # Point d'entrée CSS
│   ├── index.html           # Page principale
│   ├── chart.html           # Page graphiques
│   ├── app.js               # Orchestration
│   ├── config.js            # Configuration
│   ├── weatherService.js    # Service API
│   ├── weatherDisplay.js    # Affichage
│   ├── themeManager.js      # Palettes dynamiques
│   ├── chart.js             # Graphiques Chart.js
│   ├── pwaManager.js        # PWA (nécessite HTTPS)
│   ├── manifest.json        # Manifest PWA
│   └── sw.js                # Service Worker
├── nginx.conf               # Configuration Nginx
├── dockerfile               # Image Docker
└── .htpasswd.example        # Template authentification
```

## 🎨 Architecture CSS

### Modulaire
8 fichiers CSS thématiques pour une maintenance facile :
- Séparation des responsabilités
- Réutilisabilité
- Clarté du code

### Variables CSS Dynamiques
Le `themeManager.js` modifie les variables CSS en temps réel :

```javascript
root.style.setProperty('--bg-primary', '#dbeafe');  // Bleu
root.style.setProperty('--text-primary', '#1e3a8a');
root.style.setProperty('--chart-color', '#3b82f6');
```

## 🔧 Configuration

### API Endpoint (config.js)

```javascript
API: {
    BASE_URL: 'http://VOTRE_IP_SERVEUR:8000',
    REFRESH_INTERVAL: 5000  // 5 secondes
}
```

### Seuils Température (themeManager.js)

```javascript
if (temp < 18) theme = 'cold';
else if (temp < 25) theme = 'comfort';
else if (temp < 30) theme = 'warm';
else theme = 'hot';
```

## 🚀 Déploiement

### Docker

```bash
docker build -t weather-frontend .
docker run -p 80:80 weather-frontend
```

### Nginx Standalone

```bash
cp -r public/* /var/www/html/
systemctl restart nginx
```

## 🔒 Authentification

Générer le fichier `.htpasswd` :

```bash
htpasswd -c .htpasswd admin
```

Le `nginx.conf` exempte les fichiers PWA de l'authentification.

## 📱 PWA (Progressive Web App)

⚠️ **Nécessite HTTPS** pour fonctionner sur mobile

Fichiers PWA :
- `manifest.json` - Métadonnées app
- `sw.js` - Service Worker (cache)
- `pwaManager.js` - Gestion installation
- `icons/` - Icônes diverses tailles

## 🎯 Endpoints API Utilisés

- `GET /data/live` - Données temps réel
- `GET /data/average/7` - Moyenne 7 jours
- `GET /data/average/30` - Moyenne 30 jours
- `GET /data/history/{days}` - Historique pour graphiques

## 🐛 Débogage

Console navigateur (F12) affiche :
- État des connexions API
- Changements de thème
- Erreurs réseau
- Données reçues

## ⚡ Performance

- CSS modulaire chargé en une fois
- JavaScript ES6 modules
- Chart.js chargé via CDN
- Images optimisées
- Cache navigateur activé