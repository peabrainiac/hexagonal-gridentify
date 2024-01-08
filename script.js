import HexagonalTile from "./HexagonalTile.js";

queueMicrotask(()=>{
	const N = 3;
	const container = document.getElementById("container");
	const board = document.getElementById("board");
	const retryButton = document.getElementById("retry-button");
	const scoreSpan = document.getElementById("score");
	const tiles = generateGrid(N);
	tiles.forEach(tile=>board.appendChild(tile));

	let data = loadGameData()||{score: 0, board: Array.from({length:tiles.length},()=>[1,2,3][Math.floor(3*Math.random())])};
	let score = data.score;
	tiles.forEach((tile,i)=>{
		tile.value = data.board[i];
	});
	scoreSpan.innerText = score;

	checkForGameOver();

	/** @type {HexagonalTile[]} */
	let selectedTiles = [];
	tiles.forEach(tile=>{
		tile.addEventListener("pointerdown",e=>{
			if (!selectedTiles.length) {
				selectedTiles = [tile];
				tile.selected = true;
			}
			e.preventDefault();
		});
		tile.addEventListener("pointerenter",()=>{
			if (selectedTiles.length&&selectedTiles[selectedTiles.length-1].neighbours.includes(tile)&&selectedTiles[selectedTiles.length-1].value==tile.value){
				selectedTiles.push(tile);
				selectedTiles.splice(selectedTiles.indexOf(tile)+1).forEach(tile=>{tile.selected=false;});
				tile.selected = true;
			}
		});
		document.addEventListener("pointerup",()=>{
			if (new Set(selectedTiles.map(tile=>tile.value)).size==1){
				selectedTiles[selectedTiles.length-1].value *= selectedTiles.length;
				selectedTiles.slice(0,-1).forEach(tile=>{tile.value=[1,2,3][Math.floor(3*Math.random())];});
				score += selectedTiles[selectedTiles.length-1].value*(selectedTiles.length-1);
				scoreSpan.innerText = score;
				localStorage.hexagonalGridentify = JSON.stringify({score, board: tiles.map(tile=>tile.value)});
				checkForGameOver();
			}
			selectedTiles.forEach(tile=>{tile.selected=false;});
			selectedTiles = [];
		});
		document.addEventListener("pointercancel",()=>{
			selectedTiles.forEach(tile=>{tile.selected=false;});
			selectedTiles = [];
		});
	});

	window.addEventListener("storage",e=>{
		if (e.key=="hexagonalGridentify") {
			selectedTiles.forEach(tile=>{tile.selected=false;});
			selectedTiles = [];
			let data = JSON.parse(e.newValue);
			score = data.score;
			tiles.forEach((tile,i)=>{
				tile.value = data.board[i];
			});
			scoreSpan.innerText = score;
			checkForGameOver();
		}
	});

	function checkForGameOver(){
		container.classList.toggle("game-over",tiles.every(tile=>tile.neighbours.every(neighbour=>tile.value!=neighbour.value)));
	}

	retryButton.addEventListener("click",()=>{
		retryButton.blur();
		if (container.classList.contains("game-over")){
			container.classList.remove("game-over");
			tiles.forEach(tile=>{tile.value=[1,2,3][Math.floor(3*Math.random())];});
			score = 0;
			scoreSpan.innerText = score;
			localStorage.hexagonalGridentify = JSON.stringify({score, board: tiles.map(tile=>tile.value)});
			checkForGameOver();
		}
	});

	function generateGrid(n=3){
		let tiles = Array.from({length:2*n-1},(_,i)=>Array.from({length:2*n-1},(_,j)=>({x:i,y:j}))).flat().filter(({x,y})=>x+y>=n-1&&x+y<=2*n).map(({x,y})=>new HexagonalTile(x-n+1+0.5*(y-n+1),Math.sqrt(3)/2*(y-n+1),N));
		tiles.forEach(tile=>tile.neighbours.push(...tiles.filter(tile2=>tile2!==tile&&Math.hypot(tile.x-tile2.x,tile.y-tile2.y)<1.1)));
		return tiles;
	}

	/** @return {{score: number, board: number[]}} */
	function loadGameData(){
		try {
			return JSON.parse(localStorage.hexagonalGridentify);
		} catch(e) {
			return null;
		}
	}
});