import { FORMAS } from './Formas.js';

export class Pieza {
  constructor(velocidad) {
    this.velocidad = velocidad;
    const claves = Object.keys(FORMAS);
    const aleatoria = claves[Math.floor(Math.random() * claves.length)];
    this.tipo = aleatoria;
    this.forma = FORMAS[aleatoria];
  }
}
