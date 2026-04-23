/** Calculator & chart logic */
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

// Listeners for calculator form
meterInput.addEventListener('input', updateCalculations);
priceInput.addEventListener('input', updateCalculations);
initialPercent.addEventListener('change', updateCalculations);

// Init calculator on load
window.onload = updateCalculations;


/** Lots Zoom logic */
const lotsImage = document.getElementById('lotsImage');
const lotsInfoOverlay = document.getElementById('lotsInfoOverlay');
const lotsZoomControls = document.getElementById('lotsZoomControls');
const lotsZoomMinus = document.getElementById('lotsZoomMinus');
const lotsZoomPlus = document.getElementById('lotsZoomPlus');

var zoomLevel = 3;

function scaleImage() {
  lotsImage.style.transform = `scale(${zoomLevel})`;
  lotsImage.style.transformOrigin = 'center';
}

function toggleOverlayOff() {
  lotsInfoOverlay.classList.add('hidden');
  lotsZoomControls.classList.remove('hidden');
}

function initiateZoom() {
  scaleImage();
  toggleOverlayOff();
}

lotsInfoOverlay.addEventListener('click', initiateZoom);

/**
 * Changes the zoom scale, and disables/enables the zoom buttons. 
 * On MAX zoom, it disables increase button.
 * On MIN zoom, it disables decrease button and resets drag position.
 * @param {number} zoom the new zoom value
 */
function updateZoom(zoom = null) {
  if (!zoom) return;
  zoomLevel = zoom;
  lotsImage.style.transform = `scale(${zoomLevel})`;
  lotsZoomPlus.disabled = false;
  lotsZoomMinus.disabled = false;
  if (zoomLevel === 5) {
    lotsZoomPlus.disabled = true;
  } else if (zoomLevel === 1) {
    lotsZoomMinus.disabled = true;
    lotsImage.style.transformOrigin = 'center';
    pos5 = 0, pos6 = 0;
  }
}

/** Increase the zoom scale by a factor of 1 */
function increaseZoom() {
  if (zoomLevel === 5) return;
  updateZoom(Math.floor(zoomLevel) + 1);
}

/** Decrease the zoom scale by a factor of 1 */
function decreaseZoom() {
  if (zoomLevel === 1) return;
  updateZoom(Math.ceil(zoomLevel) - 1);
}

lotsZoomPlus.addEventListener('click', increaseZoom);
lotsZoomMinus.addEventListener('click', decreaseZoom);

function doubleClickTapZoom() {
  if (zoomLevel < 4) {
    updateZoom(4);
  } else {
    updateZoom(2);
  }
}

lotsImage.addEventListener('dblclick', doubleClickTapZoom);

var isScaling = false;
var pinchDistance = 0;

function pinchStart(e) {
  if (!isScaling) return;
  // get the distance between the two fingers on start
  pinchDistance = Math.hypot(
    e.touches[0].pageX - e.touches[1].pageX,
    e.touches[0].pageY - e.touches[1].pageY
  );
  document.addEventListener('touchend', closePinchElement, {passive: false});
  document.addEventListener('touchcancel', closePinchElement, {passive: false});
  // call a function whenever the touch point moves:
  document.addEventListener('touchmove', pinchMove, {passive: false});
}

function pinchMove(e) {
  if (!isScaling) return;
  e.preventDefault();
  // get the new distance between the two fingers on move
  const newPinchDistance = Math.hypot(
    e.touches[0].pageX - e.touches[1].pageX,
    e.touches[0].pageY - e.touches[1].pageY
  );
  var scaleRate = 0;
  if (newPinchDistance > pinchDistance) {
    // zoom in, max zoom set to 5
    const zoom = zoomLevel + ((newPinchDistance / pinchDistance) * .05);
    scaleRate = zoom >= 5 ? 5 : zoom;
  } else {
    // zoom out, min zoom set to 1
    const zoom = zoomLevel - ((pinchDistance / newPinchDistance) * .05);
    scaleRate = zoom <= 1 ? 1 : zoom;
  }
  updateZoom(scaleRate);
}

function closePinchElement() {
  // stop zooming when touch is released
  document.removeEventListener('touchend', closePinchElement, {passive: false});
  document.removeEventListener('touchcancel', closePinchElement, {passive: false});
  document.removeEventListener('touchmove', pinchMove, {passive: false});
  isScaling = false;
}

lotsImage.addEventListener('touchstart', (e) => {
  if (e.touches.length === 2) {
    isScaling = true;
    e.preventDefault();
    pinchStart(e);
  } else {
    dragMouseDown(e);
  }
});

/** Mouse drag functionality */
var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, pos5 = 0, pos6 = 0;

function dragMouseDown(e) {
  if (zoomLevel === 1) return;
  const xPosition = e.clientX ?? e.touches[0].clientX;
  const yPosition = e.clientY ?? e.touches[0].clientY;
  // get the mouse cursor position at startup
  pos3 = xPosition;
  pos4 = yPosition;
  document.onmouseup = closeDragElement;
  // call a function whenever the cursor moves:
  document.onmousemove = elementDrag;

  document.addEventListener('touchend', closeDragElement, {passive: false});
  document.addEventListener('touchcancel', closeDragElement, {passive: false});
  // call a function whenever the touch point moves:
  document.addEventListener('touchmove', elementDrag, {passive: false});
}

function elementDrag(e) {
  if (zoomLevel === 1) return;
  e.preventDefault();
  const xPosition = e.clientX ?? e.touches[0].clientX;
  const yPosition = e.clientY ?? e.touches[0].clientY;
  // calculate the new cursor position
  pos1 = pos3 - xPosition;
  pos2 = pos4 - yPosition;
  pos3 = xPosition;
  pos4 = yPosition;
  const dragRate = zoomLevel - .9;
  const xMovement = pos5 + (pos1 / dragRate);
  const yMovement = pos6 + (pos2 / dragRate);
  // update positions if image axis is not fully visible
  if (Math.abs(xMovement) <= Math.abs(lotsImage.scrollWidth / 2)) {
    pos5 = xMovement;
  }
  if (Math.abs(yMovement) <= Math.abs(lotsImage.scrollHeight / 2)) {
    pos6 = yMovement;
  }
  // set the element's new position:
  lotsImage.style.transformOrigin = `calc(50% + ${pos5}px) calc(50% + ${pos6}px)`;
}

function closeDragElement() {
  // stop moving when mouse button is released:
  document.onmouseup = null;
  document.onmousemove = null;
  document.removeEventListener('touchend', closeDragElement, {passive: false});
  document.removeEventListener('touchcancel', closeDragElement, {passive: false});
  document.removeEventListener('touchmove', elementDrag, {passive: false});
}
lotsImage.addEventListener('mousedown', (e) => {
  e.preventDefault();
  lotsImage.classList.add('cursor-grabbing');
  dragMouseDown(e);
});
lotsImage.addEventListener('mouseup',  () => lotsImage.classList.remove('cursor-grabbing'));
