import * as _ from "lodash";

import * as Vector from "./vector";

export function draw(context, state, mouseSite){
	const { width, height } = context.canvas;
	// Clear the canvas
	context.clearRect(0, 0, width, height);

	// Draw all the none highlighted edges
	context.save();
	_.each(state.diagram.edges, (edge) => {
		context.beginPath();
		if(edge.lSite.isFlagged || (edge.rSite && edge.rSite.isFlagged)){
			context.strokeWidth = 5;
			context.strokeStyle = "red";
		} else if (edge.lSite === mouseSite || (edge.rSite && edge.rSite === mouseSite)) {
			context.strokeWidth = 5;
			context.strokeStyle = "blue";
		} else if(
			edge.rSite && 
			(
				(edge.lSite.isRevealed && edge.rSite.isRevealed) ||
				(!edge.lSite.isRevealed && !edge.rSite.isRevealed)
			)
		){
			context.strokeWidth = 1;
			context.strokeStyle = "rgba(0, 0, 0, 0.2)";
		} else {
			context.strokeWidth = 5;
			context.strokeStyle = "black";
		}
		context.moveTo(edge.va.x, edge.va.y);
		context.lineTo(edge.vb.x, edge.vb.y);
		context.stroke();
	});
	context.restore();

	if(mouseSite){
		let closestCell = state.diagram.cells[mouseSite.voronoiId];
		context.save();
		context.fillStyle = "rgba(0, 0, 255, 0.3)";
		drawCell(context, closestCell);
		context.restore();

		let emptyNeighbours = _.filter(state.getNeighbours(mouseSite), (site) => !site.isRevealed);

		_.each(emptyNeighbours, (site) => {
			let cell = state.diagram.cells[site.voronoiId];
			context.fillStyle = "rgba(0, 0, 255, 0.1)";
			drawCell(context, cell);
		});
	}

	context.save();
	_.each(state.sites, (site) => {
		let cell = state.diagram.cells[site.voronoiId], center;
		if(site.isFlagged){
			center = getCenter(cell);

			context.fillStyle = "red";
			drawCircle(context, center, 2);
		} else if (site.isRevealed){
			if(site.isMine){
				center = getCenter(cell);

				context.fillStyle = "black";
				drawCircle(context, center, 2);
			} else {
				if(site.neighbourMines === 0) return;
				center = getCenter(cell);

				context.fillStyle = "black";
				if(mouseSite && site === mouseSite){
					context.font = "24px monospace";
				} else {
					context.font = "12px monospace";
				}
				context.fillText(site.neighbourMines, center.x - 5, center.y);
			}
		}
	});
	context.restore();

	if(state.completed){
		context.save();

		// Show people where they went wrong
		_.chain(state.sites)
			.filter('isFlagged')
			.reject('isMine')
			.each((site) => {
				let cell = state.diagram.cells[site.voronoiId];
				context.fillStyle = "rgba(255, 0, 0, 0.3)";
				drawCell(context, cell);
			})
			.value();

		// Show the rest of the mines
		_.chain(state.sites)
			.filter('isMine')
			.reject('isFlagged')
			.each((site) => {
				let cell = state.diagram.cells[site.voronoiId];
				context.fillStyle = "rgba(0, 0, 0, 0.3)";
				drawCell(context, cell);
			})
			.value();

		context.restore();
	}
}

function drawCell(context, cell){
	context.beginPath();
	let firstPoint = cell.halfedges[0].getStartpoint();
	context.moveTo(firstPoint.x, firstPoint.y);
	_.each(cell.halfedges, (halfedge) => {
		let point = halfedge.getEndpoint();
		context.lineTo(point.x, point.y);
	});
	context.fill();
}

function drawCircle(context, point, radius){
	context.beginPath();
	context.arc(point.x, point.y, radius, 0, 2 * Math.PI);
	context.fill();
}

function getCenter(cell){
	let vectors = _.map(cell.halfedges, (halfedge) => halfedge.getStartpoint());
	return Vector.div(Vector.add.apply(Vector, vectors), { x : vectors.length, y : vectors.length});
}