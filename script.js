queueMicrotask(()=>{
	const N = 3;
	const container = document.getElementById("container");
	const tiles = generateGrid(N);
	tiles.forEach(tile=>{
		tile.value = 1+Math.floor(3*Math.random());
		container.appendChild(tile);
	});

	/** @type {HexagonalTile[]} */
	let selectedTiles = [];
	tiles.forEach(tile=>{
		tile.addEventListener("mousedown",e=>{
			selectedTiles = [tile];
			tile.selected = true;
			e.preventDefault();
		});
		tile.addEventListener("mouseenter",e=>{
			if (selectedTiles.length&&selectedTiles[selectedTiles.length-1].neighbours.includes(tile)){
				selectedTiles.push(tile);
				selectedTiles.splice(selectedTiles.indexOf(tile)+1).forEach(tile=>{tile.selected=false;});
				tile.selected = true;
			}
		});
		document.addEventListener("mouseup",()=>{
			if (new Set(selectedTiles.map(tile=>tile.value)).size==1){
				selectedTiles[selectedTiles.length-1].value *= selectedTiles.length;
				selectedTiles.slice(0,-1).forEach(tile=>{tile.value=1+Math.floor(3*Math.random());});
			}
			selectedTiles.forEach(tile=>{tile.selected=false;});
			selectedTiles = [];
		});
	});

	function generateGrid(n=3){
		let tiles = Array.from({length:2*n-1},(_,i)=>Array.from({length:2*n-1},(_,j)=>({x:i,y:j}))).flat().filter(({x,y})=>x+y>=n-1&&x+y<=2*n).map(({x,y})=>new HexagonalTile(x-n+1+0.5*(y-n+1),Math.sqrt(3)/2*(y-n+1),N));
		tiles.forEach(tile=>tile.neighbours.push(...tiles.filter(tile2=>tile2!==tile&&Math.hypot(tile.x-tile2.x,tile.y-tile2.y)<1.1)));
		return tiles;
	}
});
class HexagonalTile extends HTMLElement {
	constructor(x,y,N){
		super();
		this.attachShadow({mode:"open"});
		this.shadowRoot.innerHTML = /*html*/`
			<style>
				:host {
					display: block;
					width: ${50/(N+0.25)}%;
					height: ${50/((N+0.25)*Math.sqrt(3)/2)}%;
					position: absolute;
					left: ${50+50*x/(N+0.25)}%;
					top: ${50-50*y/((N+0.25)*Math.sqrt(3)/2)}%;
					transform: translate(-50%,-50%);
					pointer-events: none;
				}
				#tile {
					width: 110%;
					height: 110%;
				}
				#tile {
					background-color: #bfbfbf;
					clip-path: polygon(${[0,1,2,3,4,5].map(i=>[0,1,2,3,4,5].map(j=>`${50+50*(0.925*Math.cos((i+0.5)*Math.PI/3)+0.075*Math.cos((i+(j-2.5)/5+0.5)*Math.PI/3))}% ${50+50*(0.925*Math.sin((i+0.5)*Math.PI/3)+0.075*Math.sin((i+(j-2.5)/5+0.5)*Math.PI/3))}%`)).flat().join(", ")});
					pointer-events: auto;
				}
				:host(.selected) #tile {
					background-color: #ff0000 !important;
				}
				#tile, span {
					display: inline-block;
					position: absolute;
					left: 50%;
					top: 50%;
					transform: translate(-50%,-50%);
				}
				span {
					font-size: min(10vw,11.55vh);
					pointer-events: none;
				}
			</style>
			<div id="tile">
				<span></span>
			</div>
		`;
		this._value = 0;
		/** @type {HexagonalTile} */
		this._neighbours = [];
		this._span = this.shadowRoot.querySelector("span");
		this._x = x;
		this._y = y;
	}

	get value(){
		return this._value;
	}

	set value(value){
		this._value = value;
		this._span.innerText = value;
		this.shadowRoot.querySelector("#tile").style.background = value==1?"#cdebff":value==2?"#cdd7ff":value==3?"#cdc3ff":value==4?"#cdafff":"#cd9bff";
	}

	/** @readonly */
	get neighbours(){
		return this._neighbours;
	}

	/** @readonly */
	get x(){
		return this._x;
	}

	/** @readonly */
	get y(){
		return this._y;
	}

	get selected(){
		return this.classList.contains("selected");
	}

	set selected(selected){
		this.classList.toggle("selected",selected);
	}
}
customElements.define("hexagonal-tile",HexagonalTile);