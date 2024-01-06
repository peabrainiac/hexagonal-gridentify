export default class HexagonalTile extends HTMLElement {
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
					top: ${55-50*y/((N+0.25)*Math.sqrt(3)/2)}%;
					transform: translate(-50%,-50%);
					pointer-events: none;
				}
				#tile {
					width: 110%;
					height: 110%;
					transition: background-color 0.05s ease;
					background-color: #bfbfbf;
					clip-path: polygon(${[0,1,2,3,4,5].map(i=>[0,1,2,3,4,5].map(j=>`${50+50*(0.925*Math.cos((i+0.5)*Math.PI/3)+0.075*Math.cos((i+(j-2.5)/5+0.5)*Math.PI/3))}% ${50+50*(0.925*Math.sin((i+0.5)*Math.PI/3)+0.075*Math.sin((i+(j-2.5)/5+0.5)*Math.PI/3))}%`)).flat().join(", ")});
					pointer-events: auto;
				}
				:host(.tile-1) #tile {
					background: #cdebff;
				}
				:host(.tile-2) #tile {
					background: #cdd7ff;
				}
				:host(.tile-3) #tile {
					background: #cdc3ff;
				}
				:host(.tile-4) #tile, :host(.tile-5) #tile, :host(.tile-6) #tile, :host(.tile-7) #tile, :host(.tile-8) #tile, :host(.tile-9) #tile {
					background: #cdafff;
				}
				:host(.tile-e1) #tile, :host(.tile-e2) #tile, :host(.tile-e3) #tile, :host(.tile-e4) #tile {
					background: #cd9bff;
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
					font-size: 100%;
					pointer-events: none;
				}
				:host(.tile-e1) span {
					font-size: 95%;
				}
				:host(.tile-e2) span {
					font-size: 75%;
				}
				:host(.tile-e3) span {
					font-size: 60%;
				}
				:host(.tile-e4) span {
					font-size: 52%;
				}
				@media (prefers-color-scheme: dark) {
					span {
						color: white;
					}
					:host(.tile-1) #tile {
						background: #383838;
					}
					:host(.tile-2) #tile {
						background: #605c54;
					}
					:host(.tile-3) #tile {
						background: #7c7064;
					}
					:host(.tile-4) #tile, :host(.tile-5) #tile {
						background: #a08050;
					}
					:host(.tile-6) #tile, :host(.tile-7) #tile, :host(.tile-8) #tile, :host(.tile-9) #tile {
						background: #bf9040;
					}
					:host(.tile-e1) #tile {
						background: #dfa020;
					}
					:host(.tile-e2) #tile {
						background: #efa810;
					}
					:host(.tile-e3) #tile, :host(.tile-e4) #tile {
						background: #ffaf00;
					}
					:host {
						filter: drop-shadow(0 0 min(1vw,1.155vh) #ffcf6000) drop-shadow(0 0 min(5vw,5.775vh) #ffcf6000);
						transition: filter 0.5s ease;
					}
					:host(.tile-e2) {
						filter: drop-shadow(0 0 min(1vw,1.155vh) #ffcf6020) drop-shadow(0 0 min(5vw,5.775vh) #ffcf6040);
						z-index: 1;
					}
					:host(.tile-e3) {
						filter: drop-shadow(0 0 min(2vw,2.31vh) #ffcf6040) drop-shadow(0 0 min(10vw,11.55vh) #ffcf6080);
						z-index: 2;
					}
					:host(.tile-e4) {
						filter: drop-shadow(0 0 min(3vw,3.465vh) #ffcf6060) drop-shadow(0 0 min(15vw,17.325vh) #ffcf60c0);
						z-index: 3;
					}
					:host(.selected) #tile {
						background-color: #ff8000 !important;
					}
				}
			</style>
			<div id="tile">
				<span></span>
			</div>
		`;
		this._value = 0;
		/** @type {HexagonalTile} */
		this._neighbours = [];
		this._tile = this.shadowRoot.getElementById("tile");
		this._span = this.shadowRoot.querySelector("span");
		this._x = x;
		this._y = y;
		this._tile.addEventListener("pointerdown",e=>{
			this._tile.releasePointerCapture(e.pointerId);
			if (document.releaseCapture){
				document.releaseCapture();
			}
		});
	}

	get value(){
		return this._value;
	}

	set value(value){
		this._value = value;
		this._span.innerText = value;
		for (let i=1;i<10;i++) {
			this.classList.toggle("tile-"+i,this._value==i);
		}
		this.classList.toggle("tile-e1",this._value.toString().length==2);
		this.classList.toggle("tile-e2",this._value.toString().length==3);
		this.classList.toggle("tile-e3",this._value.toString().length==4);
		this.classList.toggle("tile-e4",this._value.toString().length>=5);
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