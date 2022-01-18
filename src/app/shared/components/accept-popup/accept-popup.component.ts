import { fadeInOut } from '@shared/animations/component-animations';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-accept-popup',
  templateUrl: './accept-popup.component.html',
  animations: [
    fadeInOut
  ]
})
export class AcceptPopupComponent {
  @Input() open: boolean;
  @Input() msg: string;
  @Input() acceptMsg = 'Accept';
  @Input() declineMsg = 'Cancel';
  @Input() acceptBtnClass = 'green';
  @Input() declineBtnClass = 'red';
  
  @Output() declined = new EventEmitter<void>()
  @Output() accepted = new EventEmitter<void>()
  
  onDecline = (): void => {
    this.declined.emit();
  }

  onAccept = (): void => {
    this.accepted.emit();
  }
}
