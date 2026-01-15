# 🚀 Démarrage Rapide - Station Météo ESP32

Guide ultra-rapide pour démarrer en 10 minutes.

## ⚡ Installation Express

### 1️⃣ Prérequis
```bash
# Installer PlatformIO
pip install platformio

# Vérifier Docker
docker --version
docker-compose --version
```

### 2️⃣ Configuration (3 fichiers)

**A. ESP32** (`include/config.h`)
```bash
cp include/config.h.example include/config.h
nano include/config.h
```
Modifier :
- `WIFI_SSID` → Nom de votre WiFi
- `WIFI_PASSWORD` → Mot de passe WiFi
- `MQTT_BROKER` → IP de votre PC/serveur

**B. Docker** (`docker-compose.yml`)
```bash
nano docker-compose.yml
```
Modifier ligne 23-24 :
- `DOCKER_INFLUXDB_INIT_PASSWORD` → Choisir un mot de passe
- `DOCKER_INFLUXDB_INIT_ORG` → Nom de votre organisation

**C. Frontend** (`frontend/public/config.js`)
```bash
nano frontend/public/config.js
```
Modifier ligne 13 et 16 :
- `VOTRE_IP_SERVEUR` → IP de votre PC/serveur

### 3️⃣ Lancement

**Démarrer l'infrastructure :**
```bash
docker-compose up -d
```

**Récupérer le token InfluxDB :**
1. Ouvrir `http://localhost:8086`
2. Se connecter avec `admin_meteo` / votre mot de passe
3. Aller dans **Data** → **API Tokens** → Copier le token

**Configurer Telegraf :**
```bash
cp telegraf.conf.example telegraf.conf
nano telegraf.conf
```
Modifier ligne 38-39 :
- `token` → Coller le token copié
- `organization` → Votre organisation

**Redémarrer Telegraf :**
```bash
docker-compose restart telegraf
```

**Téléverser sur ESP32 :**
```bash
pio run --target upload
```

### 4️⃣ Accès

Ouvrir dans le navigateur : `http://localhost`

## ✅ Vérification

- **ESP32** : L'écran OLED affiche température et humidité
- **Interface web** : Affiche les données en temps réel
- **Palette** : Change de couleur selon la température

## 🆘 Problème ?

Consultez [README.md](README.md) section "Dépannage"

## 📚 Documentation Complète

- [README.md](README.md) - Documentation principale
- [SETUP.md](SETUP.md) - Guide détaillé
- [CONFIGURATION.md](CONFIGURATION.md) - Détails configuration
