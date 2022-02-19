import { Component, OnDestroy, OnInit } from '@angular/core';
import { AiService } from '@core/game/ai/ai.service';
import { GameLoaderService } from '@core/game/game-loader/game-loader.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  constructor(
    private gameLoaderSvc: GameLoaderService,
    private aiService: AiService
  ) { }

  ngOnInit(): void {
    this.aiService.init();
  }

  ngOnDestroy(): void {
    this.aiService.reset();
    this.gameLoaderSvc.reset();
  }
}
