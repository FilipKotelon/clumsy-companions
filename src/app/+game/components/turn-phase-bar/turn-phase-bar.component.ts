import { Component, OnInit } from '@angular/core';
import { GamePlayerService } from '@core/game/game-player/game-player.service';
import { GameStateService } from '@core/game/game-state/game-state.service';
import { CardInPlay, ContinuationApproval, CounterPlayStatus, InGameTurnPhase, PlayerKey, PlayerOpponentLoadInfo, TurnPhase, TurnPhaseButtonActionPayload, TurnPhaseButtonActionType, TURN_PHASES } from '@core/game/game.types';
import { fadeInOut } from '@shared/animations/component-animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-turn-phase-bar',
  templateUrl: './turn-phase-bar.component.html',
  styleUrls: ['./turn-phase-bar.component.scss'],
  animations: [fadeInOut]
})
export class TurnPhaseBarComponent implements OnInit {
  buttonActionPayload: TurnPhaseButtonActionPayload = null;
  continuationApproval: ContinuationApproval = null;
  continuationApprovalSub: Subscription;
  counterPlayStatus: CounterPlayStatus = null;
  counterPlayStatusSub: Subscription;
  curPhase: TurnPhase = null;
  currentPlayerKey: PlayerKey = null;
  currentPlayerKeySub: Subscription;
  players: PlayerOpponentLoadInfo = null;
  playersSub: Subscription;
  transitioning: boolean = false;
  transitioningSub: Subscription;
  turnPhaseButtonMsg: string;
  turnPhases: InGameTurnPhase[] = [];
  turnPhaseSub: Subscription;

  constructor(
    private gameStateSvc: GameStateService,
    private gamePlayerSvc: GamePlayerService
  ) { }

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
      this.setUpButton();
    });

    this.counterPlayStatusSub = this.gameStateSvc.getCounterPlayStatus().subscribe(counterPlayStatus => {
      this.counterPlayStatus = counterPlayStatus;
      this.setUpButton();
    });

    this.playersSub = this.gameStateSvc.getPlayers().subscribe(players => {
      this.players = players;
      this.setUpButton();
    });

    this.transitioningSub = this.gameStateSvc.getTransitioning().subscribe(transitioning => {
      this.transitioning = transitioning;
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

    this.setUpButton();
  }

  setUpButton = (): void => {
    let msg = 'Continue';
    let btnActionPayload: TurnPhaseButtonActionPayload = {
      actionType: TurnPhaseButtonActionType.NextPhase
    };

    if(this.transitioning){
      this.turnPhaseButtonMsg = '...';
      this.buttonActionPayload = {
        actionType: TurnPhaseButtonActionType.None
      };
      return;
    }

    if(!this.continuationApproval
      || !this.counterPlayStatus
      || !this.curPhase
      || !this.currentPlayerKey
      || !this.players) {
        this.turnPhaseButtonMsg = 'Loading...';
        this.buttonActionPayload = {
          actionType: TurnPhaseButtonActionType.None
        };
        return;
      }

    if(this.counterPlayStatus.canCounter && this.counterPlayStatus.playerKey === 'player'){
      msg = 'Continue';

      btnActionPayload = {
        actionType: TurnPhaseButtonActionType.ApproveContinuation
      };
    } else if(this.currentPlayerKey === 'player'){
      switch(this.curPhase.name){
        case 'preparation-first':
          if(this.players.player.cardsInPlay.length && this.getHasPotentialAttackingCards('player')){
            msg = 'Go to attack phase';
          } else {
            if(this.getHasPlayableCards('player')){
              msg = 'Skip attacking';

              btnActionPayload = {
                actionType: TurnPhaseButtonActionType.SkipTo,
                phaseName: 'preparation-last'
              };
            } else {
              msg = 'End turn';

              btnActionPayload = {
                actionType: TurnPhaseButtonActionType.EndTurn
              };
            }
          }
          break;

        case 'attack':
          msg = 'Skip attacking';

          btnActionPayload = {
            actionType: TurnPhaseButtonActionType.SkipTo,
            phaseName: 'preparation-last'
          };

          if(this.getHasAttackingCards('player')){
            msg = 'Confirm attackers';
          }
          break;

        case 'defense':
          msg = 'Continue to damage';

          if(this.getHasAttackingCards('player')){
            msg = 'Continue to the end step';

            btnActionPayload = {
              actionType: TurnPhaseButtonActionType.SkipTo,
              phaseName: 'preparation-last'
            };
          }
          break;

        case 'damage':
          msg = 'Continue to the end step';
          break;

        case 'preparation-last':
          msg = 'End turn';

          btnActionPayload = {
            actionType: TurnPhaseButtonActionType.EndTurn
          };
          break;

        default:
          break;
      }
    } else {
      msg = 'Opponent\'s turn';

      btnActionPayload = {
        actionType: TurnPhaseButtonActionType.None
      };

      switch(this.curPhase.name){
        case 'defense':
          btnActionPayload = {
            actionType: TurnPhaseButtonActionType.ApproveContinuation
          };
          if(this.getHasDefendingCards('player')){
            msg = 'Confirm blockers';
          } else {
            msg = 'Skip blocking';
          }
          break;

        default:
          break;
      }
    }

    this.turnPhaseButtonMsg = msg;
    this.buttonActionPayload = btnActionPayload;
  }

  buttonAction = (): void => {
    switch(this.buttonActionPayload.actionType){
      case TurnPhaseButtonActionType.ApproveContinuation:
        this.gamePlayerSvc.approveContinuation('player');
        break;

      case TurnPhaseButtonActionType.EndTurn:
        this.gameStateSvc.endTurn();
        break;

      case TurnPhaseButtonActionType.NextPhase:
        this.gameStateSvc.goToNextPhase();
        break;

      case TurnPhaseButtonActionType.SkipTo:
        this.gameStateSvc.goToPhase(this.buttonActionPayload.phaseName);
        break;

      case TurnPhaseButtonActionType.None:
      default:
        break;
    }
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

  getHasPotentialAttackingCards = (playerKey: PlayerKey): boolean => {
    return this.players[playerKey].cardsInPlay.filter(card => !card.dizzy && !card.tired).length > 0;
  }
}
