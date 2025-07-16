import { inject, Injectable, input } from '@angular/core';
import { AuthService } from './auth.service';
import { SupabaseClient } from '@supabase/supabase-js';
import { from, Observable,defer ,map, Subject,catchError,forkJoin,of} from 'rxjs';
import { Reserva } from '../../interfaces/reserva.interface';
import { PostgrestResponse } from '../../interfaces/supabaseResponse.interface';
import { FormBuilder } from '@angular/forms';
import { configuracionReservas} from '../../interfaces/reservasConfiguracion';

@Injectable({
  providedIn: 'root'
})
export class ReservasGymService {

  public configuracionReservas:configuracionReservas = {
    horasPorPersona:"01:00",
    maximoPersonas:3,
  }
  private authService:AuthService = inject(AuthService);
  private supabaseClient:SupabaseClient = this.authService.client;

  private changesDataReservas = new Subject<any>();
  public changesDataReservas$ = this.changesDataReservas.asObservable();

  constructor() { 
  const config = localStorage.getItem("reservas_config");
  if (config && typeof(config)) {
    this.configuracionReservas = JSON.parse(config);
  } else {
    localStorage.setItem("reservas_config", JSON.stringify(this.configuracionReservas));
  }

    this.supbaseSubscripcion();
  }


supbaseSubscripcion(){
  this.supabaseClient
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
    this.supabaseClient.rpc("obtener_reservas",{fecha_param:fecha})
  ).pipe(
    map((response:PostgrestResponse<Reserva>)=>{
      if(response.error){
        throw response.error
      }
      return response
    })
  )
}

crearReservas(reservas: Reserva[]) {
  const llamadas = reservas.map((reserva, index) =>
    from(
      this.supabaseClient.rpc("crear_reserva", {
        departamento: reserva.departamento,
        fecha: reserva.fecha,
        hora_fin: reserva.hora_fin,
        hora_inicio: reserva.hora_inicio,
        nombre: reserva.nombre,
        usuario_id: null,
      })
    ).pipe(
      map((response: PostgrestResponse<Reserva>) => { // mapeando solo una request
        if (response.error) {
          throw response.error;
        }
        return response;
      }),
      catchError(error => {
        // Manejo de error individual
        return of(error);
      })
    )
  );

  return forkJoin(llamadas); // retorna un array con resultados de todas
}


eliminarReserva(id:number) {
  console.log(id)
  return from(
    this.supabaseClient
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
