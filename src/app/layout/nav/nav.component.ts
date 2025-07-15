import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/api/auth.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-nav',
  imports: [RouterLink,AsyncPipe],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {


  public authService:AuthService = inject(AuthService);
  public session:boolean = false;

  ngOnInit(): void {
  }

  logout(){
    this.authService.signOut();
  }

}
