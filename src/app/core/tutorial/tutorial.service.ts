import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {
  private _modalOpen$ = new Subject<boolean>();

  public get modalOpen$() {
    return this._modalOpen$;
  }

  openModal = (): void => {
    this._modalOpen$.next(true);
  }

  closeModal = (): void => {
    this._modalOpen$.next(false);
  }
}
