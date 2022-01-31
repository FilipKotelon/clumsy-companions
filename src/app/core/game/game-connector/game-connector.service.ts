import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameConnectorService {
  gameStartModalOpen$ = new Subject<boolean>();

  constructor() { }

  closeGameStartModal = (): void => {
    this.gameStartModalOpen$.next(false);
  }

  openGameStartModal = (): void => {
    this.gameStartModalOpen$.next(true);
  }
}
