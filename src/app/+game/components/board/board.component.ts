import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { GameLoaderService } from '@core/game/game-loader/game-loader.service';
import { GameStateService } from '@core/game/game-state/game-state.service';
import { InGamePlayer } from '@core/game/game.types';
import { ObjectLoadReporter } from '@game/utility/object-load-reporter.class';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent extends ObjectLoadReporter implements OnInit {
  boardBgLoadId: string;
  playersSub: Subscription;

  opponent: InGamePlayer;
  player: InGamePlayer;

  constructor(
    protected gameLoaderSvc: GameLoaderService,
    private gameStateSvc: GameStateService
  ) {
    super(gameLoaderSvc);
  }

  ngOnInit(): void {
    this.boardBgLoadId = this.gameLoaderSvc.registerLoadingObject();
    
    this.playersSub = this.gameStateSvc.getPlayers()
      .subscribe(({ player, opponent, loaded }) => {
        if(loaded) {
          this.player = player;
          this.opponent = opponent;
        }
      });
  }

}
