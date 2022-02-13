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
  turnPhaseButtonMsg: string;
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
      let activePhase: TurnPhase = null;

      this.turnPhases = TURN_PHASES.map((phase, i) => {
        const isActive = i === index;

        if(isActive){
          activePhase = phase;
        }

        return {
          ...phase,
          active: isActive
        }
      });

      this.setButtonMsg(activePhase.name, index);
    })
  }

  setButtonMsg = (phaseName: string, phaseIndex: number): void => {
    
  }
}
