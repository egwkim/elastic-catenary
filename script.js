let points = [];
let interv = null;

// physical constants
let k = 1;
let initLen = 5; // distance between two points when no force is applied
let g = 1;
let friction = 0.2;
let toggleStretchOnly = false;

// time constants
let tick = 0;
let dt = 0;

// initial setting
let pointCnt = 50; // total number of points
let pointDistance = 10; // initial distance between two points

// appearance
let toggleLine = true; // set true to draw line between two points
let toggleCircle = true; // set true to draw circle on the points
let toggleMovement = true; // set true to display the sum of velocities
let movement; // sum of velocities

function init() {
  for (let i = 0; i < pointCnt; i++) {
    points[i] = new Point(i * pointDistance + 5, 5);
  }

  points[0].m = Infinity;
  points[pointCnt - 1].m = Infinity;
}

function loop() {
  if (interv) clearInterval(interv);
  interv = setInterval(function () {
    physicsUpdate();
    clearFrame();
    let movement = 0;
    for (let i = 0; i < pointCnt; i++) {
      // draw lines and dots
      if (toggleLine && i != 0) {
        points[i].lineTo(points[i - 1]);
      }
      if (toggleCircle) {
        points[i].draw();
      }

      // calculate total movement
      if (toggleMovement)
        movement += (points[i].vx ** 2 + points[i].vy ** 2) ** 0.5;
    }
    // show total movement
    if (toggleMovement) {
      movementSumP.innerText = movement.toFixed(6);
      movementAvgP.innerText = (movement / pointCnt).toFixed(6);
    }
  }, tick);
}

function reset() {
  init();
  loop();
  pauseBtn.style.display = "";
  resumeBtn.style.display = "none";
}

function clearFrame() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}

function drawBackgroundImg(imgElement) {
  canvas.setAttribute("width", image.width);
  canvas.setAttribute("height", image.height);
  ctx.drawImage(image, 0, 0);
}

function getInputValues() {
  pointCnt = document.getElementById("point-cnt").value;
  pointDistance = document.getElementById("distance").value;
  k = document.getElementById("k").value;
  g = document.getElementById("g").value;
  initLen = document.getElementById("initLen").value;
  friction = document.getElementById("friction").value;
  tick = document.getElementById("tick").value;
  dt = document.getElementById("dt").value;
  toggleStretchOnly = document.getElementById("toggle-stretchOnly").checked;
  toggleCircle = document.getElementById("toggle-circle").checked;
  toggleLine = document.getElementById("toggle-line").checked;
  toggleMovement = document.getElementById("toggle-movement").checked;
}

function exportCoords() {
  let coords = [];
  for (let i = 0; i < pointCnt; i++) {
    coords[i] = [points[i].x - 5, points[i].y - 5];
  }
  var downloadElement = document.createElement("a");

  downloadElement.style.display = "none";

  downloadElement.href =
    "data:text/plain;charset=utf-8," +
    encodeURIComponent(JSON.stringify(coords));
  downloadElement.download = "coords.json";

  document.body.appendChild(downloadElement);
  downloadElement.click();

  document.body.removeChild(downloadElement);
}
