import { Component, OnInit } from '@angular/core';
import { GameStateService } from '@core/game/game-state/game-state.service';
import { InGameTurnPhase, TurnPhase, TURN_PHASES } from '@core/game/game.types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-turn-phase-bar',
  templateUrl: './turn-phase-bar.component.html',
  styleUrls: ['./turn-phase-bar.component.scss']
})
export class TurnPhaseBarComponent implements OnInit {
  turnPhases: InGameTurnPhase[] = [];
  turnPhaseSub: Subscription;

  constructor(private gameStateSvc: GameStateService) { }

  get turnProgressPercentage(): string {
    return ((this.activeTurnPhaseIndex / (this.turnPhases.length - 1)) * 100).toFixed(2);
  }

  get activeTurnPhaseIndex(): number {
    return this.turnPhases.findIndex(phase => phase.active);
  }

  ngOnInit(): void {
    this.turnPhases = TURN_PHASES.map(phase => ({
      ...phase,
      active: false
    }));

    this.turnPhaseSub = this.gameStateSvc.getCurrentTurnPhaseIndex().subscribe(index => {
      this.turnPhases = TURN_PHASES.map((phase, i) => ({
        ...phase,
        active: i === index
      }));
    })
  }
}
