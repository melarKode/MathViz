const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const coord = document.getElementById("coord");
const center = document.getElementById("center");
const zoomin = document.getElementById("zoomin");
const zoomout = document.getElementById("zoomout");
var x_scale = 0.0043;
var y_scale = 0.0043;
// var x_scale = 2.5;
// var y_scale = 2.5;
// Misiurewicz points
var x_center = -0.77568377;
var y_center = 0.13646737;
//0.7853981633974483,0.14
// var x_center = 0;
// var y_center = 0;
var iterations = 1000;
colorset = [
	"rgb(254, 0, 0)",
	"rgb(255, 121, 1)",
	"rgb(255, 255, 11)",
	"rgb(34, 219, 19)",
	"rgb(36, 48, 255)",
	"rgb(102, 0, 146)",
	"rgb(200, 0, 249)",
];
plotMandelbrot();
canvas.addEventListener(
	"mousemove",
	(e) => {
		var x = e.offsetX;
		var y = e.offsetY;
		[scaled_x, scaled_y] = scaledPoint(x, y);
		var str =
			"<u>Coordinates</u> - X : " +
			Math.round(scaled_x * 100) / 100 +
			", " +
			"Y : " +
			Math.round(scaled_y * 100) / 100;
		coord.innerHTML = str;
	},
	0
);

canvas.addEventListener("click", (e) => {
	const x = e.offsetX;
	const y = e.offsetY;
	const [x_scaled, y_scaled] = scaledPoint(x, y);
	x_center = x_scaled;
	y_center = y_scaled;
	var str =
		"<u>Center</u> - " +
		Math.round(x_center * 100) / 100 +
		", " +
		Math.round(y_center * 100) / 100;
	center.innerHTML = str;
	plotMandelbrot();
});

zoomin.addEventListener("click", () => {
	x_scale = x_scale / 1.5;
	y_scale = y_scale / 1.5;
	plotMandelbrot();
});
zoomout.addEventListener("click", () => {
	x_scale = x_scale * 1.5;
	y_scale = y_scale * 1.5;
	plotMandelbrot();
});

function plotMandelbrot() {
	for (var x = 0; x < canvas.width; x++) {
		for (var y = 0; y < canvas.height; y++) {
			plotPoints(x, y);
		}
	}
	// Axis for reference
	// ctx.moveTo(0, canvas.width / 2);
	// ctx.lineTo(canvas.width, canvas.width / 2);
	// ctx.moveTo(canvas.height / 2, 0);
	// ctx.lineTo(canvas.height / 2, canvas.height);
	// ctx.stroke();
}

function plotPoints(x, y) {
	const [x_scaled, y_scaled] = scaledPoint(x, y);
	var zr = 0;
	var zi = 0;
	var iters = 1;
	while (iters < iterations) {
		var _zr = zr * zr - zi * zi + x_scaled;
		var _zi = 2 * zr * zi + y_scaled;
		zr = _zr;
		zi = _zi;
		var dis = Math.sqrt(zr * zr + zi * zi);
		if (dis > 2) {
			// var smooth = Math.log2(Math.log2(zr * zr + zi * zi) / 2);
			// var cidx = Math.floor(
			// 	(Math.sqrt(iters + 10 - smooth) * 256) % colorset.length
			// );
			// const col = colorset[iters % colorset.length];
			const val = map(iters, 0, iterations, 0, 255);
			const col = "rgb(" + val + "," + val + "," + val + ")";
			ctx.fillStyle = col;
			draw(x, y);
			return;
		}
		iters++;
	}
	ctx.fillStyle = "white";
	// ctx.fillStyle = "black";
	draw(x, y);
}

function draw(x, y) {
	ctx.beginPath();
	ctx.arc(x, y, 1, 0, Math.PI * 2);
	ctx.fill();
}

function map(value, oldlow, oldhigh, newlow, newhigh) {
	return newlow + ((newhigh - newlow) * (value - oldlow)) / (oldhigh - oldlow);
}

function scaledPoint(x, y) {
	const x_scaled = map(
		x,
		0,
		canvas.width,
		x_center - x_scale,
		x_center + x_scale
	);
	const y_scaled = map(
		y,
		0,
		canvas.height,
		y_center + y_scale,
		y_center - y_scale
	);
	return [x_scaled, y_scaled];
}

function moveCenter(x, y) {
	x_center = x;
	y_center = y;
	plotMandelbrot();
}
