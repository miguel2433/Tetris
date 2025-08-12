// Vista.js
import { COLORES } from "./Colores.js";

export class Vista {
	constructor({ contenedor, contenedorGuardado, canvasGuardada, canvasProximas, idPuntaje, idGameOver }) {
		this.contenedor = contenedor;
		this.contenedorGuardado = contenedorGuardado;
		this.canvasGuardada = canvasGuardada;
		this.canvasProximas = canvasProximas;
		this.idPuntaje = idPuntaje;
		this.idGameOver = idGameOver;
	}

	inicializarVista(filas, columnas) {
		this.contenedor.innerHTML = "";
		for (let i = 0; i < filas * columnas; i++) {
			const cell = document.createElement("div");
			cell.className = "cell";
			this.contenedor.appendChild(cell);
		}
	}

	dibujar(matriz) {
		const cells = this.contenedor.querySelectorAll(".cell");
		const filas = matriz.length;
		const columnas = matriz[0].length;

		for (let fila = 0; fila < filas; fila++) {
			for (let col = 0; col < columnas; col++) {
				const index = fila * columnas + col;
				const valor = matriz[fila][col];
				cells[index].style.backgroundColor = valor !== 0 ? COLORES[valor] : "#222";
			}
		}
	}

	actualizarPuntaje(puntaje) {
		const elem = document.getElementById(this.idPuntaje);
		if (elem) elem.innerText = `Puntaje: ${puntaje}`;
	}

	mostrarGameOver(mostrar) {
		const elem = document.getElementById(this.idGameOver);
		if (elem) elem.style.display = mostrar ? "flex" : "none";
	}

	dibujarPiezaGuardada(piezaGuardada) {
		if (!this.canvasGuardada || !piezaGuardada) return;

		const ctx = this.canvasGuardada.getContext("2d");
		const tamañoBloque = 20;
		ctx.clearRect(0, 0, this.canvasGuardada.width, this.canvasGuardada.height);

		const forma = piezaGuardada.forma;
		let minFila = forma.length,
			maxFila = 0,
			minCol = forma[0].length,
			maxCol = 0;

		for (let fila = 0; fila < forma.length; fila++) {
			for (let col = 0; col < forma[fila].length; col++) {
				if (forma[fila][col] !== 0) {
					if (fila < minFila) minFila = fila;
					if (fila > maxFila) maxFila = fila;
					if (col < minCol) minCol = col;
					if (col > maxCol) maxCol = col;
				}
			}
		}

		const ancho = maxCol - minCol + 1;
		const alto = maxFila - minFila + 1;

		const offsetX = Math.floor(this.canvasGuardada.width / tamañoBloque - ancho) / 2;
		const offsetY = Math.floor(this.canvasGuardada.height / tamañoBloque - alto) / 2;

		for (let fila = minFila; fila <= maxFila; fila++) {
			for (let col = minCol; col <= maxCol; col++) {
				const valor = forma[fila][col];
				if (valor !== 0) {
					const x = (col - minCol + offsetX) * tamañoBloque;
					const y = (fila - minFila + offsetY) * tamañoBloque;

					ctx.fillStyle = COLORES[valor];
					ctx.fillRect(x, y, tamañoBloque, tamañoBloque);
					ctx.strokeStyle = "#222";
					ctx.strokeRect(x, y, tamañoBloque, tamañoBloque);
				}
			}
		}
	}

	dibujarSiguientesPiezas(proximas) {
		if (!this.canvasProximas) return;

		const ctx = this.canvasProximas.getContext("2d");
		const tamañoBloque = 20;
		ctx.clearRect(0, 0, this.canvasProximas.width, this.canvasProximas.height);

		proximas.forEach((pieza, index) => {
			const forma = pieza.forma;
			let minFila = forma.length,
				maxFila = 0,
				minCol = forma[0].length,
				maxCol = 0;

			for (let fila = 0; fila < forma.length; fila++) {
				for (let col = 0; col < forma[fila].length; col++) {
					if (forma[fila][col] !== 0) {
						if (fila < minFila) minFila = fila;
						if (fila > maxFila) maxFila = fila;
						if (col < minCol) minCol = col;
						if (col > maxCol) maxCol = col;
					}
				}
			}

			const ancho = maxCol - minCol + 1;
			const alto = maxFila - minFila + 1;

			const offsetX = Math.floor(this.canvasProximas.width / tamañoBloque - ancho) / 2;
			const offsetY = index * 5 * tamañoBloque + Math.floor((5 - alto) / 2) * tamañoBloque + 10;

			for (let fila = minFila; fila <= maxFila; fila++) {
				for (let col = minCol; col <= maxCol; col++) {
					const valor = forma[fila][col];
					if (valor !== 0) {
						const x = (col - minCol + offsetX) * tamañoBloque;
						const y = (fila - minFila) * tamañoBloque + offsetY;

						ctx.fillStyle = COLORES[valor];
						ctx.fillRect(x, y, tamañoBloque, tamañoBloque);
						ctx.strokeStyle = "#222";
						ctx.strokeRect(x, y, tamañoBloque, tamañoBloque);
					}
				}
			}
		});
	}
}

