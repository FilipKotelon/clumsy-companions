import { Component, EventEmitter, Input, Output } from '@angular/core';
import { fadeInOut } from '@shared/animations/component-animations';

@Component({
  selector: 'app-deck-card-wrapper',
  templateUrl: './deck-card-wrapper.component.html',
  styleUrls: ['./deck-card-wrapper.component.scss'],
  animations: [fadeInOut]
})
export class DeckCardWrapperComponent {
  @Input() amount = 0;
  @Input() maxAmount = 5;

  @Output() decreasedAmount = new EventEmitter<void>();
  @Output() increasedAmount = new EventEmitter<void>();
  @Output() removed = new EventEmitter<void>();

  onDecrease = (): void => {
    if(this.amount - 1 >= 0) {
      this.decreasedAmount.emit();
    }
  }

  onIncrease = (): void => {
    if(this.amount + 1 <= this.maxAmount) {
      this.increasedAmount.emit();
    }
  }

  onRemove = (): void => {
    this.removed.emit();
  }
}
