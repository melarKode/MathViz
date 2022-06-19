const canvas = document.getElementById("bezier");
const ctx = canvas.getContext("2d");

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

function plot(p) {
	ctx.beginPath();
	ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
	ctx.fill();
}
function line(p0, p1) {
	ctx.beginPath();
	ctx.moveTo(p0.x, p0.y);
	ctx.lineTo(p1.x, p1.y);
	ctx.stroke();
}

let lerp = (t, p1, p2) =>
	new Point((1 - t) * p1.x + t * p2.x, (1 - t) * p1.y + t * p2.y);
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

let randomPoint = () =>
	new Point(Math.random() * canvas.width, Math.random() * canvas.height);
let p0 = randomPoint();
let p1 = randomPoint();
let p2 = randomPoint();

let points = [p0, p1, p2];
line(p0, p1);
line(p1, p2);

for (var t = 0; t <= 1; t += 0.005) {
	let p = deCasteljau(t, points);
	plot(p);
}
for (var t = 0; t <= 1; t += 0.05) {
	line(lerp(t, p0, p1), lerp(t, p1, p2));
}
