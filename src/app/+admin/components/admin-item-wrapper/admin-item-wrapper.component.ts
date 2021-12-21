import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin-item-wrapper',
  templateUrl: './admin-item-wrapper.component.html',
  styleUrls: ['./admin-item-wrapper.component.scss']
})
export class AdminItemWrapperComponent {
  @Input() editLink: string;
  @Output() deleted = new EventEmitter<void>();

  onDelete = (): void => {
    this.deleted.emit();
  }
}
