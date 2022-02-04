import { Directive } from '@angular/core';
import { GameLoaderService } from '@core/game/game-loader/game-loader.service';

@Directive()
export abstract class ObjectLoadReporter {
  constructor(protected gameLoaderSvc: GameLoaderService) {}

  reportLoadedObject = (id: string): void => {
    this.gameLoaderSvc.reportLoadedObject(id);
  }
}