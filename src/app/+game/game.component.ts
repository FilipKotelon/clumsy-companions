import { Component, OnDestroy, OnInit } from '@angular/core';
import { AiService } from '@core/game/ai/ai.service';
import { GameCanvasService } from '@core/game/game-canvas/game-canvas.service';
import { GameLoaderService } from '@core/game/game-loader/game-loader.service';
import { GameMessagesService } from '@core/game/game-messages/game-messages.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  constructor(
    private aiService: AiService,
    private gameCanvasSvc: GameCanvasService,
    private gameLoaderSvc: GameLoaderService,
    private gameMessagesSvc: GameMessagesService
  ) { }

  ngOnInit(): void {
    this.aiService.init();
    this.gameCanvasSvc.init();
  }

  ngOnDestroy(): void {
    this.aiService.reset();
    this.gameCanvasSvc.reset();
    this.gameLoaderSvc.reset();
    this.gameMessagesSvc.clearMessage();
  }
}
