// Archivo: Tablero.js
import { Pieza } from "./Pieza.js";
import { COLORES } from "./Colores.js";

export class Tablero {
	constructor(contenedor, filas = 20, columnas = 10, contenedorGuardado = null) {
		this.contenedor = contenedor;
		this.filas = filas;
		this.columnas = columnas;
		this.matriz = this.crearMatrizVacia();
		this.puntaje = 0;
		this.intervalo = null;

		this.piezaActual = null;
		this.pieza = null;
		this.tipo = null;
		this.filaActual = 0;
		this.colActual = 3;

		this.piezaGuardada = null;
		this.puedeGuardar = true;

		this.contenedorGuardado = contenedorGuardado;
		if (this.contenedorGuardado) {
			this.inicializarVistaGuardado();
		}

		this.inicializarVista();
	}
	crearMatrizVacia() {
		return Array.from({ length: this.filas }, () => Array(this.columnas).fill(0));
	}

	inicializarVista() {
		for (let i = 0; i < this.filas * this.columnas; i++) {
			const cell = document.createElement("div");
			cell.className = "cell";
			this.contenedor.appendChild(cell);
		}
	}

	colocarPieza(pieza, filaPos, colPos) {
		for (let fila = 0; fila < pieza.length; fila++) {
			for (let col = 0; col < pieza[fila].length; col++) {
				if (pieza[fila][col] !== 0) {
					const r = filaPos + fila;
					const c = colPos + col;
					if (r >= 0 && r < this.filas && c >= 0 && c < this.columnas) {
						this.matriz[r][c] = pieza[fila][col];
					}
				}
			}
		}
	}

	borrarPieza(pieza, filaPos, colPos) {
		for (let fila = 0; fila < pieza.length; fila++) {
			for (let col = 0; col < pieza[fila].length; col++) {
				if (pieza[fila][col] !== 0) {
					const r = filaPos + fila;
					const c = colPos + col;
					if (r >= 0 && r < this.filas && c >= 0 && c < this.columnas) {
						this.matriz[r][c] = 0;
					}
				}
			}
		}
	}

	puedeMover(pieza, filaPos, colPos) {
		for (let fila = 0; fila < pieza.length; fila++) {
			for (let col = 0; col < pieza[fila].length; col++) {
				if (pieza[fila][col] !== 0) {
					const r = filaPos + fila;
					const c = colPos + col;

					if (r >= this.filas || c < 0 || c >= this.columnas || this.matriz[r][c] !== 0) {
						return false;
					}
				}
			}
		}
		return true;
	}

	puedeColocar(pieza, filaPos, colPos) {
		for (let fila = 0; fila < pieza.length; fila++) {
			for (let col = 0; col < pieza[fila].length; col++) {
				if (pieza[fila][col] !== 0) {
					const r = filaPos + fila;
					const c = colPos + col;

					if (r < 0 || r >= this.filas || c < 0 || c >= this.columnas || this.matriz[r][c] !== 0) {
						return false;
					}
				}
			}
		}
		return true;
	}

	rotarPieza(matriz) {
		const N = matriz.length;
		const nueva = Array.from({ length: N }, () => Array(N).fill(0));

		for (let fila = 0; fila < N; fila++) {
			for (let col = 0; col < N; col++) {
				nueva[col][N - 1 - fila] = matriz[fila][col];
			}
		}
		return nueva;
	}

	limpiarFilasCompletas() {
		for (let fila = this.filas - 1; fila >= 0; fila--) {
			if (this.matriz[fila].every((celda) => celda !== 0)) {
				this.matriz.splice(fila, 1);
				this.matriz.unshift(Array(this.columnas).fill(0));
				this.puntaje += 100;
				fila++;
			}
		}
		document.getElementById("puntaje").innerText = `Puntaje: ${this.puntaje}`;
	}

	dibujar() {
		const cells = this.contenedor.querySelectorAll(".cell");
		for (let fila = 0; fila < this.filas; fila++) {
			for (let col = 0; col < this.columnas; col++) {
				const index = fila * this.columnas + col;
				const celdaValor = this.matriz[fila][col];
				cells[index].style.backgroundColor = celdaValor !== 0 ? COLORES[celdaValor] : "#222";
			}
		}
	}

	generarNuevaPieza() {
		this.piezaActual = new Pieza(500);
		this.pieza = this.piezaActual.forma;
		this.tipo = this.piezaActual.tipo;
		this.filaActual = 0;
		this.colActual = 3;

		if (!this.puedeMover(this.pieza, this.filaActual, this.colActual)) {
			console.log("¡Game Over!");
			clearInterval(this.intervalo);
			return;
		}

		this.colocarPieza(this.pieza, this.filaActual, this.colActual);
		this.dibujar();
		this.dibujarPiezaGuardadaCanvas();
	}

	bajarPieza() {
		this.borrarPieza(this.pieza, this.filaActual, this.colActual);
		if (this.puedeMover(this.pieza, this.filaActual + 1, this.colActual)) {
			this.filaActual++;
		} else {
			this.colocarPieza(this.pieza, this.filaActual, this.colActual);
			this.limpiarFilasCompletas();
			this.dibujar();
			this.generarNuevaPieza();
			this.puedeGuardar = true; // desbloquea guardar tras pieza fija
			return;
		}
		this.colocarPieza(this.pieza, this.filaActual, this.colActual);
		this.dibujar();
	}

	iniciar() {
		this.generarNuevaPieza();
		this.intervalo = setInterval(() => this.bajarPieza(), 500);
	}

	moverIzquierda() {
		// Borrar pieza antes de chequear si puede moverse
		this.borrarPieza(this.pieza, this.filaActual, this.colActual);
		if (this.puedeMover(this.pieza, this.filaActual, this.colActual - 1)) {
			this.colActual--;
		}
		// Colocar pieza y dibujar
		this.colocarPieza(this.pieza, this.filaActual, this.colActual);
		this.dibujar();
	}

	moverDerecha() {
		this.borrarPieza(this.pieza, this.filaActual, this.colActual);
		if (this.puedeMover(this.pieza, this.filaActual, this.colActual + 1)) {
			this.colActual++;
		}
		this.colocarPieza(this.pieza, this.filaActual, this.colActual);
		this.dibujar();
	}

	rotar() {
		const rotada = this.rotarPieza(this.pieza);
		this.borrarPieza(this.pieza, this.filaActual, this.colActual);
		if (this.puedeColocar(rotada, this.filaActual, this.colActual)) {
			this.pieza = rotada;
		}
		this.colocarPieza(this.pieza, this.filaActual, this.colActual);
		this.dibujar();
	}

	soltar() {
		this.borrarPieza(this.pieza, this.filaActual, this.colActual);
		while (this.puedeMover(this.pieza, this.filaActual + 1, this.colActual)) {
			this.filaActual++;
		}
		this.colocarPieza(this.pieza, this.filaActual, this.colActual);
		this.dibujar();
	}
	guardarPieza() {
		if (!this.piezaActual) return;

		if (!this.piezaGuardada) {
			this.piezaGuardada = this.piezaActual;
			this.borrarPieza(this.pieza, this.filaActual, this.colActual);
			this.generarNuevaPieza();
		} else {
			let temp = this.piezaActual;
			this.borrarPieza(this.pieza, this.filaActual, this.colActual);
			this.piezaActual = this.piezaGuardada;
			this.piezaGuardada = temp;
			this.pieza = this.piezaActual.forma;
			this.tipo = this.piezaActual.tipo;
			this.filaActual = 0;
			this.colActual = 3;
		}
		this.colocarPieza(this.pieza, this.filaActual, this.colActual);
		this.dibujar();
		this.dibujarPiezaGuardadaCanvas(); // Usar canvas para dibujar guardada
	}

	dibujarPiezaGuardadaCanvas() {
		const canvas = document.getElementById("canvas-pieza-guardada");
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		const tamañoBloque = 20;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		if (!this.piezaGuardada) return;

		const forma = this.piezaGuardada.forma;

		// Encontrar bounding box
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

		const offsetX = Math.floor((canvas.width / tamañoBloque - ancho) / 2);
		const offsetY = Math.floor((canvas.height / tamañoBloque - alto) / 2);

		// Dibujar pieza centrada
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
	inicializarVistaGuardado() {
		// Limpiar contenido previo (por si reinicia)
		this.contenedorGuardado.innerHTML = "";
		// Creamos 4x4 = 16 celdas para la pieza guardada (tamaño típico)
		for (let i = 0; i < 25; i++) {
			const cell = document.createElement("div");
			cell.className = "cell";
			this.contenedorGuardado.appendChild(cell);
		}
	}
}

















