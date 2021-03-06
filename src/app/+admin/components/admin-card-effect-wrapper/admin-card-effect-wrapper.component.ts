import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admin-card-effect-wrapper',
  templateUrl: './admin-card-effect-wrapper.component.html',
  styleUrls: ['./admin-card-effect-wrapper.component.scss']
})
export class AdminCardEffectWrapperComponent {
  @Input() canDelete = true;
  @Input() formGroup: FormGroup;
  @Input() open = false;

  @Output() closedEdit = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<void>();
  @Output() openedEdit = new EventEmitter<void>();

  onCloseEdit = (): void => {
    this.closedEdit.emit();
  }

  onDelete = (): void => {
    this.deleted.emit();
  }

  onOpenEdit = (): void => {
    this.openedEdit.emit();
  }
}
