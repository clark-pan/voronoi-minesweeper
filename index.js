import { default as paper } from "paperjs/paper.js"
import Voronoi from "voronoi"
import * as _ from "lodash"

let { Point, Path, Tool } = paper;
let { Circle } = paper.Shape;
let canvas = document.getElementById('app');
let voronoi = new Voronoi();

paper.setup(canvas);

let state = {
	points : _.times(100, () => {
		return new Point({
			x : Math.random() * paper.view.viewSize.width,
			y : Math.random() * paper.view.viewSize.height
		});
	})
}

paper.view.draw();

let mouse = new Tool();
let p = new Point();
mouse.on('mousemove', (e) => {
	p = e.point;
});

paper.view.on('frame', () => {
	paper.clear();
	paper.setup(canvas);
	let bbox = {
		xl : 0,
		xr : paper.view.viewSize.width,
		yt : 0,
		yb : paper.view.viewSize.height
	}
	let diagram = voronoi.compute(state.points.concat([p]), bbox);

	_.each(diagram.edges, (edge) => {
		new Path.Line({
			from : new Point(edge.va),
			to : new Point(edge.vb),
			strokeColor : 'black'
		});
	});
});