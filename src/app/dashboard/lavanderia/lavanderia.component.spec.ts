import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LavanderiaComponent } from './lavanderia.component';

describe('LavanderiaComponent', () => {
  let component: LavanderiaComponent;
  let fixture: ComponentFixture<LavanderiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LavanderiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LavanderiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
