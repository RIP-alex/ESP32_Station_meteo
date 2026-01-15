# 📡 Configuration MQTT

Configuration du broker Eclipse Mosquitto pour la communication IoT.

## 📋 Configuration

### mosquitto.conf

```conf
listener 1883
allow_anonymous true
```

Configuration minimale pour le développement.

## 🔒 Authentification (Optionnel)

### Activer l'authentification

1. Créer le fichier de mots de passe :

```bash
mosquitto_passwd -c mqtt/config/passwd VOTRE_UTILISATEUR
# Entrer votre mot de passe sécurisé
```

2. Modifier `mosquitto.conf` :

```conf
listener 1883
allow_anonymous false
password_file /mosquitto/config/passwd
```

3. Mettre à jour `telegraf.conf` :

```toml
[[inputs.mqtt_consumer]]
  servers = ["tcp://mqtt:1883"]
  username = "VOTRE_UTILISATEUR"
  password = "VOTRE_MOT_DE_PASSE"
```

4. Mettre à jour le code ESP32 (`mqtt_manager.cpp`) :

```cpp
client.setServer(MQTT_BROKER, MQTT_PORT);
client.connect(MQTT_CLIENT_ID, "VOTRE_UTILISATEUR", "VOTRE_MOT_DE_PASSE");
```

## 📊 Topics MQTT

### station_meteo/data

Format JSON publié par l'ESP32 :

```json
{
  "temp": 22.5,
  "hum": 65
}
```

**Fréquence** : Toutes les 5 secondes

## 🔄 Flux de Données

```
ESP32 (DHT22)
    ↓
MQTT Publish → station_meteo/data
    ↓
Mosquitto Broker (port 1883)
    ↓
Telegraf Subscribe
    ↓
InfluxDB
```

## 🚀 Déploiement

### Docker (Recommandé)

Déjà configuré dans `docker-compose.yml` :

```yaml
mosquitto:
  image: eclipse-mosquitto
  container_name: mqtt
  ports:
    - "1883:1883"
  volumes:
    - ./mqtt/config:/mosquitto/config:Z
    - mosquitto_data:/mosquitto/data:Z
    - mosquitto_log:/mosquitto/log:Z
  restart: unless-stopped
```

### Standalone

```bash
mosquitto -c mqtt/config/mosquitto.conf
```

## 🐛 Test

### Publier un message test

```bash
mosquitto_pub -h localhost -t "station_meteo/data" \
  -m '{"temp":22.5,"hum":65}'
```

### S'abonner au topic

```bash
mosquitto_sub -h localhost -t "station_meteo/#" -v
```

### Avec authentification

```bash
mosquitto_pub -h localhost -t "station_meteo/data" \
  -u VOTRE_UTILISATEUR -P VOTRE_MOT_DE_PASSE \
  -m '{"temp":22.5,"hum":65}'
```

## 📝 Logs

Voir les logs du broker :

```bash
docker logs mqtt
```

Ou consulter :
```bash
tail -f mqtt/log/mosquitto.log
```

## 🔐 Sécurité

### Développement
- `allow_anonymous true` : Pas d'authentification
- Port 1883 : Non chiffré

### Production (Recommandé)
- Activer l'authentification
- Utiliser TLS/SSL (port 8883)
- Restreindre les ACL par topic

### Configuration TLS

```conf
listener 8883
cafile /mosquitto/config/ca.crt
certfile /mosquitto/config/server.crt
keyfile /mosquitto/config/server.key
require_certificate false
```

## ⚡ Performance

- QoS 0 : Fire and forget (par défaut)
- Pas de persistance des messages
- Reconnexion automatique ESP32
- Keep-alive : 60 secondes

## 🌐 Accès Réseau

- **Local** : `localhost:1883`
- **Docker** : `mqtt:1883` (nom du service)
- **Externe** : `IP_SERVEUR:1883`

Ouvrir le port 1883 dans le firewall si nécessaire :

```bash
sudo firewall-cmd --add-port=1883/tcp --permanent
sudo firewall-cmd --reload
```