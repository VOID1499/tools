import { Component,EventEmitter,Input,Output } from '@angular/core';
import { Reserva } from '../../../interfaces/reserva.interface';

@Component({
  selector: 'app-reserva',
  imports: [],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.css'
})
export class ReservaComponent {


  @Input() reserva!:Reserva;
  @Output() closeModal =  new EventEmitter<void>()
  @Output() deleteReserva =  new EventEmitter<void>()

  constructor(){
  }

  ngOnInit():void{
   console.log(this.reserva)
  }

  emitDelete(){
    this.deleteReserva.emit();
  }
  emitClose(){
    this.closeModal.emit();
  }

}
