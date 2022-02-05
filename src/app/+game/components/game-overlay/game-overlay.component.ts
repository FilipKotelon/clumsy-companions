import { Component, OnInit } from '@angular/core';
import { GameStateService } from '@core/game/game-state/game-state.service';
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

  playerHandsChosen = false;
  firstPlayerChosen = false;
  open = false;

  constructor(private gameStateSvc: GameStateService) { }

  ngOnInit(): void {
    this.isPreparingSub = this.gameStateSvc.getIsPreparing().subscribe(isPreparing => {
      console.log(isPreparing);
      this.open = isPreparing;
    });

    this.arePlayerHandsChosenSub = this.gameStateSvc.getArePlayersHandsChosen().subscribe(handsChosen => {
      this.playerHandsChosen = handsChosen;
    });

    this.isFirstPlayerChosenSub = this.gameStateSvc.getIFirstPlayerChosen().subscribe(playerChosen => {
      this.firstPlayerChosen = playerChosen;
    });
  }

}
