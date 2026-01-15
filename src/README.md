# 📟 Code Source ESP32

Code firmware pour l'ESP32 - Architecture modulaire respectant le principe SRP (Single Responsibility Principle).

## 📁 Fichiers

### main.cpp
Point d'entrée principal - Orchestration uniquement
- Initialisation des modules
- Boucle principale (setup/loop)
- Gestion du timing

### wifi_manager.cpp/h
Gestion de la connexion WiFi
- Connexion au réseau
- Reconnexion automatique
- Vérification de l'état

### mqtt_manager.cpp/h
Communication MQTT
- Connexion au broker
- Publication des données
- Reconnexion automatique

### sensor_manager.cpp/h
Lecture des capteurs
- Initialisation DHT22
- Lecture température/humidité
- Validation des données

### display_manager.cpp/h
Affichage OLED local
- Initialisation écran SSD1306
- Affichage des valeurs
- Indicateurs de statut

## 🔧 Configuration

Les paramètres sont centralisés dans `include/config.h` :

```cpp
#define WIFI_SSID "VotreSSID"
#define WIFI_PASSWORD "VotreMotDePasse"
#define MQTT_BROKER "192.168.1.100"
#define MQTT_PORT 1883
#define DHTPIN 4
#define DHTTYPE DHT22
#define LECTURE_INTERVAL 5000  // 5 secondes
```

## 📚 Bibliothèques Utilisées

- **Adafruit SSD1306** : Contrôle écran OLED
- **Adafruit GFX Library** : Graphiques de base
- **DHT sensor library** : Lecture capteur DHT22
- **PubSubClient** : Client MQTT

## 🔄 Flux d'Exécution

```
setup()
  ↓
Initialisation Display
  ↓
Initialisation Capteur
  ↓
Connexion WiFi
  ↓
Connexion MQTT
  ↓
loop()
  ↓
Lecture Capteur (toutes les 5s)
  ↓
Affichage OLED
  ↓
Publication MQTT
```

## 🐛 Débogage

Moniteur série à 115200 bauds :

```bash
pio device monitor
```

Les logs affichent :
- État des connexions WiFi/MQTT
- Valeurs lues du capteur
- Erreurs éventuelles

## ⚡ Optimisations

- Lecture capteur toutes les 5 secondes (limite DHT22)
- Reconnexion automatique WiFi/MQTT
- Validation des données avant envoi
- Gestion des erreurs robuste