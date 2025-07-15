import { Component, inject, OnInit } from '@angular/core';
import { LavanderiaComponent } from './lavanderia/lavanderia.component';
import { GimnasioComponent } from './gimnasio/gimnasio.component';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from '../layout/nav/nav.component';
import { AuthService } from '../services/api/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet,NavComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent  {



}
