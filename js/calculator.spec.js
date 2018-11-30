/**
 * Tests for FoV to Zoom Calculator.
 * Created by Rex Twedt
 * Copyright 2018
 */

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

console.log("Test.isEqual => true");
Test.isEqual(1, 1);
Test.isEqual(Math.PI, Math.PI);
console.log("\n");

console.log("Test.isEqual => false");
Test.isEqual(1, 0);
Test.isEqual(Math.PI, Math.E);
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
