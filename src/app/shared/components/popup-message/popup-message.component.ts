import { fadeInOut } from '@shared/animations/component-animations';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-popup-message',
  templateUrl: './popup-message.component.html',
  animations: [
    fadeInOut
  ]
})
export class PopupMessageComponent {
  @Input() error: boolean;
  @Input() open: boolean;
  @Input() msg: string;

  @Output() onClose = new EventEmitter<void>();
  
  closePopup = (): void => {
    this.onClose.emit();
  }
}
