import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/api/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  imports: [],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.css'
})
export class CallbackComponent implements OnInit {


  private authService:AuthService = inject(AuthService);
  private router:Router = inject(Router);


  ngOnInit(): void {
    this.checkSession();  
  }
  
  private async checkSession() {
    try {
      const {data , error}= await this.authService.client.auth.getSession();
      if (error || !data.session) {
        console.warn('No hay sesión activa o error:', error);
        this.router.navigate(['/auth/login']);
        return;
      }
      
      console.log('Usuario autenticado:');
      // Aquí puedes guardar datos en un servicio si quieres

      this.router.navigate(['/dashboard']);
    } catch (err) {
      console.error('Error inesperado:', err);
      this.router.navigate(['/auth/login']);
    }
  }
  

}
