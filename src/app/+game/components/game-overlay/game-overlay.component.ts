import { Component, OnInit } from '@angular/core';
import { GameStateService } from '@core/game/game-state/game-state.service';
import { PlayerKey } from '@core/game/game.types';
import { fadeInOut } from '@shared/animations/component-animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-overlay',
  templateUrl: './game-overlay.component.html',
  styleUrls: ['./game-overlay.component.scss'],
  animations: [fadeInOut]
})
export class GameOverlayComponent implements OnInit {
  arePlayerHandsChosenSub: Subscription;
  isFirstPlayerChosenSub: Subscription;
  isPreparingSub: Subscription;
  winnerChosenSub: Subscription;

  coinFlipOpen = false;
  firstPlayerChosen = false;
  open = false;
  playerHandsChosen = false;
  winner: PlayerKey = null;

  constructor(private gameStateSvc: GameStateService) { }

  ngOnInit(): void {
    this.isPreparingSub = this.gameStateSvc.getIsPreparing().subscribe(isPreparing => {
      this.open = isPreparing;
    });

    this.arePlayerHandsChosenSub = this.gameStateSvc.getArePlayersHandsChosen().subscribe(handsChosen => {
      this.playerHandsChosen = handsChosen;
      if(handsChosen){
        setTimeout(() => {
          this.coinFlipOpen = true;
        }, 600);
      }
    });

    this.isFirstPlayerChosenSub = this.gameStateSvc.getIsFirstPlayerChosen().subscribe(playerChosen => {
      this.firstPlayerChosen = playerChosen;
    });

    this.winnerChosenSub = this.gameStateSvc.getWinner().subscribe(winner => {
      this.winner = winner;
      this.open = !!winner;
    });
  }

}
