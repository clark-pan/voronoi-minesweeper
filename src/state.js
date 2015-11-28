import Voronoi from "voronoi"
import * as _ from "lodash"

import * as Vector from "./vector";

let voronoi = new Voronoi();

export default class State {
	constructor(width, height, cellCount, mineCount) {
		const PADDING = 10,
			PADDED_WIDTH = width - 2 * PADDING,
			PADDED_HEIGHT = height - 2 * PADDING;

		let bbox = this.bbox = {
			xl : 0,
			xr : width,
			yt : 0,
			yb : height
		};
		let sites = this.sites = _.times(cellCount, () => {
			let site = {
				x : PADDING + Math.random() * PADDED_WIDTH,
				y : PADDING + Math.random() * PADDED_HEIGHT,
				isMine : false,
				neighbourMines : 0,
				get isRevealed(){
					return this._isRevealed;
				},
				_isRevealed : false,
				isFlagged : false
			};

			return site;
		});
		let diagram = this.diagram = voronoi.compute(sites, bbox);

		_.chain(sites)
			.sample(mineCount)
			.each((site) => {
				site.isMine = true;
			})
			.value();

		_.each(sites, (site) => {
			site.neighbourMines = _.chain(this.getNeighbours(site)).filter('isMine').size().value();
		});

		// decorate each vertex with properties for animation
		_.each(diagram.vertices, (vertex) => {
			vertex.anchor = {
				x : vertex.x,
				y : vertex.y
			};
			vertex.v = {
				x : 0,
				y : 0
			};
		});

		_.chain(diagram.edges)
			// Remove everything that has an rSite (voronoi puts rSite as null for border edges)
			.filter((edge) => {
				return edge.rSite === null;
			})
			.each((borderEdges) =>{
				borderEdges.va.pinned = true;
				borderEdges.vb.pinned = true;
			})
			.value();

		_.extend(this, {
			bbox : bbox,
			diagram : diagram,
			sites : sites,
			completed : false,
			victory : false
		});

		return this;
	}

	getNeighbours(site){
		let diagram = this.diagram;
		let cell = diagram.cells[site.voronoiId];
		let results = [];
		for(let i = 0; i < cell.halfedges.length; i++){
			let edge = cell.halfedges[i].edge;
			let otherSite = (edge.lSite === site ? edge.rSite : edge.lSite);
			if(otherSite){
				results.push(otherSite);
			}
		}
		return results;
	}

	revealSite(site){
		site._isRevealed = true;

		this._checkGameVictory();
	}

	revealAllNeighbours(site){
		let diagram = this.diagram;
		let search = [site];
		while(search.length){
			let targetSite = search.pop();
			targetSite._isRevealed = true;
			if(targetSite.neighbourMines === 0 || site === targetSite){
				search = search.concat(_.filter(this.getNeighbours(targetSite, diagram), (site) => (!site.isFlagged && !site.isRevealed) ));
			}
		}

		this._checkGameVictory();
	}

	_checkGameVictory(){
		let completed = true;

		let victory = !_.some(this.sites, (site) => {
			if(!site._isRevealed && !site.isMine){
				completed = false;
			}
			return site._isRevealed && site.isMine;
		});

		if(!victory) {
			completed = true;
		}

		this.completed = completed;
		if(this.completed){
			this.victory = victory;
			_.each(this.sites, (site) => site._isRevealed = true);
		}
	}
}