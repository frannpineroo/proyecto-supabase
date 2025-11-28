import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleSheetsService } from './services/google-sheets';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="main-container">

      <div class="actions-container">
        
        <button (click)="cargarDatos()" class="btn btn-recarga" [disabled]="cargando">
          {{ cargando ? '⏳' : ' Recargar' }}
        </button>

        <a [href]="sheetUrl" target="_blank" class="btn btn-sheet">
           Editar Excel
        </a>

      </div>

      <h1>Lista de Precios</h1>

      <div *ngIf="cargando" class="mensaje-centro">
        <p>⏳ Actualizando catálogo...</p>
      </div>

      <table class="tabla-precios" *ngIf="!cargando && listaProductos.length > 0">
        <thead>
          <tr>
            <th *ngFor="let col of columnas">{{ col }}</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of listaProductos">
            <td *ngFor="let col of columnas">
              <span [class.precio-valor]="esPrecio(item[col])">
                {{ item[col] }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="!cargando && listaProductos.length === 0" class="mensaje-centro">
        <p>❌ No se encontraron datos. Verifica el Excel.</p>
      </div>

      <div class="debug-zone">
        Items cargados: {{ listaProductos.length }}
      </div>

    </div>
  `,
  styles: [`
    .main-container { font-family: 'Segoe UI', sans-serif; max-width: 800px; margin: 30px auto; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
    h1 { text-align: center; color: #2c3e50; margin-top: 10px; }
    
    /* CONTENEDOR DE BOTONES */
    .actions-container { 
      display: flex; 
      justify-content: center; 
      gap: 20px; 
      padding: 20px; 
      background: #f8f9fa; 
      border-bottom: 2px solid #e9ecef;
      margin-bottom: 20px;
      border-radius: 8px 8px 0 0;
    }
    
    .btn { padding: 10px 20px; color: white; border: none; cursor: pointer; border-radius: 50px; font-weight: bold; text-decoration: none; display: flex; align-items: center; transition: transform 0.2s; font-size: 14px; }
    .btn:hover { transform: translateY(-2px); opacity: 0.9; }
    .btn:active { transform: translateY(0); }
    
    .btn-recarga { background: #3498db; }
    .btn-recarga:disabled { background: #bdc3c7; cursor: wait; }
    .btn-sheet { background: #27ae60; }
    
    /* TABLA */
    .tabla-precios { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .tabla-precios th { background: #2c3e50; color: white; padding: 12px; text-align: left; text-transform: uppercase; font-size: 0.9em; }
    .tabla-precios td { border-bottom: 1px solid #eee; padding: 12px; color: #555; }
    .tabla-precios tr:hover { background-color: #f1f1f1; }
    
    .precio-valor { color: #27ae60; font-weight: bold; }
    
    .mensaje-centro { text-align: center; padding: 30px; font-size: 1.1em; color: #7f8c8d; font-style: italic; }
    .debug-zone { margin-top: 30px; font-size: 11px; color: #aaa; text-align: center; border-top: 1px solid #eee; padding-top: 10px; }
  `]
})
export class App implements OnInit {
  
  // URL del Editor de Google Sheets (para el botón verde)
  sheetUrl = 'https://docs.google.com/spreadsheets/d/1snS1cXbELD9Mc2wrbDfbeollENnVbETfsUXKW7vhzH4/edit';

  listaProductos: any[] = [];
  columnas: string[] = [];
  cargando = true;

  constructor(
    private sheetsService: GoogleSheetsService,
    private cd: ChangeDetectorRef 
  ) {}

  /**
   * Ciclo de vida inicial:
   * Verificamos si estamos en el navegador (window definido) para iniciar la carga.
   */
  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.cargarDatos();
    }
  }

  /**
   * Llama al servicio para obtener los datos del CSV público.
   * Gestiona el estado de carga (loading) y actualiza la vista manualmente.
   */
  async cargarDatos() {
    this.cargando = true;
    
    // Llamada asíncrona al servicio
    const datosRaw = await this.sheetsService.conectarYLeer();

    if (datosRaw && datosRaw.length > 0) {
      // Normalizamos datos para corregir cabeceras erróneas del CSV
      this.listaProductos = this.normalizarDatos(datosRaw);
      
      // Si tenemos productos, extraemos las columnas dinámicamente
      if (this.listaProductos.length > 0) {
        this.columnas = Object.keys(this.listaProductos[0]);
      }
    } else {
      this.listaProductos = [];
    }

    this.cargando = false;
    this.cd.detectChanges(); // Forzamos actualización de la UI
  }

  /**
   * Corrige el problema de exportación de Google Sheets donde las cabeceras
   * aparecen como datos en la fila 1 y las claves son genéricas (A, B, C...).
   */
  normalizarDatos(datos: any[]): any[] {
    const filaTitulos = datos[0]; 
    const mapaColumnas: any = {};

    // Mapeamos letras (A, B) a nombres reales (Producto, Precio)
    Object.keys(filaTitulos).forEach(key => {
      if (filaTitulos[key] && key !== "") {
        mapaColumnas[key] = filaTitulos[key]; 
      }
    });

    const datosLimpios = [];
    
    // Reconstruimos el array de objetos con las claves correctas
    for (let i = 1; i < datos.length; i++) {
      const filaNueva: any = {};
      let tieneDatos = false;

      Object.keys(mapaColumnas).forEach(keyLetra => {
        const valor = datos[i][keyLetra];
        if (valor) { 
          filaNueva[mapaColumnas[keyLetra]] = valor; 
          tieneDatos = true; 
        }
      });

      if (tieneDatos) datosLimpios.push(filaNueva);
    }
    return datosLimpios;
  }

  /**
   * Utilidad visual: Detecta si un valor es un precio (contiene $) o es número
   * para aplicarle estilos destacados.
   */
  esPrecio(valor: any): boolean {
    return String(valor).includes('$') || !isNaN(Number(valor));
  }
}