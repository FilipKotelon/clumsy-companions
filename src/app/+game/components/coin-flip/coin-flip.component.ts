import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { GameStateService } from '@core/game/game-state/game-state.service';
import { PlayerKey, PlayerOpponentLoadInfo } from '@core/game/game.types';
import { fadeInOut } from '@shared/animations/component-animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-coin-flip',
  templateUrl: './coin-flip.component.html',
  styleUrls: ['./coin-flip.component.scss'],
  animations: [fadeInOut]
})
export class CoinFlipComponent implements OnInit, OnChanges, OnDestroy {
  @Input() open = false;
  
  flipInterval: NodeJS.Timeout;
  messages: string[] = [];
  playersSub: Subscription;
  players: PlayerOpponentLoadInfo;

  constructor(private gameStateSvc: GameStateService) {}

  ngOnInit(): void {
    this.playersSub = this.gameStateSvc.getPlayers().subscribe(playerOpponentLoadInfo => {
      this.players = playerOpponentLoadInfo;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.open.currentValue){
      this.startFlip();
    }
  }

  ngOnDestroy(): void {
    this.playersSub.unsubscribe();
  }

  startFlip = (): void => {
    this.messages.push('...');

    this.flipInterval = setInterval(() => {
      if(this.messages.length < 3) {
        this.messages.push('...');
      } else {
        const index = Math.floor(Math.random() * 2);
        const options: PlayerKey[] = ['player', 'opponent'];
        const username = this.players[options[index]].username;

        this.messages.push(`I hereby declare <b>${username}</b> as the one who shall begin!`);
        this.gameStateSvc.chooseFirstPlayer(options[index]);
        clearInterval(this.flipInterval);
      }
    }, 1000);
  }
}
