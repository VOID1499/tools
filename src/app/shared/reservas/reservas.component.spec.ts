import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservasComponent } from './reservas.component';
import { provideRouter } from '@angular/router';
import { ReservasGymService } from '../../services/api/reservas-gym.service';
import { HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import { MockReservasGymService, reservasFixture, reservasFixture2 } from '../../mocks/services/reservas-gym-mock.service';
import { of } from 'rxjs';
import moment from 'moment';

describe('ReservasComponent', () => {
  let component: ReservasComponent;
  let fixture: ComponentFixture<ReservasComponent>;
  let httpTestingController: HttpTestingController;
  let mockReservasGymService:ReservasGymService;

  beforeEach(async () => {
     await TestBed.configureTestingModule({
    imports: [ReservasComponent, HttpClientTestingModule],
    providers: [
      provideRouter([]),
      { provide: ReservasGymService, useClass: MockReservasGymService }
    ]
  }).compileComponents();

  fixture = TestBed.createComponent(ReservasComponent);
  component = fixture.componentInstance;
  httpTestingController = TestBed.inject(HttpTestingController);
  mockReservasGymService = TestBed.inject(ReservasGymService); // ← CORRECTO

  jest.clearAllMocks();
  });



  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it("debería asignar los datos de las request a los datos de reservas", () => {
    const spy = jest.spyOn(component, 'getReservas');
    const spyRequest = jest.spyOn(mockReservasGymService,"obtenerReservas");
    fixture.detectChanges(); // llama ngOnInit()
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyRequest).toHaveBeenCalledTimes(1);
    expect(component.reservas).toEqual(reservasFixture2)
  });

  it("deberia llamar al metodo resetForm() almenos una vez",()=>{
    const spy = jest.spyOn(component,"resetForm");
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  })

      

  it('debería calcular el rango entre hora inicio y fin en la funcion addTime', () => {
    const getHoraInicioSpy = jest.spyOn(component, 'getHoraInicioControl', 'get');
    const addTimeSpy = jest.spyOn(component, 'addTime');
    const resetSpy = jest.spyOn(component.reservaForm, 'reset');

    component.resetForm();

    expect(getHoraInicioSpy).toHaveBeenCalled();
    expect(addTimeSpy).toHaveBeenCalled();
    expect(resetSpy).toHaveBeenCalled();
    });

  
 
  describe("addTime function",()=>{

    it("debería sumar correctamente minutos sin horas", () => {
        const result = component.addTime("10:30", "00:45");
        expect(result).toBe("11:15");
    });
  
    it("debería manejar correctamente sumas que cruzan la hora", () => {
        const result = component.addTime("23:45", "00:30");
        expect(result).toBe("00:15");
    });
  })


  describe("verificarDisponibilidad function",()=>{
    
       
    it('debería retornar false', (done) => {
      component.reservaForm.controls.hora_inicio.setValue("13:00");
      component.reservaForm.controls.hora_fin.setValue("14:30");
      component.reservaForm.controls.fecha.setValue("2024-01-01");
      component.reservaForm.controls.reservas_deseadas.setValue(2);
      const spy = jest.spyOn(mockReservasGymService, 'obtenerReservas');
      
      // Ejecuta y evalúa
      component.verificarDisponibilidad().subscribe((disponible) => {
          expect(disponible).toEqual(false);
          expect(spy).toHaveBeenCalledTimes(1);
          done();
        });
      
      });
    
    it('debería retornar true', (done) => {
      component.reservaForm.controls.hora_inicio.setValue("13:00");
      component.reservaForm.controls.hora_fin.setValue("14:30");
      component.reservaForm.controls.fecha.setValue("2024-01-01");
      component.reservaForm.controls.reservas_deseadas.setValue(1);
      const spy = jest.spyOn(mockReservasGymService, 'obtenerReservas');
      
      // Ejecuta y evalúa
      component.verificarDisponibilidad().subscribe((disponible) => {
          expect(disponible).toEqual(true);
          expect(spy).toHaveBeenCalledTimes(1);
          done();
        });
      
    });  

    it('debería retornar true ', (done) => { 
      component.reservaForm.controls.hora_inicio.setValue("16:00");
      component.reservaForm.controls.hora_fin.setValue("17:30");
      component.reservaForm.controls.fecha.setValue("2024-01-01");
      component.reservaForm.controls.reservas_deseadas.setValue(3);
      const spy = jest.spyOn(mockReservasGymService, 'obtenerReservas');
      
      // Ejecuta y evalúa
      component.verificarDisponibilidad().subscribe((disponible) => {
          expect(disponible).toEqual(true);
          expect(spy).toHaveBeenCalledTimes(1);
          done();
        });
      
    });

    
  })
  





});
