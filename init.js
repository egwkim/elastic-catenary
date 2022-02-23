const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const movementAvgP = document.getElementById("movement-avg");
const movementSumP = document.getElementById("movement-sum");
const pauseBtn = document.getElementById("pause");
const resumeBtn = document.getElementById("resume");

canvas.setAttribute("width", window.innerWidth - 420);
canvas.setAttribute("height", window.innerHeight - 10);

getInputValues();
reset();