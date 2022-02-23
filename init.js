const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const movementAvgP = document.getElementById('movement-avg');
const movementSumP = document.getElementById('movement-sum');
const pauseBtn = document.getElementById('pause');
const resumeBtn = document.getElementById('resume');

canvas.setAttribute('width', window.innerWidth - 420);
canvas.setAttribute('height', window.innerHeight - 10);

let points = [];
let interv = null;

/* TODO Update logic to init settings.
 * Set values through init.js and applie them to html control panel
 */

/* TODO Save settings to one dictonary variable.
 */

// Physical constants
let springConstant = 1;
let initLen = 5; // Distance between two points when spring is undeformed
let gravityConstant = 1;
let friction = 0.2;
// If true, elastic force is applied only when the spring is extended (like a rubber band)
let toggleStretchOnly = false;

// Time constants
let tick = 0; // Interval timeout
let dt = 0; // Timestep used in physics.js

// Points
let pointCnt = 50; // Total number of points
let pointDistance = 10; // Initial distance between two points

// Appearance
let toggleLine = true; // If true, draws lines between adjacent points
let toggleCircle = true; // If true, draws circle on the points
let toggleMovement = true; // If true, displays the sum of velocities

let movement; // Sum of the velocities

let updateSettings = true;

reset();
