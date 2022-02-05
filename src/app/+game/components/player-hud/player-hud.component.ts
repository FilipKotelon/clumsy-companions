import { Component, Input, OnInit } from '@angular/core';
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
export class PlayerHudComponent extends ObjectLoadReporter implements OnInit {
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
    percentage = percentage > 100 ? 100 : percentage;
    return (percentage).toFixed(2);
  }

  ngOnInit(): void {
    this.avatarLoadId = this.gameLoaderSvc.registerLoadingObject();
    this.foodTokensToDisplay = new Array(10).fill(1);
  }
}
