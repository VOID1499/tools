import { inject, Injectable, input } from '@angular/core';
import { AuthService } from './auth.service';
import { SupabaseClient } from '@supabase/supabase-js';
import { from, Observable,defer ,map} from 'rxjs';
import { Reserva } from '../../interfaces/reserva.interface';
import { PostgrestResponse } from '../../interfaces/supabaseResponse.interface';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ReservasGymService {

  public horaPorPersona = 1; //hora
  public tiempoExtra = 5; //min  
  private _authService:AuthService = inject(AuthService);
  private supabase!:SupabaseClient;

  constructor() { 
    this._authService.supabase$.subscribe({
      next:(sup:SupabaseClient)=>{
        this.supabase = sup;
      }
      })
  }


obtenerReservas(fecha:string):Observable<PostgrestResponse<Reserva>> {
  return from(
    this.supabase.from("reservas").select("*").eq("fecha",fecha)
  ).pipe(
    map((response:PostgrestResponse<Reserva>)=>{
      if(response.error){
        throw response.error
      }
      return response
    })
  )
}

crearReserva(){

  return from(
    this.supabase.from("reservas").insert([
      {
        nombre:"erick olivares",
        departamento:"A120",    
        fecha: "2025-06-01",
        hora_inicio:"14:00:00",
        hora_fin:"15:00:00"
        }
    ])
    .select()
  ).pipe(map((response:PostgrestResponse<Reserva>)=>{
      if(response.error){
        throw response.error
      }
      return response
    }))
}

  


}
