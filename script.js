import HexagonalTile from "./HexagonalTile.js";

queueMicrotask(()=>{
	const N = 3;
	const container = document.getElementById("container");
	const tiles = generateGrid(N);
	tiles.forEach(tile=>container.appendChild(tile));

	let boardData = getBoardFromStorage()||Array.from({length:tiles.length},()=>[1,2,3][Math.floor(3*Math.random())]);
	tiles.forEach((tile,i)=>{
		tile.value = boardData[i];
	});

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
				localStorage.hexagonalGridentifyBoard = JSON.stringify(tiles.map(tile=>tile.value));
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
		if (e.key=="hexagonalGridentifyBoard") {
			selectedTiles.forEach(tile=>{tile.selected=false;});
			selectedTiles = [];
			let boardData = JSON.parse(e.newValue);
			tiles.forEach((tile,i)=>{
				tile.value = boardData[i];
			});
		}
	});

	function generateGrid(n=3){
		let tiles = Array.from({length:2*n-1},(_,i)=>Array.from({length:2*n-1},(_,j)=>({x:i,y:j}))).flat().filter(({x,y})=>x+y>=n-1&&x+y<=2*n).map(({x,y})=>new HexagonalTile(x-n+1+0.5*(y-n+1),Math.sqrt(3)/2*(y-n+1),N));
		tiles.forEach(tile=>tile.neighbours.push(...tiles.filter(tile2=>tile2!==tile&&Math.hypot(tile.x-tile2.x,tile.y-tile2.y)<1.1)));
		return tiles;
	}
	function getBoardFromStorage(){
		try {
			return JSON.parse(localStorage.hexagonalGridentifyBoard);
		} catch(e) {
			return null;
		}
	}
});