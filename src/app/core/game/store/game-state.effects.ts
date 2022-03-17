import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { Action, Store } from '@ngrx/store';
import { map } from '@firebase/util';
import { of } from 'rxjs';

import { GameConnectorService } from '@core/game/game-connector/game-connector.service';

import * as GameStateActions from '@core/game/store/game-state.actions';
import * as GameEffectActions from '@core/game/store/game-effect.actions';
import * as fromStore from '@core/store/reducer';
import * as GameSelectors from '@core/game/store/game.selectors';
import { GameFightsService } from '../game-fights/game-fights.service';
import { getCardPlayableCheckPayload, getEffectNeedsEnemyTarget, getEffectNeedsFriendlyTarget, getEffectNeedsTarget, getHasPlayableCards, getOtherPlayerKey } from '../game.helpers';
import { GameCanvasService } from '../game-canvas/game-canvas.service';
import { GameMessagesService } from '../game-messages/game-messages.service';

@Injectable()
export class GameStateEffects {
  constructor(
    private actions$: Actions,
    private gameCanvasSvc: GameCanvasService,
    private gameConnectorSvc: GameConnectorService,
    private gameFightsSvc: GameFightsService,
    private gameMessagesSvc: GameMessagesService,
    private router: Router,
    private store: Store<fromStore.AppState>
  ) {}

  loadStart$ = createEffect(() => this.actions$.pipe(
    ofType(GameStateActions.gameLoadStart),
    switchMap(({ type, ...data }) => {
      this.router.navigate(['/game/']);

      return this.gameConnectorSvc.loadPlayers(data);
    })
  ))

  chooseFirstPlayer$ = createEffect(() => this.actions$.pipe(
    ofType(GameStateActions.gameChooseFirstPlayer),
    tap(() => {
      setTimeout(() => {
        this.store.dispatch(GameStateActions.gameStart());
      }, 3000);
    })
  ), { dispatch: false })

  playCard$ = createEffect(() => this.actions$.pipe(
    ofType(GameStateActions.gamePlayCard),
    withLatestFrom(this.store.select(GameSelectors.selectContinuationApproval)),
    tap(([{ type, ...payload }, approval]) => {
      if(approval.opponent && approval.player){
        this.store.dispatch(GameStateActions.gameResolveCard({ card: payload.card, playerKey: payload.playerKey }));
      }
    })
  ), { dispatch: false })

  // Przechwycenie akcji po działaniach reduktora stanu
  resolveCard$ = createEffect(() => this.actions$.pipe(
    ofType(GameStateActions.gameResolveCard),
    withLatestFrom(
      this.store.select(GameSelectors.selectEffectsQueue),
      this.store.select(GameSelectors.selectPlayers)
    ),
    tap(([{ type, ...payload }, effectsQueue, players]) => {
      if(effectsQueue.length){
        const nextEffect = effectsQueue[effectsQueue.length - 1];

        if(!getEffectNeedsTarget(nextEffect.type)){
          // Zagranie efektu należącego do karty
          this.store.dispatch(nextEffect.getAction(nextEffect.payload) as Action);
        } else if(
          (getEffectNeedsFriendlyTarget(nextEffect.type) && !players[payload.card.playerKey].cardsInPlay.length)
          || (getEffectNeedsEnemyTarget(nextEffect.type) && !players[getOtherPlayerKey(payload.card.playerKey)].cardsInPlay.length)
        ){
          // Pominięcie efektu, jeśli nie ma dla niego żadnego dostępnego celu
          this.store.dispatch(GameStateActions.gameResolveEffectInQueue());
        }

        // Wyświetlenie wiadomości dla użytkownika, jeśli musi wybrać cel dla efektu karty
        if(getEffectNeedsTarget(nextEffect.type)){
          this.gameMessagesSvc.showMessage('Choose the target for your spell!', true);
        }
      } else {
        // Usunięcie karty z kolejki, jeśli nie posiada żadnego efektu
        this.store.dispatch(GameStateActions.gameResolveCardInQueue({ card: payload.card }));
      }
    })
  ), { dispatch: false })

  goToNextPhaseResolve$ = createEffect(() => this.actions$.pipe(
    ofType(GameStateActions.gameGoToNextPhaseResolve),
    withLatestFrom(
      this.store.select(GameSelectors.selectCurrentTurnPhaseIndex),
      this.store.select(GameSelectors.selectFightQueue),
      this.store.select(GameSelectors.selectPlayers),
      this.store.select(GameSelectors.selectCurrentPlayerKey),
    ),
    tap(([action, turnPhaseIndex, fights, players, currentPlayerKey]) => {
      if(turnPhaseIndex === 3){
        const attackingPlayerCards = players[currentPlayerKey].cardsInPlay.filter(card => card.attacking);
        const defendingPlayerId = players[getOtherPlayerKey(currentPlayerKey)].gameObjectId;

        this.gameFightsSvc.resolveFights(fights, attackingPlayerCards, defendingPlayerId);
        this.gameCanvasSvc.clear();
      }
    })
  ), { dispatch: false })

  chooseFightsInDefense$ = createEffect(() => this.actions$.pipe(
    ofType(GameStateActions.gameChooseFightsInDefense),
    withLatestFrom(this.store.select(GameSelectors.selectFightQueue)),
    tap(([action, fights]) => {
      this.gameCanvasSvc.setFightsToDrawBetween(fights);
    })
  ), { dispatch: false })

  resolveFightsDamage$ = createEffect(() => this.actions$.pipe(
    ofType(GameStateActions.gameResolveFightsDamage),
    tap(() => {
      setTimeout(() => {
        this.store.dispatch(GameStateActions.gameResolveFights());
      }, 400);
    })
  ), { dispatch: false })

  resolveFights$ = createEffect(() => this.actions$.pipe(
    ofType(GameStateActions.gameResolveFights),
    withLatestFrom(this.store.select(GameSelectors.selectGame)),
    tap(([action, gameState]) => {
      setTimeout(() => {
        if(gameState.currentPlayerKey === 'opponent'){
          this.store.dispatch(GameStateActions.gameEndTurn());
        } else {
          this.store.dispatch(GameStateActions.gameGoToNextPhase());
        }
      }, 1000);
    })
  ), { dispatch: false })

  endTurn$ = createEffect(() => this.actions$.pipe(
    ofType(
      GameStateActions.gameEndTurn,
      GameStateActions.gameGoToNextPhase,
      GameStateActions.gameGoToPhase
    ),
    withLatestFrom(
      this.store.select(GameSelectors.selectContinuationApproval),
      this.store.select(GameSelectors.selectStateActionsQueue)
    ),
    tap(([action, approval, actionsQueue]) => {
      if(approval.opponent && approval.player && actionsQueue.length){
        this.store.dispatch(actionsQueue[actionsQueue.length - 1]());
      }
    })
  ), { dispatch: false })

  endTurnResolve$ = createEffect(() => this.actions$.pipe(
    ofType(GameStateActions.gameEndTurnResolve),
    switchMap(() => {
      return of(GameStateActions.gameSetupNextTurn());
    })
  ))

  setupNextTurn$ = createEffect(() => this.actions$.pipe(
    ofType(GameStateActions.gameSetupNextTurn),
    withLatestFrom(this.store.select(GameSelectors.selectCurrentPlayerKey)),
    tap(([action, playerKey]) => {
      this.store.dispatch(GameEffectActions.gameDrawXCards({ amount: 1, playerKey }));

      if(playerKey === 'player'){
        this.gameMessagesSvc.showMessage('Your turn');
        this.store.dispatch(GameStateActions.gameStartTurn());
      } else {
        this.gameMessagesSvc.showMessage('Opponent\'s turn');

        setTimeout(() => {
          this.store.dispatch(GameStateActions.gameStartTurn());
        }, 1000);
      }
    })
  ), { dispatch: false })

  // startTurn$ = createEffect(() => this.actions$.pipe(
  //   ofType(GameStateActions.gameStartTurn),
  //   withLatestFrom(this.store.select(GameSelectors.selectCurrentPlayerKey)),
  //   switchMap(([action, playerKey]) => {
  //     return of(GameEffectActions.gameDrawXCards({ amount: 1, playerKey }));
  //   })
  // ))

  gameEffect$ = createEffect(() => this.actions$.pipe(
    ofType(
      GameEffectActions.gameDestroyTarget,
      GameEffectActions.gameDestroyAll,
      GameEffectActions.gameDestroyAllExcept,
      GameEffectActions.gameDamageTarget,
      GameEffectActions.gameDamageEnemies,
      GameEffectActions.gameDamageAll,
      GameEffectActions.gameDamageAllExcept,
      GameEffectActions.gameBuffTarget,
      GameEffectActions.gameBuffAllies,
      GameEffectActions.gameDebuffTarget,
      GameEffectActions.gameDebuffEnemies,
      GameEffectActions.gameAuraBuffAllies,
      GameEffectActions.gameAuraBuffAlliesExcept,
      GameEffectActions.gameAuraDebuffEnemies,
      GameEffectActions.gameAuraDebuffAllExcept,
      GameEffectActions.gameHealPlayer,
      GameEffectActions.gameAddFood,
      GameEffectActions.gameDrawXCards,
      GameEffectActions.gameShuffleDeck,
    ),
    withLatestFrom(this.store.select(GameSelectors.selectEffectsQueue)),
    tap(([action, effectsQueue]) => {
      if(effectsQueue.length){
        this.store.dispatch(GameStateActions.gameResolveEffectInQueue());
      }
    })
  ), { dispatch: false })

  potentialFightsChangeByCardEffect$ = createEffect(() => this.actions$.pipe(
    ofType(
      GameEffectActions.gameAuraBuffAllies,
      GameEffectActions.gameAuraBuffAlliesExcept,
      GameEffectActions.gameAuraDebuffEnemies,
      GameEffectActions.gameAuraDebuffAllExcept,
      GameEffectActions.gameDestroyAllExcept,
      GameEffectActions.gameDestroyTarget,
      GameEffectActions.gameDestroyAll,
      GameEffectActions.gameDestroyAllExcept,
      GameEffectActions.gameDamageTarget,
      GameEffectActions.gameBuffAllies,
      GameEffectActions.gameBuffTarget,
      GameEffectActions.gameDebuffEnemies,
      GameEffectActions.gameDebuffTarget
    ),
    withLatestFrom(
      this.store.select(GameSelectors.selectFightQueue),
      this.store.select(GameSelectors.selectCurrentTurnPhaseIndex),
      this.store.select(GameSelectors.selectCurrentPlayerKey)
    ),
    tap(([action, fights, turnPhaseIndex, playerKey]) => {
      if(turnPhaseIndex === 2){
        setTimeout(() => {
          this.gameCanvasSvc.setFightsToDrawBetween(fights);
        }, 100);
        this.store.dispatch(GameStateActions.gameChooseFightsInDefense({ fights, playerKey: getOtherPlayerKey(playerKey) }));
      }
    })
  ), { dispatch: false })

  provideTargetForEffect$ = createEffect(() => this.actions$.pipe(
    ofType(GameStateActions.gameProvideTargetForEffect),
    withLatestFrom(this.store.select(GameSelectors.selectEffectsQueue)),
    tap(([action, effectsQueue]) => {
      const nextEffect = effectsQueue[effectsQueue.length - 1];

      this.store.dispatch(nextEffect.getAction(nextEffect.payload) as Action);
      this.gameMessagesSvc.clearMessage();
    })
  ), { dispatch: false })

  resolveEffectInQueue$ = createEffect(() => this.actions$.pipe(
    ofType(GameStateActions.gameResolveEffectInQueue),
    withLatestFrom(this.store.select(GameSelectors.selectCardsQueue)),
    tap(([action, cardsQueue]) => {
      if(cardsQueue.length){
        this.store.dispatch(GameStateActions.gameResolveCardInQueue({ card: cardsQueue[cardsQueue.length - 1] }));
      }
    })
  ), { dispatch: false })

  gameEndedByDamage$ = createEffect(() => this.actions$.pipe(
    ofType(
      GameStateActions.gameResolveFights,
      GameEffectActions.gameDamageTarget
    ),
    withLatestFrom(this.store.select(GameSelectors.selectPlayers)),
    tap(([action, { player, opponent }]) => {
      if(player.energy <= 0){
        this.store.dispatch(GameStateActions.gameChooseWinner({ playerKey: 'opponent' }));
      } else if(opponent.energy <= 0){
        this.store.dispatch(GameStateActions.gameChooseWinner({ playerKey: 'player' }));
      }
    })
  ), { dispatch: false })

  gameEndedByDrawingCards$ = createEffect(() => this.actions$.pipe(
    ofType(GameEffectActions.gameDrawXCards),
    withLatestFrom(this.store.select(GameSelectors.selectGameEndedByDraw)),
    tap(([action, endedByDraw]) => {
      if(endedByDraw){
        this.store.dispatch(GameStateActions.gameChooseWinner({ playerKey: getOtherPlayerKey(action.playerKey) }));
      }
    })
  ), { dispatch: false })
}