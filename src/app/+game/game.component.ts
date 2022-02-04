import { Component, OnDestroy } from '@angular/core';
import { GameLoaderService } from '@core/game/game-loader/game-loader.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnDestroy {
  constructor(private gameLoaderSvc: GameLoaderService) { }

  ngOnDestroy(): void {
    this.gameLoaderSvc.reset();
  }
}
