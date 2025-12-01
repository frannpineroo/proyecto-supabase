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
          {{ cargando ? '⚡' : '🔄 Recargar (API)' }}
        </button>

        <a [href]="sheetUrl" target="_blank" class="btn btn-sheet">
          📝 Editar Excel
        </a>
      </div>

      <h1>Lista de Precios</h1>

      <div *ngIf="cargando" class="mensaje-centro">
        <p>⚡ Actualizando...</p>
      </div>

      <table class="tabla-precios" *ngIf="!cargando && listaProductos.length > 0">
        <thead>
          <tr>
            <th class="col-index">#</th>
            
            <th *ngFor="let col of columnas">{{ col }}</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of listaProductos; let i = index">
            
            <td class="col-index numero-fila">{{ i + 1 }}</td>

            <td *ngFor="let col of columnas">
              <span [class.precio-valor]="esPrecio(item[col])">
                {{ item[col] }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="!cargando && listaProductos.length === 0" class="mensaje-centro">
        <p>❌ No hay datos. Revisa el Excel.</p>
      </div>

    </div>
  `,
  styles: [`
    .main-container { font-family: 'Segoe UI', sans-serif; max-width: 800px; margin: 30px auto; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
    h1 { text-align: center; color: #2c3e50; margin-top: 10px; }
    
    .actions-container { display: flex; justify-content: center; gap: 20px; padding: 20px; background: #f8f9fa; border-bottom: 2px solid #e9ecef; margin-bottom: 20px; border-radius: 8px 8px 0 0; }
    
    .btn { padding: 10px 20px; color: white; border: none; cursor: pointer; border-radius: 50px; font-weight: bold; text-decoration: none; font-size: 14px; display: flex; align-items: center; transition: 0.2s; }
    .btn:hover { transform: translateY(-2px); opacity: 0.9; }
    .btn-recarga { background: #8e44ad; }
    .btn-recarga:disabled { background: #bdc3c7; cursor: wait; }
    .btn-sheet { background: #27ae60; }
    
    .tabla-precios { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .tabla-precios th { background: #2c3e50; color: white; padding: 12px; text-align: left; text-transform: uppercase; font-size: 0.9em; }
    .tabla-precios td { border-bottom: 1px solid #eee; padding: 12px; color: #555; }
    
    /* ESTILOS NUEVOS PARA LA COLUMNA ÍNDICE */
    .col-index { width: 50px; text-align: center !important; color: #95a5a6; font-weight: bold; }
    .numero-fila { background-color: #fcfcfc; font-size: 0.9em; }

    .precio-valor { color: #27ae60; font-weight: bold; }
    .mensaje-centro { text-align: center; padding: 30px; font-size: 1.1em; color: #7f8c8d; }
  `]
})
export class App implements OnInit {
  
  sheetUrl = 'https://docs.google.com/spreadsheets/d/1snS1cXbELD9Mc2wrbDfbeollENnVbETfsUXKW7vhzH4/edit';
  listaProductos: any[] = [];
  columnas: string[] = [];
  cargando = true;

  constructor(
    private sheetsService: GoogleSheetsService,
    private cd: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.cargarDatos();
    }
  }

  async cargarDatos() {
    this.cargando = true;
    const datosApi = await this.sheetsService.conectarYLeer();

    if (datosApi && datosApi.length > 0) {
      this.listaProductos = datosApi;
      this.columnas = Object.keys(this.listaProductos[0]);
    } else {
      this.listaProductos = [];
    }

    this.cargando = false;
    this.cd.detectChanges();
  }

  esPrecio(valor: any): boolean {
    return String(valor).includes('$') || !isNaN(Number(valor));
  }
}