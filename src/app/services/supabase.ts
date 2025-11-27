import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class Supabase {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async getProductos() {
    const { data, error } = await this.supabase
    .from('productos')
    .select('*')
    .order('id', { ascending: true });

    if (error) throw error;
    return data;
  }

  async addProducto(nombre: string, precio: number) {
    const { data, error } = await this.supabase
    .from('productos')
    .insert([{ nombre, precio}]);

    if (error) throw error;
    return data;
  }

  async updateProducto(id: number, nombre: string, precio: number) {
    const { data, error } = await this.supabase
    .from('productos')
    .update({ nombre, precio })
    .eq('id', id);

    if (error) throw error;
    return data;
  }

  async deleteProducto(id: number) {
    const { data, error } = await this.supabase
    .from('productos')
    .delete()
    .eq('id', id);

    if (error) throw error;
    return data;
  }
}
