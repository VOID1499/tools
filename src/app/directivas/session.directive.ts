import { Directive, ElementRef, inject, OnInit, Renderer2,Input, AfterViewInit } from '@angular/core';
import { AuthService } from '../services/api/auth.service';

@Directive({
  selector: '[appSession]'
})
export class SessionDirective implements OnInit , AfterViewInit {

  @Input({required:true}) appSession:string[] = [];

  rol = "user"
  private authService:AuthService = inject(AuthService);
  element:ElementRef<HTMLElement> = inject(ElementRef);
  renderer:Renderer2 = inject(Renderer2);
  
  constructor(){ 
  }

  ngOnInit(): void {
    this.authService.session$.subscribe({
      next: (session) => {
        const el = this.element.nativeElement;
        const show  = session && (this.appSession.length === 0 || this.appSession.includes(this.rol));
        if (show ) {
          this.renderer.removeClass(el, 'hidden');
        } else {
          this.renderer.addClass(el, 'hidden');
        }
      }
    });
  }

  
  ngAfterViewInit(): void {
  }
  


}
