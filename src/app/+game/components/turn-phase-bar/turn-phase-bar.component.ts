import { Component, OnInit } from '@angular/core';
import { GameStateService } from '@core/game/game-state/game-state.service';
import { CardInPlay, ContinuationApproval, CounterPlayStatus, InGameTurnPhase, PlayerKey, PlayerOpponentLoadInfo, TurnPhase, TurnPhaseButtonActionPayload, TURN_PHASES } from '@core/game/game.types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-turn-phase-bar',
  templateUrl: './turn-phase-bar.component.html',
  styleUrls: ['./turn-phase-bar.component.scss']
})
export class TurnPhaseBarComponent implements OnInit {
  buttonActionPayload: TurnPhaseButtonActionPayload;
  continuationApproval: ContinuationApproval;
  continuationApprovalSub: Subscription;
  counterPlayStatus: CounterPlayStatus;
  counterPlayStatusSub: Subscription;
  curPhase: TurnPhase;
  currentPlayerKey: PlayerKey;
  currentPlayerKeySub: Subscription;
  players: PlayerOpponentLoadInfo;
  playersSub: Subscription;
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

    this.currentPlayerKeySub = this.gameStateSvc.getCurrentPlayerKey().subscribe(playerKey => {
      this.currentPlayerKey = playerKey;
      this.setUpButton();
    });

    this.continuationApprovalSub = this.gameStateSvc.getContinuationApproval().subscribe(continuationApproval => {
      this.continuationApproval = continuationApproval;
    });

    this.counterPlayStatusSub = this.gameStateSvc.getCounterPlayStatus().subscribe(counterPlayStatus => {
      this.counterPlayStatus = counterPlayStatus;
    });

    this.playersSub = this.gameStateSvc.getPlayers().subscribe(players => {
      this.players = players;
      this.setUpButton();
    });

    this.turnPhaseSub = this.gameStateSvc.getCurrentTurnPhaseIndex().subscribe(index => {
      this.turnPhases = TURN_PHASES.map((phase, i) => {
        const isActive = i === index;

        if(isActive){
          this.curPhase = phase;
        }

        return {
          ...phase,
          active: isActive
        }
      });

      this.setUpButton();
    });
  }

  setUpButton = (): void => {
    let msg = 'Continue';
    this.buttonActionPayload = {

    };

    if(this.counterPlayStatus.canCounter && this.counterPlayStatus.playerKey === 'player'){
      msg = 'Continue';
      this.buttonActionType = {
        
      };
    } else if(this.currentPlayerKey === 'player'){
      switch(this.curPhase.name){
        case 'preparation-first':
          if(this.players.player.cardsInPlay.length){
            msg = 'Go to attack phase';
          } else {
            if(this.getHasPlayableCards('player')){
              msg = 'Skip attacking';
            } else {
              msg = 'End turn';
            }
          }
          break;

        case 'attack':
          msg = 'Skip attacking';

          if(this.getHasAttackingCards('player')){
            msg = 'Confirm attackers';
          }
          break;

        case 'defense':
          msg = 'Continue to damage';
          break;

        case 'damage':
          msg = 'Continue to the end step';
          break;

        case 'preparation-last':
          msg = 'End turn';
          break;

        default:
          break;
      }
    } else {
      msg = 'Opponent\'s turn';
    }

    this.turnPhaseButtonMsg = msg;
  }

  buttonAction = (): void => {

  }

  getHasAttackingCards = (playerKey: PlayerKey): boolean => {
    return this.players[playerKey].cardsInPlay.filter(card => card.attacking).length > 0;
  }

  getHasDefendingCards = (playerKey: PlayerKey): boolean => {
    return this.players[playerKey].cardsInPlay.filter(card => card.defending).length > 0;
  }

  getHasPlayableCards = (playerKey: PlayerKey): boolean => {
    return this.players[playerKey].hand.filter(card => card.playable).length > 0;
  }
}
