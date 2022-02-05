import { Component, Input } from '@angular/core';
import { SleepyardCard } from '@core/game/game.types';

@Component({
  selector: 'app-sleepyard',
  templateUrl: './sleepyard.component.html',
  styleUrls: ['./sleepyard.component.scss']
})
export class SleepyardComponent {
  @Input() cards: SleepyardCard[] = [];
}
