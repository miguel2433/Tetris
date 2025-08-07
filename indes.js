import { Tablero } from "./Tablero.js";

const contenedorTetris = document.getElementById("tetris-grid");
const contenedorGuardado = document.getElementById("pieza-guardada");


const tablero = new Tablero(contenedorTetris, 20, 10, contenedorGuardado);
tablero.iniciar();


document.addEventListener("keydown", (e) => {
	switch (e.code) {
		case "ArrowLeft":
			tablero.moverIzquierda();
			break;
		case "ArrowRight":
			tablero.moverDerecha();
			break;
		case "ArrowDown":
			tablero.bajarPieza();
			break;
		case "ArrowUp":
			tablero.rotar();
			break;
		case "Space":
			tablero.soltar();
			break;
		case "KeyC":
			tablero.guardarPieza();
			break;
	}
});
