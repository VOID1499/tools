import { Component, inject } from '@angular/core';
import { ReservasGymService } from '../../services/api/reservas-gym.service';
import { configuracionReservas } from '../../interfaces/reservasConfiguracion';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-config',
  imports: [FormsModule],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css'
})
export class ConfigComponent {

  public message = "";
  private _reservasGymService:ReservasGymService = inject(ReservasGymService);
  public configuracion:configuracionReservas = this._reservasGymService.configuracionReservas;

  constructor(){
  }

  guardarConfig(){
    this._reservasGymService.configuracionReservas = this.configuracion;
    this.message = "Configuración modificada!"
    setTimeout(() => {
      this.message = "";
    }, 1000);
  }

}
