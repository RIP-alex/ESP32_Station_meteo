## ⚠️ Configuration Requise

**IMPORTANT** : Avant de compiler le projet, vous devez créer votre fichier de configuration :

1. Copiez le fichier template :
   ```bash
   cp include/config.h.example include/config.h
   ```

2. Éditez `include/config.h` avec vos paramètres :
   - SSID et mot de passe WiFi
   - Adresse IP de votre broker MQTT
   - Autres paramètres selon votre installation

⚠️ **Ne jamais commiter le fichier `config.h` - il est exclu par `.gitignore`**