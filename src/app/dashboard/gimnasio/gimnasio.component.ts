import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ReservasGymService } from '../../services/api/reservas-gym.service';
import { FormsModule} from "@angular/forms";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gimnasio',
  imports: [RouterOutlet,RouterLink,FormsModule,CommonModule],
  templateUrl: './gimnasio.component.html',
  styleUrl: './gimnasio.component.css'
})
export class GimnasioComponent {

  public dateInput!:string;
  private _reservasGymService:ReservasGymService = inject(ReservasGymService);
  private router:Router = inject(Router);
  private activedRoute:ActivatedRoute = inject(ActivatedRoute);
  constructor(){
   
  }

  onChangeDate(){
    this.router.navigate(['reservas', this.dateInput], {
    relativeTo: this.activedRoute
  });
  }
}
