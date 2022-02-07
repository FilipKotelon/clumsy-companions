import { Component, Input } from '@angular/core';
import { InGameCard } from '@core/game/game.types';
import { fadeInOut } from '@shared/animations/component-animations';

@Component({
  selector: 'app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.scss'],
  animations: [fadeInOut]
})
export class HandComponent {
  @Input() cards: InGameCard[] = [];
  @Input() opponent = false;
  @Input() sleeveImgUrl: string;
}
