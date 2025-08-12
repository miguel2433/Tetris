import { Tablero } from "./Tablero.js";
import { Vista } from "./Vista.js";

const contenedor = document.getElementById("tablero");
const contenedorGuardado = document.getElementById("pieza-guardada");
const canvasGuardada = document.getElementById("canvas-pieza-guardada");
const canvasProximas = document.getElementById("canvas-proximas");
const idPuntaje = "puntaje";
const idGameOver = "gameOver";

const tablero = new Tablero();
const vista = new Vista({
	contenedor,
	contenedorGuardado,
	canvasGuardada,
	canvasProximas,
	idPuntaje,
	idGameOver,
});

vista.inicializarVista(tablero.filas, tablero.columnas);

function actualizar() {
	vista.dibujar(tablero.matriz);
	vista.dibujarPiezaGuardada(tablero.piezaGuardada);
	vista.dibujarSiguientesPiezas(tablero.colaProximas);
	vista.actualizarPuntaje(tablero.puntaje);
}

function gameLoop() {
	tablero.bajarPieza();
	actualizar();
	if (!tablero.piezaActual) {
		vista.mostrarGameOver(true);
		clearInterval(tablero.intervalo);
	}
}

function iniciarJuego() {
	vista.mostrarGameOver(false);
	tablero.reiniciar();
	tablero.generarNuevaPieza();
	actualizar();

	tablero.intervalo = setInterval(gameLoop, 500);
}

// Eventos de controles
document.addEventListener("keydown", (e) => {
	if (!tablero.piezaActual) return;

	switch (e.key) {
		case "ArrowLeft":
			tablero.moverIzquierda();
			break;
		case "ArrowRight":
			tablero.moverDerecha();
			break;
		case "ArrowUp":
			tablero.rotar();
			break;
		case "ArrowDown":
			tablero.bajarPieza();
			break;
		case " ":
			tablero.soltar();
			break;
		case "Shift":
			tablero.guardarPieza();
			break;
	}
	actualizar();
});


// Arrancar el juego
iniciarJuego();
