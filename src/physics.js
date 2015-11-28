import * as _ from "lodash";

import * as Vector from "./vector";

const MOUSE_EFFECT_SIZE = 50,
	MOUSE_FORCE = 1,
	ANCHOR_EFFECT_SIZE = 100,
	ANCHOR_FORCE = 1,
	FRICTION = 0.5;

export function resolve(vertices, mousePoint) {
	_.each(vertices, (vertex) => {
		let distance, factor, forces = [];

		if(vertex.pinned) return;

		if(mousePoint){
			distance = Vector.dist(vertex, mousePoint);
			if(distance < MOUSE_EFFECT_SIZE){
				factor = (1 - (distance / MOUSE_EFFECT_SIZE)) * MOUSE_FORCE;
				forces.push(Vector.mul(Vector.sub(vertex, mousePoint), { x : factor, y : factor}));
			}
		}

		distance = Vector.dist(vertex, vertex.anchor);
		factor = (distance / ANCHOR_EFFECT_SIZE) * ANCHOR_FORCE;
		forces.push(Vector.mul(Vector.sub(vertex.anchor, vertex), { x : factor, y : factor }));


		vertex.v = Vector.add.apply(Vector, [vertex.v].concat(forces));

		vertex.x += vertex.v.x;
		vertex.y += vertex.v.y;

		vertex.v.x *= 0.7;
		vertex.v.y *= 0.7;
	});
}