/**
 * FOV to Zoom (and back) Calculator.
 * Created by Rex Twedt
 * Copyright 2018
 */

// TODO(rex): Some nice fading animations!

/* SETUP VARIABLES */

// Get some useful elements from the DOM.
const calculatorSelector = document.getElementById("calculator-selector");
const selectFovToZoomBtn = calculatorSelector.firstElementChild;
const selectZoomToFovBtn = calculatorSelector.lastElementChild;

const calculator = document.getElementById("calculator");
const fovToZoomForm = calculator.querySelector("#fov-to-zoom");
const zoomToFovForm = calculator.querySelector("#zoom-to-fov");

const configFovDimen = calculator.querySelector("#configure-fov-dimen");
const configFovForm = configFovDimen.querySelector(
  "#configure-fov-dimen-dialog"
);

const outputCard = calculator.querySelector("#output-card");
const outputEl = outputCard.querySelector("#output");

const moreInfoBtn = document.getElementById("more-info");
const moreInfoDialog = moreInfoBtn.querySelector("#more-info-dialog");

/**
 * 3d programs can store horizontal, vertical, and diagonal fov info.
 * The calcualtion for zoom is slightly different depending on the direction.
 * Horizontal is Default for 3ds max.
 */
let fovDimen = "horz";

// Initialize variables to keep track of the current calculator we have selected.
const CALCULATOR_TYPES = {
  FOV_TO_ZOOM: "FOV_TO_ZOOM",
  ZOOM_TO_FOV: "ZOOM_TO_FOV"
};
let currentCalculator = CALCULATOR_TYPES.FOV_TO_ZOOM;

// Remove the zoomToFov calculator (we're starting with the fovToZoom calculator).
calculator.removeChild(zoomToFovForm);

/* TESTING FUNCTIONS (always test your work!) */

/**
 * A simple test rig to help confirm our calculations.
 */
const Test = {};
Test.isEqual = (a, b) => {
  console.log(`${a} and ${b} are ${a === b ? "" : "NOT "}equal.`);
  return a === b;
};

console.log(" ----- Start Tests -----");
console.log("\n");

console.log("degreesToRadians");
Test.isEqual(degreesToRadians(90), Math.PI / 2);
Test.isEqual(degreesToRadians(180), Math.PI);
Test.isEqual(degreesToRadians(270), (3 * Math.PI) / 2);
Test.isEqual(degreesToRadians(360), 2 * Math.PI);
console.log("\n");

console.log("radiansToDegrees");
Test.isEqual(radiansToDegrees(Math.PI / 2), 90);
Test.isEqual(radiansToDegrees(Math.PI), 180);
Test.isEqual(radiansToDegrees((3 * Math.PI) / 2), 270);
Test.isEqual(radiansToDegrees(2 * Math.PI), 360);
console.log("\n");

console.log("fovToZoom");
Test.isEqual(fovToZoom(1920, 1080, 45), 2317.6450198781713);
Test.isEqual(fovToZoom(854, 480, 45), 1030.8691911333117);
console.log("\n");

console.log("zoomToFov");
Test.isEqual(zoomToFov(1920, 1080, 2317.645), 45.00000034748587);
Test.isEqual(zoomToFov(854, 480, 1030.869), 45.00000751173966);
console.log("\n");

console.log(" ----- End Tests ----- ");

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
  const hyp = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
  const rad = degreesToRadians(fieldOfView / 2);

  if (fovDimen === "horz") {
    return width / (2 * Math.tan(rad)); // horizontal
  } else if (fovDimen === "vert") {
    return hyp / (2 * Math.tan(rad)); // diagonal
  } else if (fovDimen === "diag") {
    return height / (2 * Math.tan(rad)); // vertical
  }
}

/**
 * Calculate the field of view from the camera’s zoom value
 * @param {number} width  - The width of the comp (in px).
 * @param {number} height - The height of the comp (in px).
 * @param {number} zoom   - The zoom value of the camera (in px).
 */
function zoomToFov(width, height, zoom) {
  const hyp = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));

  let fov;
  if (fovDimen === "horz") {
    fov = 2 * Math.atan(width / (zoom * 2)); // horizontal
  } else if (fovDimen === "vert") {
    fov = 2 * Math.atan(height / (zoom * 2)); // vertical
  } else if (fovDimen === "diag") {
    fov = 2 * Math.atan(hyp / (zoom * 2)); // diagonal
  }
  return radiansToDegrees(fov);
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
    type === CALCULATOR_TYPES.FOV_TO_ZOOM &&
    currentCalculator === CALCULATOR_TYPES.ZOOM_TO_FOV
  ) {
    currentCalculator = CALCULATOR_TYPES.FOV_TO_ZOOM;

    selectZoomToFovBtn.classList.remove("selected");
    selectFovToZoomBtn.classList.add("selected");

    calculator.removeChild(zoomToFovForm);
    calculator.removeChild(outputCard); // Also remove the output card, so the elements keep the correct order.
    calculator.appendChild(fovToZoomForm);
    calculator.appendChild(outputCard); // Add the output card back at the end, so it keeps the correct order.
  } else if (
    type === CALCULATOR_TYPES.ZOOM_TO_FOV &&
    currentCalculator === CALCULATOR_TYPES.FOV_TO_ZOOM
  ) {
    currentCalculator = CALCULATOR_TYPES.ZOOM_TO_FOV;

    selectFovToZoomBtn.classList.remove("selected");
    selectZoomToFovBtn.classList.add("selected");

    calculator.removeChild(fovToZoomForm);
    calculator.removeChild(outputCard); // Also remove the output card, so the elements keep the correct order.
    calculator.appendChild(zoomToFovForm);
    calculator.appendChild(outputCard); // Add the output card back at the end, so it keeps the correct order.
  } else {
    console.log("Calculator already active!");
  }
}
