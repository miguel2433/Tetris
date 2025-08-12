// Tablero.js
import { Pieza } from "./Pieza.js";

export class Tablero {
	constructor(filas = 20, columnas = 10) {
		this.filas = filas;
		this.columnas = columnas;
		this.matriz = this.crearMatrizVacia();
		this.puntaje = 0;

		this.piezaActual = null;
		this.pieza = null;
		this.tipo = null;
		this.filaActual = 0;
		this.colActual = 3;

		this.piezaGuardada = null;
		this.puedeGuardar = true;

		this.colaProximas = [new Pieza(), new Pieza(), new Pieza(), new Pieza()];

		this.intervalo = null;
	}

	crearMatrizVacia() {
		return Array.from({ length: this.filas }, () => Array(this.columnas).fill(0));
	}

	// Métodos lógicos (puedeMover, colocarPieza, borrarPieza, rotarPieza, limpiarFilasCompletas, etc.)
	// Sin manipulación directa del DOM

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
		let filasLimpiadas = 0;
		for (let fila = this.filas - 1; fila >= 0; fila--) {
			if (this.matriz[fila].every((celda) => celda !== 0)) {
				this.matriz.splice(fila, 1);
				this.matriz.unshift(Array(this.columnas).fill(0));
				this.puntaje += 100;
				filasLimpiadas++;
				fila++;
			}
		}
		return filasLimpiadas;
	}

	// Métodos para mover piezas y actualizar estado:

	generarNuevaPieza() {
		this.piezaFijada = false; // desbloquea movimiento para nueva pieza
		this.piezaActual = this.colaProximas.shift();
		this.colaProximas.push(new Pieza());

		this.pieza = this.piezaActual.forma;
		this.tipo = this.piezaActual.tipo;
		this.filaActual = 0;
		this.colActual = 3;

		if (!this.puedeMover(this.pieza, this.filaActual, this.colActual)) {
			clearInterval(this.intervalo);
			return false; // game over
		}
		this.colocarPieza(this.pieza, this.filaActual, this.colActual);
		return true;
	}

	bajarPieza() {
		this.borrarPieza(this.pieza, this.filaActual, this.colActual);
		if (this.puedeMover(this.pieza, this.filaActual + 1, this.colActual)) {
			this.filaActual++;
		} else {
			this.colocarPieza(this.pieza, this.filaActual, this.colActual);
			this.limpiarFilasCompletas();
			this.puedeGuardar = true;
			this.generarNuevaPieza();
			return;
		}
		this.colocarPieza(this.pieza, this.filaActual, this.colActual);
	}

	moverIzquierda() {
		this.borrarPieza(this.pieza, this.filaActual, this.colActual);
		if (this.puedeMover(this.pieza, this.filaActual, this.colActual - 1)) {
			this.colActual--;
		}
		this.colocarPieza(this.pieza, this.filaActual, this.colActual);
	}

	moverDerecha() {
		this.borrarPieza(this.pieza, this.filaActual, this.colActual);
		if (this.puedeMover(this.pieza, this.filaActual, this.colActual + 1)) {
			this.colActual++;
		}
		this.colocarPieza(this.pieza, this.filaActual, this.colActual);
	}

	rotar() {
		const rotada = this.rotarPieza(this.pieza);
		this.borrarPieza(this.pieza, this.filaActual, this.colActual);
		if (this.puedeColocar(rotada, this.filaActual, this.colActual)) {
			this.pieza = rotada;
		}
		this.colocarPieza(this.pieza, this.filaActual, this.colActual);
	}

	soltar() {
		this.borrarPieza(this.pieza, this.filaActual, this.colActual);
		while (this.puedeMover(this.pieza, this.filaActual + 1, this.colActual)) {
			this.filaActual++;
		}
		this.colocarPieza(this.pieza, this.filaActual, this.colActual);
		this.piezaFijada = true; // Ya no se puede mover
	}

	guardarPieza() {
		if (!this.puedeGuardar) return; // bloqueo guardado repetido
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
		this.puedeGuardar = false; // bloqueo hasta nueva pieza
	}

	reiniciar() {
		this.matriz = this.crearMatrizVacia();
		this.puntaje = 0;
		this.colaProximas = [new Pieza(), new Pieza(), new Pieza(), new Pieza()];
		this.piezaActual = null;
		this.piezaGuardada = null;
		this.puedeGuardar = true;
		this.filaActual = 0;
		this.colActual = 3;
	}
}

