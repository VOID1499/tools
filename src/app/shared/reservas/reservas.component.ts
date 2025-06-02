import { CommonModule, UpperCasePipe } from '@angular/common';
import { Component ,ElementRef,inject,input,Input, OnInit, ViewChild} from '@angular/core';
import moment from 'moment';
import { Reserva } from '../../interfaces/reserva.interface';
import { ReservasGymService } from '../../services/api/reservas-gym.service';
import { PostgrestResponse } from '../../interfaces/supabaseResponse.interface';
import { DateToMomentFormatPipe } from '../../pipes/date-to-moment-format.pipe';
import { ActivatedRoute } from '@angular/router';
import { concatMap } from 'rxjs';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-reservas',
  imports: [CommonModule,DateToMomentFormatPipe,UpperCasePipe,ReactiveFormsModule,ModalComponent],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.css'
})
export class ReservasComponent implements OnInit {
  
  @ViewChild("elemento") elemento!:ElementRef;
  mouseDownClick = false;
  lastRecordClickMove = 0;
  nativeElement!:HTMLElement; 

  fecha:string = moment().format("YYYY-MM-DD")
  reservas:Partial<Reserva>[] | null = [];
  pixelesPorHora = 100;
  widthTotal = this.pixelesPorHora * 24;
  hours = Array.from({ length: 24 }, (_, i) => i);

  private _reservasGymService:ReservasGymService = inject(ReservasGymService);
  private route:ActivatedRoute = inject(ActivatedRoute);
  private fb:FormBuilder = inject(FormBuilder);

  reservaForm = this.fb.nonNullable.group({
    nombre:["",[Validators.required,Validators.minLength(1),Validators.maxLength(255)]],
    departamento:["",[Validators.required,Validators.minLength(1),Validators.maxLength(4),Validators.pattern('^[A-Za-z][0-9]{0,3}$')]],
    fecha:[this.fecha,[Validators.required]],
    hora_inicio:["12:00",[Validators.required]],
    hora_fin:[{value:"",disabled:true},[Validators.required]],
  })

  constructor(){

  }

  
  ngOnInit(): void {
      let x = this.reservaForm.controls.hora_inicio.value
      const hora_fin = this.addTime(x)
      this.reservaForm.controls.hora_fin.setValue(hora_fin);

      this.route.paramMap.pipe(
      concatMap(params => {
        const fechaParam = params.get('fecha')!;
        if(fechaParam){
          this.fecha = fechaParam;
        }
        return this.getReservas()
      })
    ).subscribe({
        next:(response:PostgrestResponse<Reserva>)=>{
          this.reservas = response.data;
        },
        error:(error)=>{
          console.log(error)
        }
      }) 
    }

  ngAfterViewInit() {
    this.nativeElement = this.elemento.nativeElement;;
    this.reservaForm.controls.hora_inicio.valueChanges.subscribe(valor => {
      let hora_fin = this.addTime(valor);
      this.reservaForm.controls.hora_fin.setValue(hora_fin);
  });
  }
  
 
verificarMaximoDeReservas(nuevaReserva: { hora_inicio: string, hora_fin: string }): boolean {
  const inicioNueva = moment(nuevaReserva.hora_inicio, 'HH:mm');
  const finNueva = moment(nuevaReserva.hora_fin, 'HH:mm');

  // Contar reservas que se solapan con la nueva
  const reservasSolapadas = this.reservas?.filter((reserva) => {
    const inicioExistente = moment(reserva.hora_inicio, 'HH:mm');
    const finExistente = moment(reserva.hora_fin, 'HH:mm');

    // Verifica si hay intersección de horarios
    return inicioNueva.isBefore(finExistente) && inicioExistente.isBefore(finNueva);
  }) || [];

  // Si ya hay 3 o más reservas, rechazar
  return reservasSolapadas.length <= 3;
}

 seSolapan(inicioA: string, finA: string, inicioB: string, finB: string): boolean {
  const aInicio = moment(inicioA, 'HH:mm');
  const aFin = moment(finA, 'HH:mm');
  const bInicio = moment(inicioB, 'HH:mm');
  const bFin = moment(finB, 'HH:mm');

  return aInicio.isBefore(bFin) && bInicio.isBefore(aFin);
  }  

  // Asumimos 100px por hora
  getLeft(hora: string): number {
    const [h, m] = hora.split(':').map(Number);
    return h * this.pixelesPorHora + (m / 60) * this.pixelesPorHora;
  }

  getWidth(inicio: string, fin: string): number {
    const [h1, m1] = inicio.split(':').map(Number);
    const [h2, m2] = fin.split(':').map(Number);
    const duracionHoras = (h2 + m2 / 60) - (h1 + m1 / 60);
    return duracionHoras * this.pixelesPorHora;
  }


  getReservas(){
    return this._reservasGymService.obtenerReservas(this.fecha);
  }

  addReserva(){
    if(this.verificarMaximoDeReservas({hora_inicio:"14:30",hora_fin:"15:30"})){
      this._reservasGymService.crearReserva().subscribe({
        next:(response:PostgrestResponse<Reserva>)=>{
          this.reservas?.push(...response.data!)
        },
        error(error){
          console.log(error)
        }
      })
    }else{
      console.log("Maximo de reservas en ese horario")
    }
  }


  addTime(time:string,horas:number = this._reservasGymService.horaPorPersona,minutos:number = this._reservasGymService.tiempoExtra):string{
     return moment(time, "HH:mm") // ← se especifica el formato de entrada
    .add(horas, "hours")
    .add(minutos, "minutes")
    .format("HH:mm");
  }

  onSubmit(){
    if(this.reservaForm.valid && this.verificarMaximoDeReservas({hora_inicio:this.getHoraInicioControl.value,hora_fin:this.getHoraFinControl.value})){
      this.addReserva();
    }else{
      console.log("error fatal")
    }
  }


  get getNombreControl():FormControl{
    return this.reservaForm.controls.nombre;
  }

   get getDepartamentoControl():FormControl{
    return this.reservaForm.controls.departamento;
  }

   get getFechaControl():FormControl{
    return this.reservaForm.controls.fecha;
  }

   get getHoraInicioControl():FormControl{
    return this.reservaForm.controls.hora_inicio;
  }
  

   get getHoraFinControl():FormControl{
    return this.reservaForm.controls.hora_fin;
  }
 
  /////////////////////////////
  mouseDown(e:MouseEvent){
    e.preventDefault();     
    e.stopPropagation(); 
   this.mouseDownClick = true;
   let xclient = e.clientX
   this.lastRecordClickMove = xclient;
  }

  mouseUp(e:MouseEvent){
    e.preventDefault();     
    e.stopPropagation(); 
    this.mouseDownClick = false;
  }

  mouseLeave(e:MouseEvent){
    this.mouseDownClick = false;
  }

  mouseMove(e:MouseEvent){
   let target = e.target as HTMLElement;
   let xclient = e.clientX
    if(this.mouseDownClick){
      if(xclient > this.lastRecordClickMove){
        this.nativeElement.scrollLeft -=10
      }else{
        this.nativeElement.scrollLeft +=10
      }
    }
    this.lastRecordClickMove = xclient;
  }

  
  
}
