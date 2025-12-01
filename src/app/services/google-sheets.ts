import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleSheetsService {

  // TU API KEY
  private API_KEY = 'AIzaSyBQkW44PSzjOIZj-CKw0rjEJ2nVBnXxY2w';
  
  // TU ID DE SHEET
  private SHEET_ID = '1snS1cXbELD9Mc2wrbDfbeollENnVbETfsUXKW7vhzH4';

  // Rango de columnas a leer (A y B)
  private RANGE = 'A:B';

  constructor() {}

  async conectarYLeer() {
    try {
      console.log('⚡ Conectando a API...');
      
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/${this.RANGE}?key=${this.API_KEY}`;
      
      const respuesta = await fetch(url);
      const resultado = await respuesta.json();

      if (resultado.error) {
        console.error('❌ Error API:', resultado.error.message);
        return null;
      }

      const filas = resultado.values;

      if (!filas || filas.length === 0) return [];

      return this.transformarDatos(filas);

    } catch (error) {
      console.error('❌ Error conexión:', error);
      return null;
    }
  }

  // --- LÓGICA DE LIMPIEZA (FILTRA HUECOS VACÍOS) ---
  private transformarDatos(filas: any[]) {
    const headers = filas[0]; // La primera fila son los títulos
    const datos = [];

    // Empezamos desde la fila 1 (datos), saltando la 0 (títulos)
    for (let i = 1; i < filas.length; i++) {
      const filaActual = filas[i];
      const obj: any = {};

      // 1. Si la fila no existe o es null, la saltamos
      if (!filaActual) continue;

      // 2. FILTRO: Si la fila existe pero todas sus celdas están vacías, la saltamos
      // Esto arregla el problema de los huecos en blanco al borrar.
      const estaVacia = filaActual.length === 0 || filaActual.every((celda: any) => !celda || celda.toString().trim() === '');
      
      if (estaVacia) continue;

      // Si pasamos los filtros, mapeamos los datos
      headers.forEach((header: string, index: number) => {
        obj[header] = filaActual[index] || '';
      });

      datos.push(obj);
    }
    return datos;
  }
}