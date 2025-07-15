import { Directive, ElementRef, inject, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '../services/api/auth.service';

@Directive({
  selector: '[appSession]'
})
export class SessionDirective implements OnInit {

  private authService:AuthService = inject(AuthService);
  element:ElementRef<HTMLElement> = inject(ElementRef);
  renderer:Renderer2 = inject(Renderer2);
  
  constructor(){ 
  }
  
  ngOnInit(): void {
    this.authService.session$.subscribe({
      next:(session)=>{
         session != null ? this.renderer.addClass(this.element.nativeElement,"hidden") : this.renderer.removeClass(this.element.nativeElement,"hidden")
         
      }
    })
  }

}
