import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { GamePlayerService } from '@core/game/game-player/game-player.service';
import { GameStateService } from '@core/game/game-state/game-state.service';
import { InGameCard } from '@core/game/game.types';
import { fadeInOut } from '@shared/animations/component-animations';
import { PLAYER_SETTINGS } from '@core/player/player.types';

@Component({
  selector: 'app-hand-picker',
  templateUrl: './hand-picker.component.html',
  styleUrls: ['./hand-picker.component.scss'],
  animations: [fadeInOut]
})
export class HandPickerComponent implements OnInit {
  @Input() open = false;

  cards: InGameCard[] = [];
  deckSleeveImgUrl: string = '';
  playerDeckSub: Subscription;
  shuffled = false;

  constructor(
    private gamePlayerSvc: GamePlayerService,
    private gameStateSvc: GameStateService
  ) { }

  ngOnInit(): void {
    this.playerDeckSub = this.gameStateSvc.getPlayers().subscribe(({ player: { deck, deckSleeveImgUrl } }) => {
      this.cards = deck.slice(-PLAYER_SETTINGS.BASE_CARDS_IN_HAND);
      this.deckSleeveImgUrl = deckSleeveImgUrl;
    });
  }

  shuffle = (): void => {
    this.shuffled = true;
    this.cards = [];

    setTimeout(() => {
      this.gamePlayerSvc.shuffleDeck('player');
    }, 600);
  }

  continue = (): void => {
    this.gameStateSvc.choosePlayerHands();
  }
}
