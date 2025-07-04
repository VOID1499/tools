import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavComponent } from './nav.component';
import { provideRouter } from '@angular/router';
import  { By } from "@angular/platform-browser";

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavComponent],
      providers:[provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  fit("deberia renderizar enlace 'Lavanderia' en el DOM",()=>{
    const links = fixture.debugElement.queryAll(By.css("a"));
    fixture.detectChanges();
    expect(links.length).toBe(10)
  })
});
