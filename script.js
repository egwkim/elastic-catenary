let ctx;

let points = [];
let interv = null;

// physical constants
let k = 1;
let initLen = 5;  // distance between two points when no force is applied
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

const movementAvgP = document.getElementById('movement-avg');
const movementSumP = document.getElementById('movement-sum');


window.onload = function () {
    const canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');


    /* // draw background image

    let image = document.getElementById('image');

    canvas.setAttribute('width', image.width);
    canvas.setAttribute('height', image.height);

    //ctx.drawImage(image, 0, 0);*/


    canvas.setAttribute('width', window.innerWidth - 420);
    canvas.setAttribute('height', window.innerHeight - 10);

    getInputValues();
    reset();
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.m = 1;
    }

    static distance(a, b) {
        return ((a.x - b.x) ** 2 + (a.y - b.y) ** 2) ** 0.5;
    }

    static tan(a, b) {
        return (a.y - b.y) / (a.x - b.x);
    }

    static sin(a, b) {
        return (b.y - a.y) / Point.distance(a, b);
    }

    static cos(a, b) {
        return (b.x - a.x) / Point.distance(a, b);
    }

    static applyElasticForce(a, b) {
        let F = k * (Point.distance(a, b) - initLen);
        if (toggleStretchOnly) F = Math.max(F, 0);

        let Fx = Point.cos(a, b) * F;
        let Fy = Point.sin(a, b) * F;

        a.applyForce(Fx, Fy);
        b.applyForce(-Fx, -Fy);
    }

    applyForce(xForce, yForce) {
        this.vx += xForce * dt / this.m;
        this.vy += yForce * dt / this.m;
    }

    updatePos() {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }

    applyFriction() {
        this.applyForce(this.vx * -friction, this.vy * -friction);
    }

    applyGravity() {
        this.applyForce(0, this.m * g);
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fill();
    }
}

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
        for (let i = 0; i < pointCnt - 1; i++) {
            Point.applyElasticForce(points[i], points[i + 1]);

            if (!(i == 0 || i == pointCnt - 1)) {
                points[i].applyGravity();
                points[i].applyFriction();
            }
        }

        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

        movement = 0;

        for (let i = 0; i < pointCnt; i++) {
            points[i].updatePos();

            if (toggleLine && i != 0) {
                ctx.beginPath();
                ctx.moveTo(points[i - 1].x, points[i - 1].y);
                ctx.lineTo(points[i].x, points[i].y);
                ctx.stroke();
            }
            if (toggleCircle) points[i].draw();
            if (toggleMovement) movement += ((points[i].vx ** 2 + points[i].vy ** 2) ** 0.5);
        }
        if (toggleMovement) {
            movementSumP.innerText = movement.toFixed(6);
            movementAvgP.innerText = (movement / pointCnt).toFixed(6);
        }
    }, tick)
}

function reset() {
    init();
    loop();
}

function getInputValues() {
    pointCnt = document.getElementById('pointCnt').value;
    pointDistance = document.getElementById('distance').value;
    k = document.getElementById('k').value;
    g = document.getElementById('g').value;
    initLen = document.getElementById('initLen').value;
    friction = document.getElementById('friction').value;
    tick = document.getElementById('tick').value;
    dt = document.getElementById('dt').value;
    toggleStretchOnly = document.getElementById('toggleStretchOnly').checked;
    toggleCircle = document.getElementById('toggleCircle').checked;
    toggleLine = document.getElementById('toggleLine').checked;
    toggleMovement = document.getElementById('toggleMovement').checked;
}

function exportCoords() {
    let coords = [];
    for (let i = 0; i < pointCnt; i++) {
        coords[i] = ([points[i].x - 5, points[i].y - 5]);
    }
    var downloadElement = document.createElement('a');

    downloadElement.style.display = 'none';

    downloadElement.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(coords));
    downloadElement.download = 'coords.json';

    document.body.appendChild(downloadElement);
    downloadElement.click();

    document.body.removeChild(downloadElement);
}
