/**
 * FOV to Zoom (and back) Calculator.
 * Created by Rex Twedt
 * Copyright 2018
 */

/* SETUP VARIABLES */

// Get some useful elements from the DOM.
const selectFovToZoomBtn = document.getElementById("calculator-picker")
  .firstElementChild;
const selectZoomToFovBtn = document.getElementById("calculator-picker")
  .lastElementChild;

const moreInfoBtn = document.getElementById("more-info");
const moreInfoDialog = moreInfoBtn.querySelector("#more-info-dialog");

const calculator = document.getElementById("calculator");
const fovToZoomForm = calculator.querySelector("#fov-to-zoom");
const zoomToFovForm = calculator.querySelector("#zoom-to-fov");

const config = calculator.querySelector("#config");
const configDialog = config.querySelector("#config-dialog");
const configFovForm = configDialog.querySelector("#config-fov-dim");

const outputCard = calculator.querySelector("#output-card");
const outputTitle = outputCard.querySelector("h1");
const outputEl = outputCard.querySelector("#output");

/**
 * 3d programs can store horizontal, vertical, and diagonal fov info.
 * The calcualtion for zoom is slightly different depending on the direction.
 * Horizontal is Default for 3ds max.
 */
let fovDimen = "horz";

// Initialize variables to keep track of the current calculator we have selected.
const CALCULATOR_TYPES = {
  FOV_TO_ZOOM: {
    KEY: "FOV_TO_ZOOM",
    OUTPUT_TITLE: "Zoom (px)",
    PREVIOUS_VALUE: 0
  },
  ZOOM_TO_FOV: {
    KEY: "ZOOM_TO_FOV",
    OUTPUT_TITLE: "FOV (deg)",
    PREVIOUS_VALUE: 0
  }
};
let currentCalculator = CALCULATOR_TYPES.FOV_TO_ZOOM.KEY;

// Remove the zoomToFov calculator (we're starting with the fovToZoom calculator).
calculator.removeChild(zoomToFovForm);

/* FUNCTIONS */

/**
 * Convert a value from degrees to radians.
 * @param {number} value - The value (in degrees) you want to convert to radians.
 */
function degreesToRadians(value) {
  return (Math.PI / 180) * value;
}

/**
 * Convert a value from radians to degrees.
 * @param {number} value - The value (in radians) you want to convert to degrees.
 */
function radiansToDegrees(value) {
  return (180 / Math.PI) * value;
}

/**
 * Calculate the “zoom” (focal length) of a lens using the field of view
 * @param {number} width        - The width of the comp (in px).
 * @param {number} height       - The height of the comp (in px).
 * @param {number} fieldOfView  - The field of view of the camera (in degrees).
 */
function fovToZoom(width, height, fieldOfView) {
  const rad = degreesToRadians(fieldOfView / 2);

  if (fovDimen === "horz") {
    return width / (2 * Math.tan(rad)); // horizontal
  } else if (fovDimen === "vert") {
    return height / (2 * Math.tan(rad)); // vertical
  } else if (fovDimen === "diag") {
    const hyp = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
    return hyp / (2 * Math.tan(rad)); // diagonal
  }
}

/**
 * Calculate the field of view from the camera’s zoom value
 * @param {number} width  - The width of the comp (in px).
 * @param {number} height - The height of the comp (in px).
 * @param {number} zoom   - The zoom value of the camera (in px).
 */
function zoomToFov(width, height, zoom) {
  let fov;
  if (fovDimen === "horz") {
    fov = 2 * Math.atan(width / (zoom * 2)); // horizontal
  } else if (fovDimen === "vert") {
    fov = 2 * Math.atan(height / (zoom * 2)); // vertical
  } else if (fovDimen === "diag") {
    const hyp = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
    fov = 2 * Math.atan(hyp / (zoom * 2)); // diagonal
  }
  return radiansToDegrees(fov);
}

/* DOM */

/**
 * Crossfade between calculator for elements, add/remove the output card to keep the order.
 * @param {*} container
 * @param {*} fromEl
 * @param {*} toEl
 */
function crossfadeCalculators(container, fromEl, toEl) {
  container.classList.remove("show");
  container.classList.add("hide");
  setTimeout(() => {
    container.removeChild(fromEl);
    container.removeChild(outputCard); // Also remove the output card, to be reinserted later.
    setupOutputCard();
    container.appendChild(toEl);
    container.appendChild(outputCard); // Add the output card back at the end, so it keeps the correct order.
    container.classList.remove("hide");
    container.classList.add("show");
  }, 200);
}

/**
 * NOTE(rex): I think I'm linking non-animated calculator better for the moment, so I am gonna leave this here.
 * Switch between calculator for elements, add/remove the output card to keep the order.
 * @param {*} container
 * @param {*} fromEl
 * @param {*} toEl
 */
function switchCalculators(container, fromEl, toEl) {
  container.removeChild(fromEl);
  container.removeChild(outputCard); // Also remove the output card, to be reinserted later.
  setupOutputCard();
  container.appendChild(toEl);
  container.appendChild(outputCard); // Add the output card back at the end, so it keeps the correct order.
}

/**
 * Inelegant handling of the output card title, based on the selected calculator.  Damn.
 */
function setupOutputCard() {
  if (currentCalculator === CALCULATOR_TYPES.FOV_TO_ZOOM.KEY) {
    outputTitle.textContent = "Zoom (px)";
    CALCULATOR_TYPES.ZOOM_TO_FOV.PREVIOUS_VALUE = outputEl.textContent;
    outputEl.textContent = CALCULATOR_TYPES.FOV_TO_ZOOM.PREVIOUS_VALUE;
  } else if (currentCalculator === CALCULATOR_TYPES.ZOOM_TO_FOV.KEY) {
    outputTitle.textContent = "FOV (deg)";
    CALCULATOR_TYPES.FOV_TO_ZOOM.PREVIOUS_VALUE = outputEl.textContent;
    outputEl.textContent = CALCULATOR_TYPES.ZOOM_TO_FOV.PREVIOUS_VALUE;
  }
}

/**
 * Toggle between selected button states.
 */
function toggleCalculatorPicker() {
  if (currentCalculator === CALCULATOR_TYPES.FOV_TO_ZOOM.KEY) {
    selectFovToZoomBtn.classList.add("selected");
    selectZoomToFovBtn.classList.remove("selected");
  } else if (currentCalculator === CALCULATOR_TYPES.ZOOM_TO_FOV.KEY) {
    selectZoomToFovBtn.classList.add("selected");
    selectFovToZoomBtn.classList.remove("selected");
  }
}

/* EVENT LISTENERS */

/**
 * Event listener that runs the fovToZoom calculation and updates the DOM.
 * @param {DOM Event} event - DOM onclick event.
 */
function calculateZoom(event) {
  event.preventDefault();

  const w = fovToZoomForm.width.value; // in px
  const h = fovToZoomForm.height.value; // in px
  const fov = fovToZoomForm.fov.value; // field of view in degrees
  const zoom = fovToZoom(w, h, fov);

  outputEl.textContent = zoom;
}

/**
 * Event listener that runs the zoomToFov calculation and updates the DOM.
 * @param {DOM Event} event - DOM onclick event.
 */
function calculateFov(event) {
  event.preventDefault();

  const w = zoomToFovForm.width.value; // in px
  const h = zoomToFovForm.height.value; // in px
  const zoom = zoomToFovForm.zoom.value; // zoom in mm
  const fov = zoomToFov(w, h, zoom);

  outputEl.textContent = fov;
}

/**
 * Change the FOV dimension used in the final calculation.
 * @param {DOM Event} event  - onchange event.
 */
function setFovDimen(event) {
  fovDimen = event.target.value;
}

/**
 * Event listener to toggle between Calculators.
 * @param {DOM Event} event - DOM onclick event.
 * @param {string} type     - The calculator to select.
 */
function selectCalculator(event, type) {
  event.preventDefault();

  if (
    type === CALCULATOR_TYPES.FOV_TO_ZOOM.KEY &&
    currentCalculator === CALCULATOR_TYPES.ZOOM_TO_FOV.KEY
  ) {
    currentCalculator = CALCULATOR_TYPES.FOV_TO_ZOOM.KEY;

    toggleCalculatorPicker();
    switchCalculators(calculator, zoomToFovForm, fovToZoomForm);
    // crossfadeCalculators(calculator, zoomToFovForm, fovToZoomForm);
  } else if (
    type === CALCULATOR_TYPES.ZOOM_TO_FOV.KEY &&
    currentCalculator === CALCULATOR_TYPES.FOV_TO_ZOOM.KEY
  ) {
    currentCalculator = CALCULATOR_TYPES.ZOOM_TO_FOV.KEY;
    toggleCalculatorPicker();
    switchCalculators(calculator, fovToZoomForm, zoomToFovForm);
    // crossfadeCalculators(calculator, fovToZoomForm, zoomToFovForm);
  } else {
    console.log("Calculator already active!");
  }
}
