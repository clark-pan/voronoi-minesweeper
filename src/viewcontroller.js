import * as _ from "lodash";

import State from "./state";
import * as Vector from "./vector.js";
import * as Physics from "./physics";
import * as Graphics from "./graphics";

const GAME_SIZES = {
	"beginner" : {
		cells : 9 * 9,
		mines : 10
	},
	"intermediate" : {
		cells : 16 * 16,
		mines : 40
	},
	"expert" : {
		cells : 16 * 30,
		mines : 99
	},
	"master" : {
		cells : 30 * 30,
		mines : 200
	}
}

export default class ViewController {
	constructor() {
		this.canvas = document.getElementById('app');
		this.context = this.canvas.getContext("2d");
		this.restartBtn = document.getElementById('button-restart');
		this.mineCountLabel = document.getElementById('label-mine-count');
		this.difficultyInput = document.getElementById('select-difficulty');

		this.difficulty = "beginner";
		this._totalMines = 10;
		this.resizeCanvas();
		this.newGame();

		// Bind some events
		this.canvas.addEventListener('mousemove', this.onCanvasMouseMove.bind(this));
		this.canvas.addEventListener('mouseout', this.onCanvasMouseOut.bind(this));
		this.canvas.addEventListener('click', this.onCanvasClick.bind(this));
		this.canvas.addEventListener('contextmenu', this.onCanvasRightClick.bind(this));

		window.addEventListener('resize', this.resizeCanvas.bind(this));

		this.restartBtn.addEventListener('click', this.newGame.bind(this));

		this.difficultyInput.addEventListener('change', () => {
			this.updateDifficulty(this.difficultyInput.value);
		});

		this.tick();
	}

	newGame() {
		let { width, height } = this.canvas;
		let { cells, mines } = GAME_SIZES[this.difficulty];

		this.mousePoint = null;
		this.mouseSite = null;

		this._totalMines = mines;

		this.state = new State(width, height, cells, mines);

		this.mineCountLabel.innerText = this._totalMines;
	}

	updateDifficulty(difficulty) {
		this.difficulty = difficulty;
	}

	resizeCanvas() {
		let parent = this.canvas.parentNode;
		let width = parent.clientWidth;
		let height = parent.clientHeight;
		this.canvas.width = width;
		this.canvas.height = height;
	}

	onCanvasMouseMove(e) {
		if(!this.mousePoint) this.mousePoint = {};
		//TODO replace layerX and layerY with cross-browser compatible position calculations
		this.mousePoint.x = e.layerX;
		this.mousePoint.y = e.layerY;

		this.mouseSite = _.min(this.state.sites, (site) => {
			return Vector.distSquared(site, this.mousePoint);
		});
	}

	onCanvasMouseOut(e){
		this.mousePoint = null;
		this.mouseSite = null;
	}

	onCanvasClick(e){
		if(this.state.completed) return;
		let targetSite = _.min(this.state.sites, (site) => {
			return Vector.distSquared(site, {
				x : e.layerX,
				y : e.layerY
			});
		});

		if(targetSite.isFlagged) return;

		if(event.shiftKey){
			if(targetSite.isRevealed){
				let flagged = _.filter(this.state.getNeighbours(targetSite), 'isFlagged');
				if(flagged.length === targetSite.neighbourMines){
					this.state.revealAllNeighbours(targetSite);
				}
			}
		} else {
			if(targetSite.neighbourMines === 0){
				this.state.revealAllNeighbours(targetSite);
			} else {
				this.state.revealSite(targetSite);
			}
		}

		if(this.state.completed){
			if(this.state.victory){
				alert('Winner!');
			} else {
				alert('Boooooom!');
			}
		}
	}

	onCanvasRightClick(e){
		e.preventDefault();
		let targetSite = _.min(this.state.sites, (site) => {
			return Vector.distSquared(site, {
				x : e.layerX,
				y : e.layerY
			});
		});

		if(targetSite.isRevealed) return;

		targetSite.isFlagged = !targetSite.isFlagged;

		this.mineCountLabel.innerText = this._totalMines - _.chain(this.state.sites).filter('isFlagged').size().value();
	}

	tick(){
		Physics.resolve(this.state.diagram.vertices, this.mousePoint);
		Graphics.draw(this.context, this.state, this.mouseSite);
		requestAnimationFrame(this.tick.bind(this));
	}
}