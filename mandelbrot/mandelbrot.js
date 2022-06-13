const canvas = document.getElementById("mandelbrot");
const julia = document.getElementById("julia");
const ctx = canvas.getContext("2d");
const ctx2 = julia.getContext("2d");
const coord = document.getElementById("coord");
const center = document.getElementById("center");
const zoomin = document.getElementById("zoomin");
const zoomout = document.getElementById("zoomout");
const zoominjulia = document.getElementById("zoominjulia");
const zoomoutjulia = document.getElementById("zoomoutjulia");
const juliacheck = document.getElementById("juliacb");
const recenter = document.getElementById("mandelrecenter");
// Misiurewicz points
// var x_center = -0.77568377;
// var y_center = 0.13646737;
// var x_scale = 0.0043;
// var y_scale = 0.0043;
var x_scale = 2.5;
var y_scale = 2.5;
var x_center = 0;
var y_center = 0;

var x_scale_julia = 2.5;
var y_scale_julia = 2.5;
var x_center_julia = 0;
var y_center_julia = 0;

var iterations = 1000;
var iterations_julia = 1000;
var cr_init = 0.08;
var ci_init = -0.26;
colorset = [
	"rgb(66, 30, 15)",
	"rgb(25, 7, 26)",
	"rgb(9, 1, 47)",
	"rgb(4, 4, 73)",
	"rgb(0, 7, 100)",
	"rgb(12, 44, 138)",
	"rgb(24, 82, 177)",
	"rgb(57, 125, 209",
	"rgb(134, 181, 229",
	"rgb(211, 236, 248",
	"rgb(241, 233, 191",
	"rgb(248, 201, 95)",
	"rgb(255, 170, 0)",
	"rgb(204, 128, 0)",
	"rgb(153, 87, 0)",
	"rgb(106, 52, 3)",
];
plotMandelbrot();
plotJulia();
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
	if (recenter.checked) {
		x_center = x_scaled;
		y_center = y_scaled;
		var str =
			"<u>Center</u> - " +
			Math.round(x_center * 100) / 100 +
			", " +
			Math.round(y_center * 100) / 100;
		center.innerHTML = str;
		plotMandelbrot();
	}
	if (juliacheck.checked) {
		cr_init = x_scaled;
		ci_init = y_scaled;
		plotJulia();
	}
});
julia.addEventListener("click", (e) => {
	const x = e.offsetX;
	const y = e.offsetY;
	const [x_scaled, y_scaled] = scaledPointJulia(x, y);
	x_center_julia = x_scaled;
	y_center_julia = y_scaled;
	plotJulia();
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
zoominjulia.addEventListener("click", () => {
	x_scale_julia = x_scale_julia / 1.5;
	y_scale_julia = y_scale_julia / 1.5;
	plotJulia();
});
zoomoutjulia.addEventListener("click", () => {
	x_scale_julia = x_scale_julia * 1.5;
	y_scale_julia = y_scale_julia * 1.5;
	plotJulia();
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

function plotJulia() {
	for (var x = 0; x < julia.width; x++) {
		for (var y = 0; y < julia.height; y++) {
			plotJuliaPoints(x, y, cr_init, ci_init);
		}
	}
}

function plotJuliaPoints(x, y, cr_init, ci_init) {
	// Wikipedia for equation
	const [x_scaled, y_scaled] = scaledPointJulia(x, y);
	var iters = 1;
	zr = x_scaled;
	zi = y_scaled;
	while (iters < iterations_julia) {
		var _zr = zr * zr - zi * zi + cr_init;
		var _zi = 2 * zr * zi + ci_init;
		zr = _zr;
		zi = _zi;
		var dis = Math.sqrt(zr * zr + zi * zi);
		if (dis >= 2) {
			const col = "white";
			ctx2.fillStyle = col;
			drawJulia(x, y);
			return;
		}
		iters++;
	}
	ctx2.fillStyle = "black";
	drawJulia(x, y);
}

function drawJulia(x, y) {
	ctx2.beginPath();
	ctx2.arc(x, y, 1, 0, Math.PI * 2);
	ctx2.fill();
}

function plotPoints(x, y) {
	const [x_scaled, y_scaled] = scaledPoint(x, y);
	var iters = 1;
	zr = 0;
	zi = 0;
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
			// console.log(iters);
			// const val = map(iters, 0, iterations, 0, 255);
			// const col = "rgb(" + val + "," + val + "," + val + ")";
			const col = colorset[iters % colorset.length];
			ctx.fillStyle = col;
			draw(x, y);
			return;
		}
		iters++;
	}
	ctx.fillStyle = "black";
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

function scaledPointJulia(x, y) {
	const x_scaled = map(
		x,
		0,
		julia.width,
		x_center_julia - x_scale_julia,
		x_center_julia + x_scale_julia
	);
	const y_scaled = map(
		y,
		0,
		julia.height,
		y_center_julia + y_scale_julia,
		y_center_julia - y_scale_julia
	);
	return [x_scaled, y_scaled];
}

function moveCenter(x, y) {
	x_center = x;
	y_center = y;
	plotMandelbrot();
}
