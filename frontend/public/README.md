# 📁 Structure du dossier public

Ce dossier contient tous les fichiers statiques de l'interface web de la station météo.

## 📂 Organisation

```
public/
├── index.html              # Page principale
├── chart.html              # Page des graphiques
├── css/                    # Tous les styles CSS
│   ├── main.css           # Styles principaux
│   ├── variables.css      # Variables CSS (couleurs, espacements)
│   ├── base.css           # Styles de base
│   ├── card.css           # Styles des cartes
│   ├── weather.css        # Styles météo
│   ├── status.css         # Indicateurs de statut
│   ├── animations.css     # Animations
│   └── responsive.css     # Media queries
├── js/                     # Tous les scripts JavaScript
│   ├── app.js             # Point d'entrée principal
│   ├── config.js          # Configuration API
│   ├── weatherService.js  # Service de récupération des données
│   ├── weatherDisplay.js  # Affichage des données
│   ├── pwaManager.js      # Gestion PWA
│   ├── chart.js           # Graphiques Chart.js
│   └── sw.js              # Service Worker
├── icons/                  # Icônes PWA (16x16 à 512x512)
└── assets/                 # Ressources diverses
    ├── manifest.json      # Manifest PWA
    ├── favicon.ico        # Favicon
    ├── apple-touch-icon.png
    ├── source-icon.svg    # Icône source
    └── generate-icons.sh  # Script de génération d'icônes
```

## 🎨 CSS

Les styles sont organisés par responsabilité :
- **variables.css** : Palette de couleurs dynamique, espacements, transitions
- **base.css** : Reset CSS et styles de base
- **card.css** : Styles des cartes météo
- **weather.css** : Sections température/humidité
- **status.css** : Indicateurs de connexion
- **animations.css** : Animations et transitions
- **responsive.css** : Adaptations mobile/tablette

## 📜 JavaScript

Architecture modulaire ES6 :
- **app.js** : Initialisation et orchestration
- **config.js** : URL de l'API
- **weatherService.js** : Récupération des données (fetch)
- **weatherDisplay.js** : Mise à jour du DOM
- **pwaManager.js** : Service Worker et installation PWA
- **chart.js** : Graphiques historiques avec Chart.js
- **sw.js** : Cache et mode hors ligne

## 🎯 Points d'entrée

- **index.html** : Interface principale avec données en temps réel
- **chart.html** : Graphiques historiques (7 ou 30 jours)

## 🔧 Configuration

Modifier `js/config.js` pour changer l'URL de l'API :
```javascript
export const API_BASE_URL = 'http://localhost:8000';
```

## 📱 PWA

L'application est une Progressive Web App :
- **Installable** sur mobile et desktop
- **Mode hors ligne** avec cache
- **Icônes adaptatives** pour tous les appareils
- **Manifest** pour Android/iOS

## 🎨 Thèmes dynamiques

La palette de couleurs change selon la température :
- **< 18°C** : Bleu (froid)
- **18-25°C** : Vert (confort)
- **25-30°C** : Orange (chaud)
- **> 30°C** : Rouge (canicule)

Logique dans `js/weatherDisplay.js`
