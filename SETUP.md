# 🔧 Guide de Configuration

## Fichiers à Configurer

Avant d'utiliser le projet, vous devez créer vos propres fichiers de configuration à partir des templates fournis :

### 1. Configuration ESP32
```bash
cp include/config.h.example include/config.h
```
Éditez `include/config.h` avec :
- Vos identifiants WiFi
- L'adresse IP de votre broker MQTT
- Les paramètres de vos capteurs

### 2. Configuration Telegraf
```bash
cp telegraf.conf.example telegraf.conf
```
Éditez `telegraf.conf` avec :
- Votre token InfluxDB
- Votre organisation InfluxDB
- Vos identifiants MQTT (si authentification activée)

### 3. Authentification Web (optionnel)
```bash
cp frontend/.htpasswd.example frontend/.htpasswd
```
Générez votre mot de passe :
```bash
htpasswd -c frontend/.htpasswd votre_utilisateur
```

### 4. Configuration Docker
Éditez `docker-compose.yml` avec :
- Vos mots de passe InfluxDB
- Votre organisation
- Vos tokens d'API

## ⚠️ Sécurité

**IMPORTANT** : Ces fichiers contiennent des données sensibles et ne doivent JAMAIS être commitées dans Git.

Ils sont automatiquement exclus par `.gitignore` :
- `include/config.h`
- `telegraf.conf` 
- `frontend/.htpasswd`

## 🚀 Démarrage Rapide

1. Configurez tous les fichiers ci-dessus
2. Lancez l'infrastructure : `docker-compose up -d`
3. Compilez et téléversez le firmware ESP32
4. Accédez à l'interface web sur `http://localhost`