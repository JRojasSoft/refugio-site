// --- Lógica de la Calculadora ---
const meterInput = document.getElementById('meterInput');
const priceInput = document.getElementById('priceInput');
const initialPercent = document.getElementById('initialPercent');
const totalPriceEl = document.getElementById('totalPrice');
const initialAmountEl = document.getElementById('initialAmount');

let paymentChart;

function updateCalculations() {
    const meters = parseFloat(meterInput.value) || 0;
    const price = parseFloat(priceInput.value) || 0;
    const percent = parseFloat(initialPercent.value);
    
    const total = meters * price;
    const initial = total * percent;
    const remaining = total - initial;

    // Formateo de moneda
    const formatter = new Intl.NumberFormat('es-DO', {
        style: 'currency',
        currency: 'DOP',
        minimumFractionDigits: 0
    });

    totalPriceEl.textContent = formatter.format(total);
    initialAmountEl.textContent = formatter.format(initial);

    updateChart(initial, remaining);
}

function updateChart(initial, remaining) {
    const ctx = document.getElementById('paymentChart').getContext('2d');
    
    if (paymentChart) {
        paymentChart.destroy();
    }

    paymentChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Inicial', 'Financiamiento'],
            datasets: [{
                data: [initial, remaining],
                backgroundColor: ['#4e762e', '#e7e5e4'],
                borderColor: ['#4e762e', '#d6d3d1'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: { size: 14 },
                        usePointStyle: true
                    }
                }
            },
            cutout: '70%'
        }
    });
}

// Listeners
meterInput.addEventListener('input', updateCalculations);
priceInput.addEventListener('input', updateCalculations);
initialPercent.addEventListener('change', updateCalculations);

// Init
window.onload = updateCalculations;