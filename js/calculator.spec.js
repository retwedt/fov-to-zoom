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

// Save the fovDimen value so we can reset it when the tests are finished.
const fovDimenBackup = fovDimen;

console.log("fovToZoom");
fovDimen = "horz";
console.log("fovDimen == horz");
Test.isEqual(fovToZoom(1920, 1080, 45), 2317.6450198781712468496211752413);
Test.isEqual(fovToZoom(854, 480, 45), 1030.8691911333115858383210852375);
fovDimen = "vert";
console.log("fovDimen == vert");
Test.isEqual(fovToZoom(1920, 1080, 45), 1303.6753236814713263529119110732);
Test.isEqual(fovToZoom(854, 480, 45), 579.41125496954281171240529381033);
fovDimen = "diag";
console.log("fovDimen == diag");
Test.isEqual(fovToZoom(1920, 1080, 45), 2659.144183330809504153724670819);
Test.isEqual(fovToZoom(854, 480, 45), 1182.5433148993861036361943290341);
console.log("\n");

console.log("zoomToFov");
fovDimen = "horz";
console.log("fovDimen == horz");
Test.isEqual(zoomToFov(1920, 1080, 2317.6450198781712468496211752413), 45);
Test.isEqual(zoomToFov(854, 480, 1030.8691911333115858383210852375), 45);
fovDimen = "vert";
console.log("fovDimen == vert");
Test.isEqual(zoomToFov(1920, 1080, 1303.6753236814713263529119110732), 45);
Test.isEqual(zoomToFov(854, 480, 579.41125496954281171240529381033), 45);
fovDimen = "diag";
console.log("fovDimen == diag");
Test.isEqual(zoomToFov(1920, 1080, 2659.144183330809504153724670819), 45);
Test.isEqual(zoomToFov(854, 480, 1182.5433148993861036361943290341), 45);
console.log("\n");

// Reset fovDimen!
fovDimen = fovDimenBackup;

console.log(" ----- End Tests ----- ");
