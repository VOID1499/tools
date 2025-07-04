import { ReservasGymService } from "../../services/api/reservas-gym.service";

// reservas-gym.service.mock.ts
import { of, Subject } from 'rxjs';
import { PostgrestResponse } from '../../interfaces/supabaseResponse.interface';
import { Reserva } from '../../interfaces/reserva.interface';
import { configuracionReservas } from '../../interfaces/reservasConfiguracion';


export const reservasFixture:Reserva[] = [
     {
  id: 1,
  nombre: 'erick',
  departamento: 'b55',
  fecha: '2024-01-01',
  hora_inicio: '12:00',
  hora_fin: '13:30',
}
]

export const reservasFixture2:Reserva[] = [
     {
  id: 1,
  nombre: 'erick',
  departamento: 'b55',
  fecha: '2024-01-01',
  hora_inicio: '12:00',
  hora_fin: '13:30',
},
     {
  id: 2,
  nombre: 'erick',
  departamento: 'b55',
  fecha: '2024-01-01',
  hora_inicio: '12:00',
  hora_fin: '13:30',
},
     {
  id: 3,
  nombre: 'erick',
  departamento: 'b55',
  fecha: '2024-01-01',
  hora_inicio: '18:00',
  hora_fin: '19:30',
}
]

export class MockReservasGymService {
  public configuracionReservas: configuracionReservas = {
    horasPorPersona: "01:30",
    maximoPersonas: 3,
  };

  private _changesDataReservas = new Subject<any>();
  public changesDataReservas$ = this._changesDataReservas.asObservable();

  supbaseSubscripcion = jest.fn();

  obtenerReservas = jest.fn((fecha: string) => {
    const mockResponse: PostgrestResponse<Reserva> = {
      data: reservasFixture2,
      error: null,
      count: null,
      status: 200,
      statusText: "OK"
    };
    return of(mockResponse);
  });

  crearReserva = jest.fn((reserva: Reserva[]) => {
    const mockResponse: PostgrestResponse<Reserva> = {
      data: reserva,
      error: null,
      count: null,
      status: 201,
      statusText: "Created"
    };
    return of(mockResponse);
  });

  eliminarReserva = jest.fn((id: number) => {
    const mockResponse: PostgrestResponse<Reserva> = {
      data: reservasFixture,
      error: null,
      count: null,
      status: 200,
      statusText: "OK"
    };
    return of(mockResponse);
  });
}
