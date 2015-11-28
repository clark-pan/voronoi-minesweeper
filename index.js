import ViewController from "./src/viewcontroller";

window.minesweeper = new ViewController();

// let canvas = document.getElementById('app');
// let context = canvas.getContext("2d");
// canvas.width = canvas.parentNode.clientWidth;
// canvas.height = canvas.parentNode.clientHeight;

// let { width, height } = canvas;

// let mousePoint = null;
// let mouseSite = null;
// canvas.onmousemove = function(e){
// 	if(!mousePoint) mousePoint = {};
// 	//TODO replace layerX and layerY with cross-browser compatible position calculations
// 	mousePoint.x = e.layerX;
// 	mousePoint.y = e.layerY;

// 	mouseSite = _.min(state.sites, (site) => {
// 		return Vector.distSquared(site, mousePoint);
// 	});
// };
// canvas.onmouseout = function(){
// 	mousePoint = null;
// 	mouseSite = null;
// }
// canvas.addEventListener('click', (e) => {
// 	if(state.completed) return;
// 	let targetSite = _.min(state.sites, (site) => {
// 		return Vector.distSquared(site, {
// 			x : e.layerX,
// 			y : e.layerY
// 		});
// 	});

// 	if(targetSite.isFlagged) return;

// 	if(event.shiftKey){
// 		if(targetSite.isRevealed){
// 			let flagged = _.filter(state.getNeighbours(targetSite), 'isFlagged');
// 			if(flagged.length === targetSite.neighbourBombs){
// 				state.revealAllNeighbours(targetSite);
// 			}
// 		}
// 	} else {
// 		if(targetSite.neighbourBombs === 0){
// 			state.revealAllNeighbours(targetSite);
// 		} else {
// 			state.revealSite(targetSite);
// 		}
// 	}

// 	if(state.completed){
// 		if(state.victory){
// 			alert('Winner!');
// 		} else {
// 			alert('Boooooom!');
// 		}
// 	}
// });

// // Using contextmenu as a proxy for right click
// canvas.addEventListener('contextmenu', (e) => {
// 	e.preventDefault();
// 	let targetSite = _.min(state.sites, (site) => {
// 		return Vector.distSquared(site, {
// 			x : e.layerX,
// 			y : e.layerY
// 		});
// 	});

// 	if(targetSite.isRevealed) return;

// 	targetSite.isFlagged = !targetSite.isFlagged;
// });

// let state = new State(width, height, 30 * 16, 99);

// function tick(){
// 	Physics.resolve(state.diagram.vertices, mousePoint);
// 	Graphics.draw(context, state, mouseSite);
// 	requestAnimationFrame(tick);
// }

// tick();