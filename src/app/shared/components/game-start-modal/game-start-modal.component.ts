import { Component, Input, OnInit } from '@angular/core';
import { AiOpponentsService } from '@core/ai-opponents/ai-opponents.service';
import { AIOpponentWithThumbnail } from '@core/ai-opponents/ai-opponents.types';
import { DecksService } from '@core/decks/decks.service';
import { Deck } from '@core/decks/decks.types';
import { GameConnectorService } from '@core/game/game-connector/game-connector.service';
import { PlayerService } from '@core/player/player.service';
import { fadeInOut } from '@shared/animations/component-animations';
import { combineLatest, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-game-start-modal',
  templateUrl: './game-start-modal.component.html',
  styleUrls: ['./game-start-modal.component.scss'],
  animations: [fadeInOut]
})
export class GameStartModalComponent implements OnInit {
  @Input() open = false;

  aiOpponents: AIOpponentWithThumbnail[] = [];
  availableDecks: Deck[] = [];
  curDeckIndex = 0;
  curOpponentIndex = 0;
  initDeckIndex = 0;
  playerDeck: Deck = null;

  constructor(
    private aiOpponentsSvc: AiOpponentsService,
    private decksSvc: DecksService,
    private gameConnectorSvc: GameConnectorService,
    private playerSvc: PlayerService
  ) { }

  ngOnInit(): void {
    const aiOpponents$ = this.aiOpponentsSvc.getAIOpponents({ playable: true }).pipe(
      switchMap(aiOpponents => {
        return this.aiOpponentsSvc.getAiOpponentsWithThumbnails(aiOpponents);
      })
    );

    const decks$ = this.playerSvc.getDecksIds().pipe(
      take(1),
      switchMap(decksIds => {
        if(decksIds && decksIds.length){
          return this.decksSvc.getDecks({ ids: decksIds });
        } else {
          return of([]);
        }
      })
    );

    const curDeckId$ = this.playerSvc.getCurrentDeckId().pipe(take(1));

    combineLatest([
      aiOpponents$,
      decks$,
      curDeckId$
    ]).subscribe(([opponents, decks, curDeckId]) => {
      this.aiOpponents = opponents;
      this.availableDecks = decks;

      const deckIndex = this.availableDecks.map(deck => deck.id).indexOf(curDeckId);
      this.curDeckIndex = deckIndex || 0;
      this.initDeckIndex = deckIndex || 0;
    });
    
  }

  changeCurrentDeck = (index: number): void => {
    this.curDeckIndex = index;
  }

  changeOpponent = (index: number): void => {
    this.curOpponentIndex = index;
  }

  close = (): void => {
    this.gameConnectorSvc.closeGameStartModal();
    this.playerSvc.chooseCurrentDeck(this.availableDecks[this.curDeckIndex].id);
  }

  play = (): void => {
    this.playerSvc.chooseCurrentDeck(this.availableDecks[this.curDeckIndex].id);

    this.playerSvc.getPlayer()
      .pipe(
        take(1)
      ).subscribe(player => {
        this.gameConnectorSvc.startGame({
          player,
          playerDeck: this.availableDecks[this.curDeckIndex],
          opponent: this.aiOpponents[this.curOpponentIndex]
        });
      });
  }
}
