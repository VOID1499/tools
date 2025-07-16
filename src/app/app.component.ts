import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/api/auth.service';
import { NavComponent } from './layout/nav/nav.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,NavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tools';
  private authService:AuthService = inject(AuthService);

  ngOnInit(): void {
   this.authService.session$.subscribe()
  }
}
