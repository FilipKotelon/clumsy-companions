import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-deck-wrapper',
  templateUrl: './deck-wrapper.component.html',
  styleUrls: ['./deck-wrapper.component.scss']
})
export class DeckWrapperComponent {
  @Input() editLink: string;
  @Output() deleted = new EventEmitter<void>();

  onDelete = (): void => {
    this.deleted.emit();
  }
}
