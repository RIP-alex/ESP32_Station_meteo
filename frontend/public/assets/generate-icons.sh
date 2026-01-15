#!/bin/bash

# Script de génération d'icônes PWA
# Nécessite ImageMagick : sudo apt install imagemagick

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎨 Générateur d'icônes PWA - Station Météo${NC}"
echo "=============================================="

# Vérifier si ImageMagick est installé
if ! command -v convert &> /dev/null; then
    echo -e "${RED}❌ ImageMagick n'est pas installé${NC}"
    echo -e "${YELLOW}💡 Installez-le avec: sudo apt install imagemagick${NC}"
    exit 1
fi

# Créer une icône de base si elle n'existe pas
SOURCE_ICON="source-icon.svg"
if [ ! -f "$SOURCE_ICON" ]; then
    echo -e "${YELLOW}📝 Création d'une icône SVG de base...${NC}"
    cat > "$SOURCE_ICON" << 'EOF'
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#58a6ff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0a0e14;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Arrière-plan -->
  <rect width="512" height="512" rx="80" fill="url(#bg)"/>
  
  <!-- Thermomètre -->
  <g transform="translate(180, 80)">
    <!-- Corps du thermomètre -->
    <rect x="0" y="0" width="40" height="280" rx="20" fill="#e6edf3" opacity="0.9"/>
    <!-- Bulbe -->
    <circle cx="20" cy="300" r="35" fill="#ff6b35"/>
    <!-- Mercure -->
    <rect x="10" y="200" width="20" height="100" fill="#ff6b35"/>
    <circle cx="20" cy="300" r="25" fill="#ff3838"/>
  </g>
  
  <!-- Goutte d'eau (humidité) -->
  <g transform="translate(280, 120)">
    <path d="M20 0 C30 10, 40 25, 40 40 C40 62, 31 80, 20 80 C9 80, 0 62, 0 40 C0 25, 10 10, 20 0 Z" 
          fill="#00d9ff" opacity="0.8"/>
  </g>
  
  <!-- Texte ESP32 -->
  <text x="256" y="420" text-anchor="middle" font-family="Arial, sans-serif" 
        font-size="36" font-weight="bold" fill="#e6edf3">ESP32</text>
</svg>
EOF
    echo -e "${GREEN}✅ Icône SVG créée: $SOURCE_ICON${NC}"
fi

# Tailles d'icônes à générer
SIZES=(16 32 72 96 128 144 152 192 384 512)

echo -e "${BLUE}🔄 Génération des icônes...${NC}"

# Générer chaque taille
for size in "${SIZES[@]}"; do
    output_file="icons/icon-${size}x${size}.png"
    
    echo -e "  📱 Génération ${size}x${size}..."
    
    convert "$SOURCE_ICON" \
        -resize "${size}x${size}" \
        -background transparent \
        "$output_file"
    
    if [ $? -eq 0 ]; then
        echo -e "    ${GREEN}✅ $output_file${NC}"
    else
        echo -e "    ${RED}❌ Erreur pour $output_file${NC}"
    fi
done

# Créer un favicon.ico
echo -e "${BLUE}🌐 Génération du favicon...${NC}"
convert "$SOURCE_ICON" \
    -resize 32x32 \
    -background transparent \
    favicon.ico

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ favicon.ico créé${NC}"
else
    echo -e "${RED}❌ Erreur création favicon${NC}"
fi

# Créer un apple-touch-icon
echo -e "${BLUE}🍎 Génération apple-touch-icon...${NC}"
convert "$SOURCE_ICON" \
    -resize 180x180 \
    -background transparent \
    apple-touch-icon.png

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ apple-touch-icon.png créé${NC}"
else
    echo -e "${RED}❌ Erreur création apple-touch-icon${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Génération terminée !${NC}"
echo -e "${BLUE}📁 Icônes générées dans le dossier 'icons/'${NC}"
echo ""
echo -e "${YELLOW}💡 Conseils :${NC}"
echo "  • Remplacez source-icon.svg par votre propre design"
echo "  • Testez l'installation PWA sur mobile"
echo "  • Vérifiez les icônes dans les outils de développement"