import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild, ElementRef, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() data!:any;
  @Input() modalContent!:TemplateRef<unknown> | null;
  @Output() statusModal:EventEmitter<boolean> = new EventEmitter<boolean>();

  modalStatus:BehaviorSubject<boolean> = new BehaviorSubject(true);

  public hidden:boolean = true;

  ngAfterViewInit(): void {
    
  }

  showModal(){
    this.hidden = false;
  }

  closeModal(){
    this.hidden = true;
    this.statusModal.emit(true);
  }

}
