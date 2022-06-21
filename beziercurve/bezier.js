let points = [];
let controlpoints = [];
let endpoints = [];
let addpointbtn;
let rempointbtn;
let t_anim = 0;
let showstringart = false;
let stringartcheckbox;
class Point {
	constructor(x, y, w = 10, h = 10) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}
}
let lerp = (t, p1, p2) => {
	return new Point(
		(1 - t) * p1.x + t * p2.x,
		(1 - t) * p1.y + t * p2.y,
		10,
		10
	);
};
let split = (t, p1, p2, ...ps) => {
	if (ps.length > 0) {
		return [lerp(t, p1, p2), ...split(t, p2, ...ps)];
	} else {
		return [lerp(t, p1, p2)];
	}
};
let deCasteljau = (t, ps) => {
	if (ps.length > 1) {
		return deCasteljau(t, split(t, ...ps));
	} else {
		return ps[0];
	}
};

let randomPoint = () => {
	return new Draggable(random(10, width - 10), random(10, height - 10), 10, 10);
};
let addPoint = () => {
	controlpoints.push(randomPoint());
	points = [endpoints[0], ...controlpoints, endpoints[1]];
};
let removePoint = () => {
	controlpoints.pop();
	points = [endpoints[0], ...controlpoints, endpoints[1]];
};
let checkEvent = () => {
	if (stringartcheckbox.checked()) {
		showstringart = true;
	} else {
		showstringart = false;
	}
};

function setup() {
	createCanvas(640, 360);
	createP(" ");
	addpointbtn = createButton("Add Point");
	rempointbtn = createButton("Remove Point");
	stringartcheckbox = createCheckbox("Show String Art", false);
	stringartcheckbox.changed(checkEvent);
	addpointbtn.mousePressed(addPoint);
	rempointbtn.mousePressed(removePoint);
	controlpoints = [randomPoint()];
	endpoints = [randomPoint(), randomPoint()];
	points = [endpoints[0], ...controlpoints, endpoints[1]];
}
function draw() {
	background(255);
	for (let i = 0; i < points.length; i++) {
		if (i == 0 || i == points.length - 1) {
			points[i].endpoints = true;
		}
		strokeWeight(1);
		points[i].over();
		points[i].update();
		points[i].show();
	}
	if (t_anim > 1) {
		t_anim = 0;
	}
	t_anim += 0.005;
	stroke(0, 255, 0);
	strokeWeight(10);
	let p_anim = deCasteljau(t_anim, points);
	point(p_anim.x, p_anim.y);
	let prev = points[0];
	for (let t = 0; t <= 1; t += 0.005) {
		let p = deCasteljau(t, points);
		stroke(0);
		strokeWeight(1);
		line(prev.x, prev.y, p.x, p.y);
		prev = p;
	}
	if (showstringart) {
		stroke(0);
		strokeWeight(1);
		for (let i = 1; i < points.length; i++) {
			line(points[i - 1].x, points[i - 1].y, points[i].x, points[i].y);
			for (let t = 0; t <= 1 && i < points.length - 1; t += 0.05) {
				let l1 = lerp(t, points[i - 1], points[i]);
				let l2 = lerp(t, points[i], points[i + 1]);
				line(l1.x, l1.y, l2.x, l2.y);
			}
		}
	}
}
function mousePressed() {
	for (let i = 0; i < points.length; i++) {
		points[i].pressed();
	}
}
function mouseReleased() {
	for (let i = 0; i < points.length; i++) {
		points[i].released();
	}
}

//button click p5
