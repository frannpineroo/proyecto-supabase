import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Supabase } from './services/supabase';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  // 1.EL HTML 
  template: `
    <div class="main-container">
      <h1>Lista de Precios</h1>
      
      @if (loading) {
        <p>Cargando productos...</p>
      } @else {
        <p>Datos en tiempo real desde Supabase</p>
      }

      <table class="tabla-precios">
        <thead>
          <tr>
            <th>Producto / Servicio</th>
            <th>Detalle</th>
            <th>Precio (ARS)</th>
          </tr>
        </thead>
        <tbody>
          @for (item of productos; track item.id) {
            <tr>
              <td>{{ item.nombre }}</td>
              <td>{{ item.detalle }}</td>
              <td class="precio">\${{ item.precio }}</td>
            </tr>
          } @empty {
            <tr><td colspan="3">No hay productos disponibles.</td></tr>
          }
        </tbody>
      </table>

      @if (error) {
        <p class="error">{{ error }}</p>
      }
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
    .error { color: red; text-align: center; margin-top: 10px; }
  `]
})
export class App implements OnInit {
  // 3.LA LÓGICA (ahora conectada a Supabase)
  productos: any[] = [];
  loading = true;
  error = '';

  constructor(private supabase: Supabase) {}

  async ngOnInit() {
    await this.cargarProductos();
  }

  async cargarProductos() {
    try {
      this.loading = true;
      this.productos = await this.supabase.getProductos();
      this.error = '';
    } catch (error: any) {
      console.error('Error cargando productos:', error);
      this.error = 'Error al cargar los productos. Verifica la conexión a Supabase.';
    } finally {
      this.loading = false;
    }
  }
}