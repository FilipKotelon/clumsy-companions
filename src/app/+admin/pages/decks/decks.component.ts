import { Component, OnInit } from '@angular/core';
import { DecksService } from '@core/decks/decks.service';
import { Deck } from '@core/decks/decks.types';

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
    private decksSvc: DecksService
  ) { }

  ngOnInit(): void {
    this.decksSvc.getDecks({ global: true }).subscribe(decks => {
      this.decks = decks;
    })
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
    this.decksSvc.deleteDeck(this.idToDelete, '/admin/decks');
    this.closeDeletePopup();
  }
}
