import { inject, Injectable, input } from '@angular/core';
import { AuthService } from './auth.service';
import { SupabaseClient } from '@supabase/supabase-js';
import { from, Observable,defer ,map, Subject} from 'rxjs';
import { Reserva } from '../../interfaces/reserva.interface';
import { PostgrestResponse } from '../../interfaces/supabaseResponse.interface';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ReservasGymService {

  public maximoPersonas = 3;
  public horaPorPersona = 1; //hora
  public tiempoExtra = 0; //min  
  private _authService:AuthService = inject(AuthService);
  private supabase!:SupabaseClient;

  private changesDataReservas = new Subject<any>();
  public changesDataReservas$ = this.changesDataReservas.asObservable();

  constructor() { 
    this._authService.supabase$.subscribe({
      next:(supabaseClient:SupabaseClient)=>{
        this.supabase = supabaseClient;
        this.supbaseSubscripcion();
      }
      })
  }


supbaseSubscripcion(){
  this.supabase
      .channel('realtime-reservas')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reservas',
        },
        (payload) => {
          this.changesDataReservas.next(payload);
        }
      )
      .subscribe((status) => {
        console.log('Real time reservas', status);
      });
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

crearReserva(reserva:Reserva[]){
  return from(
    this.supabase.from("reservas").insert(reserva)
    .select()
  ).pipe(map((response:PostgrestResponse<Reserva>)=>{
      if(response.error){
        throw response.error
      }
      return response
    }))
}

eliminarReserva(id:number) {
  console.log(id)
  return from(
    this.supabase
      .from("reservas")
      .delete()
      .eq("id", id)
      .select() // <-- esto hace que te devuelva la(s) fila(s) eliminadas
  ).pipe(
    map((response: PostgrestResponse<Reserva>) => {
      if (response.error) {
        throw response.error;
      }

      if (response.data!.length === 0) {
        throw new Error("No se encontró ninguna reserva con ese ID.");
      }

      return response;
    })
  );
}

  


}
