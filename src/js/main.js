// Calculator & chart logic
const meterInput = document.getElementById('meterInput');
const priceInput = document.getElementById('priceInput');
const initialPercent = document.getElementById('initialPercent');
const totalPriceEl = document.getElementById('totalPrice');
const financingAmountEl = document.getElementById('financingAmount');
const initialAmountEl = document.getElementById('initialAmount');

let paymentChart;

function updateCalculations() {
  const meters = parseFloat(meterInput.value) || 0;
  const price = parseFloat(priceInput.value) || 0;
  const percent = parseFloat(initialPercent.value);
  
  const total = meters * price;
  const initial = total * percent;
  const remaining = total - initial;

  // Currency formatting
  const formatter = new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    minimumFractionDigits: 0
  });

  totalPriceEl.textContent = formatter.format(total);
  financingAmountEl.textContent = formatter.format(remaining);
  initialAmountEl.textContent = formatter.format(initial);

  updateChart(initial, remaining);
}

function updateChart(initial, remaining) {
  const chartEl = document.getElementById('paymentChart');
  const ctx = chartEl.getContext('2d');
  
  if (paymentChart) {
    paymentChart.destroy();
  }

  if (initial || remaining) {
    chartEl.classList.remove('sr-only');
  } else {
    chartEl.classList.add('sr-only');
  }

  paymentChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Inicial', 'Financiamiento'],
      datasets: [{
        data: [initial, remaining],
        backgroundColor: ['#4e762e', '#e7e5e4'],
        borderColor: ['#4e762e', '#d6d3d1'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              family: '"Poppins", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji","Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif',
              size: 12
            },
            usePointStyle: true,
            color: '#57534d'
          }
        }
      },
      cutout: '60%'
    }
  });
}

// Listeners
meterInput.addEventListener('input', updateCalculations);
priceInput.addEventListener('input', updateCalculations);
initialPercent.addEventListener('change', updateCalculations);

// Init
window.onload = updateCalculations;


// Lots zoom logic
const imageContainer = document.getElementById('imageContainer');
const lotsImage = document.getElementById('lotsImage');
const lotsInfoOverlay = document.getElementById('lotsInfoOverlay');

function scaleImage() {
  lotsImage.style.position = 'absolute';
  lotsImage.style.top = 0;
  lotsImage.style.left = 0;
  lotsImage.style.minWidth = '1800px';
  // Scroll image container close to image center
  imageContainer.scrollTo({left: (imageContainer.scrollWidth / 3), top: (imageContainer.scrollHeight / 4)})
}

function toggleOverlay() {
  lotsInfoOverlay.classList.add('hidden');
}

function initiateZoom() {
  scaleImage();
  toggleOverlay();
}

var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

function dragMouseDown(e) {
  e.preventDefault();
  // get the mouse cursor position at startup:
  pos3 = e.clientX;
  pos4 = e.clientY;
  document.onmouseup = closeDragElement;
  // call a function whenever the cursor moves:
  document.onmousemove = elementDrag;
}

function elementDrag(e) {
  e.preventDefault();
  // calculate the new cursor position:
  pos1 = pos3 - e.clientX;
  pos2 = pos4 - e.clientY;
  pos3 = e.clientX;
  pos4 = e.clientY;
  // set the element's new position:
  lotsImage.style.top = (lotsImage.offsetTop - pos2) + "px";
  lotsImage.style.left = (lotsImage.offsetLeft - pos1) + "px";
}

function closeDragElement() {
  // stop moving when mouse button is released:
  document.onmouseup = null;
  document.onmousemove = null;
}

lotsInfoOverlay.addEventListener('click', initiateZoom);
lotsImage.addEventListener('mousedown', (e) => {
  lotsImage.classList.add('cursor-grabbing');
  dragMouseDown(e);
});
lotsImage.addEventListener('mouseup',  () => lotsImage.classList.remove('cursor-grabbing'));
