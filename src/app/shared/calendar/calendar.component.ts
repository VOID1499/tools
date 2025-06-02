import { CommonModule, JsonPipe, UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import moment from 'moment';
import 'moment/locale/es';

@Component({
  selector: 'app-calendar',
  imports: [UpperCasePipe,JsonPipe,CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {


  now = moment();
  month = this.now.month()
  year = this.now.year();
  months:string[] = moment.months();
  calendario:any;
  
  constructor(){
    moment.locale("es");
    this.calendario = this.daysInMonth();
  }



  daysInMonth(month:number = this.month,year:number = this.year  ){
    
    const mes = moment({ year, month });
    const totalDias = mes.daysInMonth();

    const calendario = [];
    let semana = [];

    // Ajustar el primer día de la semana (lunes = 1, domingo = 0 → ajustamos a 1)
    let diaInicio = mes.isoWeekday(); // 1 = lunes, 7 = domingo

    // Llenar días vacíos antes del primer día
    for (let i = 1; i < diaInicio; i++) {
      semana.push(null);
    }

    for (let dia = 1; dia <= totalDias; dia++) {
      const d = moment({year,month,day:dia});
      semana.push({
        current:d.isSame(moment(),"day"),
        date:d.format("D")
      });

      // Cuando completamos una semana o llegamos al final del mes
      if (semana.length === 7) {
        calendario.push(semana);
        semana = [];
      }
    }

    // Agregar última semana si quedó incompleta
    if (semana.length > 0) {
      while (semana.length < 7) {
        semana.push(null);
      }
      calendario.push(semana);
    }

    return calendario;
  }

}
