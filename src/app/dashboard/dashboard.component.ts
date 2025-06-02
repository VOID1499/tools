import { Component } from '@angular/core';
import { LavanderiaComponent } from './lavanderia/lavanderia.component';
import { GimnasioComponent } from './gimnasio/gimnasio.component';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from '../layout/nav/nav.component';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet,NavComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
