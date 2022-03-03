import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GameLoaderService } from '@core/game/game-loader/game-loader.service';
import { PLAYER_SETTINGS } from '@core/player/player.types';
import { ObjectLoadReporter } from '@game/utility/object-load-reporter.class';
import { fadeInOut } from '@shared/animations/component-animations';

@Component({
  selector: 'app-player-hud',
  templateUrl: './player-hud.component.html',
  styleUrls: ['./player-hud.component.scss'],
  animations: [fadeInOut]
})
export class PlayerHudComponent extends ObjectLoadReporter implements OnInit, OnChanges {
  @Input() avatarImgUrl: string;
  @Input() baseFood: number;
  @Input() currentFood: number;
  @Input() energy: number;
  @Input() gameObjectId: string;
  @Input() username: string;

  avatarLoadId: string;
  foodTokensToDisplay: number[];

  constructor(protected gameLoaderSvc: GameLoaderService) {
    super(gameLoaderSvc);
  }

  get energyPercentage(): string {
    let percentage = ((this.energy / PLAYER_SETTINGS.BASE_ENERGY) * 100);
    percentage = percentage > 100
      ? 100
      : percentage < 0
        ? 0
        : percentage;
    return (percentage).toFixed(2);
  }

  ngOnInit(): void {
    const amountToDisplay = this.currentFood > 0 ? this.currentFood : 1;
    this.avatarLoadId = this.gameLoaderSvc.registerLoadingObject();
    this.foodTokensToDisplay = new Array(amountToDisplay).fill(1);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.currentFood){
      const amountToDisplay = changes.currentFood.currentValue > 0 ? changes.currentFood.currentValue : 1;
      this.foodTokensToDisplay = new Array(amountToDisplay).fill(1);
    }
  }
}
