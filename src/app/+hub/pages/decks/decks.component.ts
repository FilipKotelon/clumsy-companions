import { Component, OnInit } from '@angular/core';
import { DecksService } from '@core/decks/decks.service';
import { Deck } from '@core/decks/decks.types';
import { PlayerService } from '@core/player/player.service';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-decks',
  templateUrl: './decks.component.html',
  styleUrls: ['./decks.component.scss']
})
export class DecksComponent implements OnInit {
  private idToDelete = '';

  deletePopupOpen: boolean;
  decks: Deck[];

  constructor(
    private decksSvc: DecksService,
    private playerSvc: PlayerService
  ) { }

  ngOnInit(): void {
    this.playerSvc.getDecksIds().pipe(
      switchMap(decksIds => {
        if(decksIds && decksIds.length){
          return this.decksSvc.getDecks({ ids: decksIds });
        } else {
          return of([]);
        }
      })
    ).subscribe(decks => {
      this.decks = decks;
    });
  }

  onOpenDeletePopup = (id: string): void => {
    this.deletePopupOpen = true;
    this.idToDelete = id;
  }

  closeDeletePopup = (): void => {
    this.deletePopupOpen = false;
    this.idToDelete = '';
  }

  deleteDeck = (): void => {
    this.decksSvc.deleteDeck(this.idToDelete, '/hub/decks', true);
    this.closeDeletePopup();
  }
}
