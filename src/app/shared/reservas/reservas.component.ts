import { CommonModule, UpperCasePipe } from '@angular/common';
import { Component ,ElementRef,inject,input,Input, OnInit, ViewChild} from '@angular/core';
import moment from 'moment';
import { Reserva } from '../../interfaces/reserva.interface';
import { ReservasGymService } from '../../services/api/reservas-gym.service';
import { PostgrestResponse } from '../../interfaces/supabaseResponse.interface';
import { DateToMomentFormatPipe } from '../../pipes/date-to-moment-format.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap ,map,of,Observable, mergeMap, throwError} from 'rxjs';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-reservas',
  imports: [CommonModule,DateToMomentFormatPipe,UpperCasePipe,ReactiveFormsModule,ModalComponent],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.css'
})
export class ReservasComponent implements OnInit {
  
  @ViewChild("modalReserva") modalFormReserva!:ModalComponent;
  @ViewChild("elemento") elemento!:ElementRef;
  mouseDownClick = false;
  lastRecordClickMove = 0;
  nativeElement!:HTMLElement; 
  formMessage = {
    err:true,
    message:""
  };

  fecha:string = moment().format("YYYY-MM-DD")
  reservas:Reserva[] | null = [];
  reservasSort: any[][] = [];
  pixelesPorHora = 100;
  widthTotal = this.pixelesPorHora * 24;
  hours = Array.from({ length: 24 }, (_, i) => i);

  private _reservasGymService:ReservasGymService = inject(ReservasGymService);
  private route:ActivatedRoute = inject(ActivatedRoute);
  private fb:FormBuilder = inject(FormBuilder);
  private router:Router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  public maximoPersonas = this._reservasGymService.configuracionReservas.maximoPersonas;

  reservaForm = this.fb.nonNullable.group({
    id:[{value:0,disabled:true}],
    nombre:["",[Validators.required,Validators.minLength(1),Validators.maxLength(255)]],
    departamento:["",[Validators.required,Validators.minLength(1),Validators.maxLength(4),Validators.pattern('^[A-Za-z][0-9]{0,3}$')]],
    fecha:[this.fecha,[Validators.required]],
    hora_inicio:["12:00",[Validators.required]],
    hora_fin:[{value:"",disabled:true},[Validators.required]],
    reservas_deseadas:[1,[Validators.required,Validators.min(1),Validators.max(this.maximoPersonas)]]
  })

  constructor(){

  }

  
  ngOnInit(): void {
      this._reservasGymService.changesDataReservas$.subscribe({
        next:(payload)=>{
          if(!payload.errors){
            if(payload.eventType == "DELETE"){
              console.log(payload.old.id)
            }
          }
        }
      })
      
      this.resetForm();
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
          this.reordenar();
        },
        error:(error)=>{
          console.log(error)
        }
      }) 
    }

  ngAfterViewInit() {
    this.nativeElement = this.elemento.nativeElement;
    this.reservaForm.controls.hora_inicio.valueChanges.subscribe(hora_inicio => {
      let hora_fin = this.addTime(hora_inicio);
      this.reservaForm.controls.hora_fin.setValue(hora_fin);
  });
  }
  
 
  verificarDisponibilidad():Observable<boolean> {
    const inicioNueva = moment(this.getHoraInicioControl.value, 'HH:mm');
    const finNueva = moment(this.getHoraFinValue, 'HH:mm');
  
    return this._reservasGymService.obtenerReservas(this.getFechaControl.value).pipe(
      map((response:PostgrestResponse<Reserva>)=>{
        let reservas:Reserva[] = response.data!;
        if(response.data?.length == 0){
          return true;
        }else{
            const reservasSolapadas = reservas.filter((reserva) => {
            const inicioExistente = moment(reserva.hora_inicio, 'HH:mm');
            const finExistente = moment(reserva.hora_fin, 'HH:mm');

              // Verifica si hay intersección de horarios
            return inicioNueva.isBefore(finExistente) && inicioExistente.isBefore(finNueva);
          }) || [];
          const numeroDeReservasDisponibles = this.maximoPersonas - reservasSolapadas.length;
          if(numeroDeReservasDisponibles >= this.getReservasDeseadasControl.value){
            return true
          }
          return false
        }
      })
    )
  }


  getReservas(){
    return this._reservasGymService.obtenerReservas(this.fecha);
  }


  
  intersectan(reservaUno:Reserva, reservaDos:Reserva): boolean {
    const aInicio = moment(reservaUno.hora_inicio, 'HH:mm');
    const aFin = moment(reservaUno.hora_fin, 'HH:mm');
    const bInicio = moment(reservaDos.hora_inicio, 'HH:mm');
    const bFin = moment(reservaDos.hora_fin, 'HH:mm');
    return aInicio.isBefore(bFin) && bInicio.isBefore(aFin);
  }  

  reordenar() {
    this.reservasSort = [];
    this.reservas!.forEach(reservaActual => {
      let colocada = false;
      // Intenta colocarla en una fila existente
      for (const fila of this.reservasSort) {
        const solapa = fila.some(reservaExistente =>
          this.intersectan(reservaActual, reservaExistente)
        );

        if (!solapa) {
          fila.push(reservaActual);
          colocada = true;
          break;
        }
      }

      // Si no pudo colocarse en ninguna fila existente, crea una nueva
      if (!colocada) {
        this.reservasSort.push([reservaActual]);
      }
    });

  }
  
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

  
  
  
  //metodos de formulario
  
  setformMessage({ message, error }: { message: string; error: boolean }){
   this.formMessage.message = message;
   this.formMessage.err = error;
   setTimeout(()=>{
     this.formMessage.message = "";
   },3000)
 }
  
  eliminarReserva(id:number){
    this._reservasGymService.eliminarReserva(id).subscribe({
      next:(response)=>{
       const index = this.reservas!.findIndex(item => item.id === id);
       if(index != -1){
         this.reservas?.splice(index,1)
         this.reordenar();
       }
        this.setformMessage({message:"Reserva eliminada",error:false})
      },
      error:(error)=>{
        this.setformMessage({message:"Ocurrio un error",error:true})
        console.log(error.message)
      }
    })
  }

  resetForm(){
    this.reservaForm.reset({
      hora_inicio:moment().format("HH:mm"),
      hora_fin:this.addTime(this.getHoraInicioControl.value)
    });
  }

  openForm(reserva?:Reserva){
    if(reserva){
      this.reservaForm.setValue({
        id:reserva.id!,
        nombre:reserva.nombre,
        fecha:reserva.fecha,
        departamento:reserva.departamento,
        hora_inicio:reserva.hora_inicio,
        hora_fin:reserva.hora_fin,
        reservas_deseadas:1,
      });
      this.modalFormReserva.showModal();
    }else{
      this.resetForm();
      this.getHoraFinControl.disable();
      this.modalFormReserva.showModal();
    }
  }

  addReserva(){
      const reserva:Reserva = {
        departamento:this.getDepartamentoControl.value,
        nombre:this.getNombreControl.value,
        fecha:this.getFechaControl.value,
        hora_inicio:this.getHoraInicioControl.value,
        hora_fin:this.getHoraFinValue
      }
      const arr: Reserva[] = Array.from({ length: this.getReservasDeseadasControl.value }, () => ({ ...reserva }));

      this.verificarDisponibilidad().pipe(
        mergeMap((disponible:boolean)=>{
          if(disponible){
            return this._reservasGymService.crearReserva(arr)
          }else{
            return throwError(() => new Error('No disponible!'));
          }
        })
      ).subscribe({
        next:(response:PostgrestResponse<Reserva>)=>{

          if(reserva.fecha == this.fecha){
            console.log("es pa hoy")
            this.reservas?.push(...response.data!)
            this.reordenar();
          }
          this.setformMessage({message:"Reserva registrada ✍️",error:false});
        },
        error:(error:Error)=>{
          this.setformMessage({message:error.message,error:true})
        }
      })
   
  }


  addTime(time:string,horas:string = this._reservasGymService.configuracionReservas.horasPorPersona):string{
    const [h, m] = horas.split(':').map(Number);
     return moment(time, "HH:mm") // ← se especifica el formato de entrada
    .add(h, "hours")
    .add(m,"minutes")
    .format("HH:mm");
  }

  onSubmit(){
    if(this.reservaForm.valid && this.verificarDisponibilidad()){
      this.addReserva();
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

    get getReservasDeseadasControl():FormControl{
    return this.reservaForm.controls.reservas_deseadas;
  }
  
  get getHoraFinValue():string{
    return this.reservaForm.controls.hora_fin.getRawValue();
  }

  get getIdValue():number{
    return this.reservaForm.controls.id.getRawValue();
  }

   get getHoraFinControl():FormControl{
    return this.reservaForm.controls.hora_fin;
  }
  
}


