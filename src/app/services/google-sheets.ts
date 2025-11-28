import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleSheetsService {

  // URL pública del CSV. Importante: Debe terminar en 'output=csv'.
  // Se obtiene desde: Archivo > Compartir > Publicar en la web.
  private CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT9QYmwDUT-62UvDPNCH3-RyJ8v-v3bcmNpDg15nuY76qUHj-VzmyobWOd2FOXCSWtHLleLYmRH5JLP/pub?output=csv';

  constructor() {}

  /**
   * Descarga los datos frescos desde Google Sheets.
   * Retorna una promesa con el array de objetos listo para usar.
   */
  async conectarYLeer() {
    try {
      console.log('🌍 Iniciando descarga de datos...');
      
      // Cache Busting: Agregamos un timestamp (&t=...) al final de la URL.
      // Esto obliga al navegador y a Google a entregarnos la versión más reciente
      // del archivo, evitando que cargue datos viejos de la caché.
      const urlFresca = `${this.CSV_URL}&t=${Date.now()}`;

      // Usamos fetch nativo para no depender de librerías externas pesadas
      const respuesta = await fetch(urlFresca);
      
      // Si hubo un error de red (ej: 404), lanzamos error
      if (!respuesta.ok) throw new Error('No se pudo descargar el CSV');

      const texto = await respuesta.text();

      // Procesamos el texto plano para convertirlo en JSON
      const datos = this.csvAJson(texto);

      console.log('✅ Datos procesados correctamente:', datos.length, 'filas.');
      return datos;

    } catch (error) {
      console.error('❌ Error en el servicio de Sheets:', error);
      return null;
    }
  }

  /**
   * Convierte el texto plano del CSV en un Array de Objetos JavaScript.
   * Maneja automáticamente separadores de coma (,) o punto y coma (;).
   */
  private csvAJson(csv: string) {
    const lineas = csv.split('\n');

    if (lineas.length === 0) return [];

    // Detección automática del separador:
    // Google Sheets en español/Latam suele usar ';' en lugar de ','
    const separador = lineas[0].includes(';') ? ';' : ',';
    
    // Extraemos las cabeceras (Fila 1) y limpiamos comillas si las tienen
    const headers = lineas[0].split(separador).map(h => h.trim().replace(/"/g, ''));
    const resultado = [];

    // Recorremos desde la fila 1 (datos) en adelante
    for (let i = 1; i < lineas.length; i++) {
      const lineaLimpia = lineas[i].trim();
      
      if (!lineaLimpia) continue; // Saltamos líneas vacías

      const obj: any = {};
      const lineaActual = lineaLimpia.split(separador);

      // Mapeamos cada valor con su cabecera correspondiente
      if (lineaActual.length > 0) {
        headers.forEach((header, index) => {
          // Limpieza de datos: quitamos espacios y comillas extra
          const valor = lineaActual[index]?.trim().replace(/"/g, '') || '';
          obj[header] = valor;
        });
        resultado.push(obj);
      }
    }
    return resultado;
  }
}