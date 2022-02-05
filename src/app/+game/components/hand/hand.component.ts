import { Component, Input } from '@angular/core';
import { InGameCard } from '@core/game/game.types';

@Component({
  selector: 'app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.scss']
})
export class HandComponent {
  @Input() cards: InGameCard[] = [];
  @Input() flipped = false;
  @Input() sleeveImgUrl: string;
}
