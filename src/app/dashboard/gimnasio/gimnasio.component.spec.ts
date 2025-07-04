import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GimnasioComponent } from './gimnasio.component';
import { provideRouter } from '@angular/router';

describe('GimnasioComponent', () => {
  let component: GimnasioComponent;
  let fixture: ComponentFixture<GimnasioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GimnasioComponent],
      providers:[provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GimnasioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
