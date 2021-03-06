import { Component, Input, OnInit } from '@angular/core';
import { GameLoaderService } from '@core/game/game-loader/game-loader.service';
import { InGameCard } from '@core/game/game.types';
import { fadeInOut } from '@shared/animations/component-animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-deck',
  templateUrl: './game-deck.component.html',
  styleUrls: ['./game-deck.component.scss'],
  animations: [fadeInOut]
})
export class GameDeckComponent implements OnInit {
  @Input() cards: InGameCard[] = [];
  @Input() sleeveImgUrl: string;

  gameLoadedSub: Subscription;
  loaded = false;

  constructor(private gameLoaderSvc: GameLoaderService) { }

  get cardsInDeck(): InGameCard[] {
    return this.cards
      ? this.loaded
        ? [...this.cards].reverse().slice(-9)
        : [...this.cards].reverse()
      : [];
  }

  ngOnInit(): void {
    this.gameLoadedSub = this.gameLoaderSvc.loadingFinished$.subscribe(loaded => {
      this.loaded = loaded;
    })
  }

}
