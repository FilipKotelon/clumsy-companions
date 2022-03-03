import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameMessagesService {
  readonly message$ = new Subject<string>();

  showMessage = (msg: string, untilCleared = false): void => {
    this.message$.next(msg);

    if(!untilCleared){
      setTimeout(() => {
        this.message$.next(null);
      }, 2000);
    }
  }

  clearMessage = (): void => {
    this.message$.next(null);
  }
}
