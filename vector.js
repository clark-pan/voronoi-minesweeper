export let zero = {
	x : 0,
	y : 0
};

export function dist(a, b){
	let dx = b.x - a.x, dy = b.y - a.y;
	return Math.sqrt(dx * dx + dy * dy);
}

export function distSquared(a, b){
	let dx = b.x - a.x, dy = b.y - a.y;
	return dx * dx + dy * dy;
}

export function add(...vectors){
	let x = 0, y = 0;
	for(let i = 0; i < vectors.length; i++){
		x += vectors[i].x;
		y += vectors[i].y;
	}
	return {
		x : x,
		y : y
	};
}

export function sub(a, b){
	return {
		x : a.x - b.x,
		y : a.y - b.y
	};
}

export function mul(a, b){
	return {
		x : a.x * b.x,
		y : a.y * b.y
	};
}

export function div(a, b){
	return {
		x : a.x / b.x,
		y : a.y / b.y
	};
}

export function unit(a){
	let d = dist(a, zero);
	return {
		x : a.x / d,
		y : a.y / d
	};
}