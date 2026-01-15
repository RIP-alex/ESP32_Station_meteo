import { CONFIG } from './config.js';

const urlParams = new URLSearchParams(window.location.search);
const days = parseInt(urlParams.get('days')) || 7;

document.getElementById('pageTitle').textContent = `Graphique ${days} jours`;

async function fetchHistoricalData(days) {
    try {
        const response = await fetch(`${CONFIG.API.BASE_URL}/data/history/${days}`);
        if (!response.ok) throw new Error('Erreur API');
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return null;
    }
}

async function initChart() {
    const data = await fetchHistoricalData(days);
    
    if (!data || !data.timestamps || !data.temperatures) {
        document.querySelector('.chart-container-wrapper').innerHTML = 
            '<p style="text-align:center;color:var(--text-secondary);">Pas assez de données disponibles</p>';
        return;
    }

    const ctx = document.getElementById('tempChart').getContext('2d');
    const isMobile = window.innerWidth < 768;
    
    // Récupérer les couleurs du thème actuel
    const chartColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-color').trim() || '#3b82f6';
    const chartBg = getComputedStyle(document.documentElement).getPropertyValue('--chart-bg').trim() || 'rgba(59, 130, 246, 0.1)';
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.timestamps,
            datasets: [{
                label: 'Température (°C)',
                data: data.temperatures,
                borderColor: chartColor,
                backgroundColor: chartBg,
                tension: 0.3,
                fill: true,
                pointRadius: isMobile ? 3 : 4,
                pointHoverRadius: isMobile ? 5 : 6,
                pointBackgroundColor: chartColor,
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim(),
                        font: { size: isMobile ? 13 : 16, weight: '500' },
                        padding: 15
                    }
                }
            },
            scales: {
                y: {
                    ticks: { 
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim(),
                        font: { size: isMobile ? 11 : 14 }
                    },
                    grid: { color: 'rgba(0, 0, 0, 0.1)' }
                },
                x: {
                    ticks: { 
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim(),
                        font: { size: isMobile ? 10 : 13 },
                        maxRotation: 45,
                        minRotation: 45,
                        maxTicksLimit: isMobile ? 8 : 20
                    },
                    grid: { color: 'rgba(0, 0, 0, 0.1)' }
                }
            }
        }
    });
}

initChart();