import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { GameStateService } from '@core/game/game-state/game-state.service';
import { PlayerKey } from '@core/game/game.types';
import { Gift } from '@core/gift/gift.types';
import { LoadingService } from '@core/loading/loading.service';
import { PacksService } from '@core/packs/packs.service';
import { PlayerService } from '@core/player/player.service';
import { fadeInOut } from '@shared/animations/component-animations';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-game-end-screen',
  templateUrl: './game-end-screen.component.html',
  styleUrls: ['./game-end-screen.component.scss'],
  animations: [fadeInOut]
})
export class GameEndScreenComponent {
  @Input() winner: PlayerKey = null;

  constructor(
    private gameStateSvc: GameStateService,
    private playerSvc: PlayerService,
    private loadingSvc: LoadingService,
    private packsSvc: PacksService,
    private router: Router
  ){}

  get won(): boolean {
    return this.winner === 'player';
  }

  continue = (): void => {
    this.loadingSvc.addLoadingTask('END_GAME');

    this.gameStateSvc.getMaxReward()
      .pipe(take(1))
      .subscribe((maxReward) => {
        if(maxReward.packId && this.won){
          this.packsSvc.getPack(maxReward.packId).subscribe((pack) => {
            this.giveRewardToPlayerAndGoToHub({ title: 'Your reward', coins: maxReward.coins, packs: [pack] });
          });
        } else {
          this.giveRewardToPlayerAndGoToHub({ title: 'Your reward', coins: this.won ? maxReward.coins : Math.round(maxReward.coins / 2) });
        }
      });
  }

  giveRewardToPlayerAndGoToHub = (gift: Gift): void => {
    this.router.navigate(['/hub']);
    this.gameStateSvc.endGame();
    this.playerSvc.receiveGift(gift);
    this.loadingSvc.removeLoadingTask('END_GAME');
  }
}
