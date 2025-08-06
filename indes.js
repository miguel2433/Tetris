import { Pieza } from "./Pieza.js";
import { COLORES } from "./Colores.js";

const contenedorTetris = document.getElementById("tetris-grid");

const FILAS = 20;
const COLUMNAS = 10;

for (let i = 0; i < FILAS * COLUMNAS; i++) {
  const cell = document.createElement('div');
  cell.className = 'cell';
  contenedorTetris.appendChild(cell);
}

const tablero = Array.from({ length: FILAS }, () => Array(COLUMNAS).fill(0));

// ========== FUNCIONES DE LÓGICA ==========
function colocarPiezaEnTablero(tablero, pieza, tipo, filaPos, colPos) {
  for (let fila = 0; fila < pieza.length; fila++) {
    for (let col = 0; col < pieza[fila].length; col++) {
      if (pieza[fila][col] !== 0) {
        const tableroFila = filaPos + fila;
        const tableroCol = colPos + col;
        if (
          tableroFila >= 0 &&
          tableroFila < FILAS &&
          tableroCol >= 0 &&
          tableroCol < COLUMNAS
        ) {
          tablero[tableroFila][tableroCol] = pieza[fila][col];
        }
      }
    }
  }
}

function borrarPiezaDelTablero(tablero, pieza, filaPos, colPos) {
  for (let fila = 0; fila < pieza.length; fila++) {
    for (let col = 0; col < pieza[fila].length; col++) {
      if (pieza[fila][col] !== 0) {
        const tableroFila = filaPos + fila;
        const tableroCol = colPos + col;
        if (
          tableroFila >= 0 &&
          tableroFila < FILAS &&
          tableroCol >= 0 &&
          tableroCol < COLUMNAS
        ) {
          tablero[tableroFila][tableroCol] = 0;
        }
      }
    }
  }
}

function dibujarTableroVisual(tablero) {
  const cells = contenedorTetris.querySelectorAll('.cell');

  for (let fila = 0; fila < FILAS; fila++) {
    for (let col = 0; col < COLUMNAS; col++) {
      const index = fila * COLUMNAS + col;
      const celdaValor = tablero[fila][col];
      if (celdaValor !== 0) {
        cells[index].style.backgroundColor = COLORES[celdaValor];
      } else {
        cells[index].style.backgroundColor = '#222';
      }
    }
  }
}

function puedeMover(tablero, pieza, filaPos, colPos) {
  for (let fila = 0; fila < pieza.length; fila++) {
    for (let col = 0; col < pieza[fila].length; col++) {
      if (pieza[fila][col] !== 0) {
        const nuevaFila = filaPos + fila;
        const nuevaCol = colPos + col;

        if (
          nuevaFila >= FILAS ||
          nuevaCol < 0 ||
          nuevaCol >= COLUMNAS ||
          tablero[nuevaFila][nuevaCol] !== 0
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

function rotarPieza(matriz) {
  const N = matriz.length;
  const nueva = Array.from({ length: N }, () => Array(N).fill(0));

  for (let fila = 0; fila < N; fila++) {
    for (let col = 0; col < N; col++) {
      nueva[col][N - 1 - fila] = matriz[fila][col];
    }
  }
  return nueva;
}

let puntaje = 0;

function limpiarFilasCompletas() {
  for (let fila = FILAS - 1; fila >= 0; fila--) {
    if (tablero[fila].every(celda => celda !== 0)) {
      tablero.splice(fila, 1);
      tablero.unshift(Array(COLUMNAS).fill(0));
      puntaje += 100;
      fila++; // revisar de nuevo
    }
  }

  document.getElementById("puntaje").innerText = `Puntaje: ${puntaje}`;
}

// ========== VARIABLES DE ESTADO ==========
let piezaActual = null;
let pieza = null;
let tipo = null;
let filaActual = 0;
let colActual = 3;
let intervalo = null;

// ========== FUNCIONES DEL JUEGO ==========
function generarNuevaPieza() {
  piezaActual = new Pieza(500);
  pieza = piezaActual.forma;
  tipo = piezaActual.tipo;
  filaActual = 0;
  colActual = 3;

  if (!puedeMover(tablero, pieza, filaActual, colActual)) {
    console.log("¡Game Over!");
    clearInterval(intervalo);
    return;
  }

  colocarPiezaEnTablero(tablero, pieza, tipo, filaActual, colActual);
  dibujarTableroVisual(tablero);
}

function bajarPieza() {
  borrarPiezaDelTablero(tablero, pieza, filaActual, colActual);

  if (puedeMover(tablero, pieza, filaActual + 1, colActual)) {
    filaActual++;
  } else {
    colocarPiezaEnTablero(tablero, pieza, tipo, filaActual, colActual);
    limpiarFilasCompletas();
    dibujarTableroVisual(tablero);
    generarNuevaPieza();
    return;
  }

  colocarPiezaEnTablero(tablero, pieza, tipo, filaActual, colActual);
  dibujarTableroVisual(tablero);
}

function puedeColocar(tablero, pieza, filaPos, colPos) {
  for (let fila = 0; fila < pieza.length; fila++) {
    for (let col = 0; col < pieza[fila].length; col++) {
      if (pieza[fila][col] !== 0) {
        const nuevaFila = filaPos + fila;
        const nuevaCol = colPos + col;

        if (
          nuevaFila < 0 || nuevaFila >= FILAS ||
          nuevaCol < 0 || nuevaCol >= COLUMNAS ||
          tablero[nuevaFila][nuevaCol] !== 0
        ) {
          return false;
        }
      }
    }
  }
  return true;
}


// ========== EVENTOS DE TECLADO ==========
document.addEventListener("keydown", (e) => {
  if (!pieza) return;

  borrarPiezaDelTablero(tablero, pieza, filaActual, colActual);

  if (e.key === "ArrowLeft") {
    if (puedeMover(tablero, pieza, filaActual, colActual - 1)) {
      colActual--;
    }
  } else if (e.key === "ArrowRight") {
    if (puedeMover(tablero, pieza, filaActual, colActual + 1)) {
      colActual++;
    }
  } else if (e.key === "ArrowDown") {
    if (puedeMover(tablero, pieza, filaActual + 1, colActual)) {
      filaActual++;
    }
  } else if (e.key === "ArrowUp") {
    const rotada = rotarPieza(pieza);
    if (puedeColocar(tablero, rotada, filaActual, colActual)) {
      pieza = rotada;
    }
  }else if (e.key === " ") {
    while (puedeMover(tablero, pieza, filaActual + 1, colActual)) {
      filaActual++;
    }
  }

  colocarPiezaEnTablero(tablero, pieza, tipo, filaActual, colActual);
  dibujarTableroVisual(tablero);
});


// ========== INICIAR JUEGO ==========
generarNuevaPieza();
intervalo = setInterval(bajarPieza, 500);
