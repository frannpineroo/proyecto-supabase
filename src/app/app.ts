import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  // 1.EL HTML 
  template: `
    <div class="main-container">
      <h1>Lista de Precios (Prueba)</h1>
      <p>Datos mockeados para probar el Front-End.</p>

      <table class="tabla-precios">
        <thead>
          <tr>
            <th>Producto / Servicio</th>
            <th>Detalle</th>
            <th>Precio (ARS)</th>
          </tr>
        </thead>
        <tbody>
          @for (item of productos; track item.nombre) {
            <tr>
              <td>{{ item.nombre }}</td>
              <td>{{ item.detalle }}</td>
              <td class="precio">\${{ item.precio }}</td>
            </tr>
          } @empty {
            <tr><td colspan="3">No hay datos.</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
  // 2.EL CSS 
  styles: [`
    .main-container {
      font-family: sans-serif;
      max-width: 800px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 8px;
    }
    h1 { color: #333; text-align: center; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
    th { background-color: #007bff; color: white; }
    .precio { font-weight: bold; color: green; text-align: right; }
  `]
})
export class App {
  // 3.LA LÓGICA ( datos falsos)
  productos = [
    { nombre: 'Mantenimiento Web', precio: 15000, detalle: 'Mensual' },
    { nombre: 'Landing Page', precio: 45000, detalle: 'Pago único' },
    { nombre: 'Catálogo Digital', precio: 60000, detalle: 'Conexión a Sheets' },
    { nombre: 'Hosting', precio: 25000, detalle: 'Anual' },
    { nombre: 'Soporte', precio: 5000, detalle: 'Por hora' }
  ];
}