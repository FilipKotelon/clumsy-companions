import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AiOpponentsService } from '@core/ai-opponents/ai-opponents.service';
import { AIOpponentWithThumbnail } from '@core/ai-opponents/ai-opponents.types';
import { DecksService } from '@core/decks/decks.service';
import { Deck } from '@core/decks/decks.types';
import { GameConnectorService } from '@core/game/game-connector/game-connector.service';
import { LoadingService } from '@core/loading/loading.service';
import { PlayerService } from '@core/player/player.service';
import { fadeInOut } from '@shared/animations/component-animations';
import { combineLatest, of, Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-game-start-modal',
  templateUrl: './game-start-modal.component.html',
  styleUrls: ['./game-start-modal.component.scss'],
  animations: [fadeInOut]
})
export class GameStartModalComponent implements OnInit, OnDestroy {
  aiOpponents: AIOpponentWithThumbnail[] = [];
  availableDecks: Deck[] = [];
  curDeckIndex = 0;
  curOpponentIndex = 0;
  dataSub: Subscription;
  gameStartModalOpen = false;
  gameStartModalSub: Subscription;
  initDeckIndex = 0;
  open = false;
  playerDeck: Deck = null;

  constructor(
    private aiOpponentsSvc: AiOpponentsService,
    private decksSvc: DecksService,
    private gameConnectorSvc: GameConnectorService,
    private loadingSvc: LoadingService,
    private playerSvc: PlayerService
  ) { }

  ngOnInit(): void {
    this.gameStartModalSub = this.gameConnectorSvc.gameStartModalOpen$.subscribe(gameStartModalOpen => {
      this.open = gameStartModalOpen;

      if(this.open){
        this.load();
      }
    });
  }

  ngOnDestroy(): void {
    this.dataSub.unsubscribe();
    this.gameStartModalSub.unsubscribe();
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

  load = (): void => {
    this.loadingSvc.addLoadingTask('LOAD_GAME_START_DATA');

    const aiOpponents$ = this.aiOpponentsSvc.getAIOpponents({ playable: true }).pipe(
      switchMap(aiOpponents => {
        return this.aiOpponentsSvc.getAiOpponentsWithThumbnails(aiOpponents);
      })
    );

    const decks$ = this.playerSvc.getDecksIds().pipe(
      take(1),
      switchMap(decksIds => {
        if(decksIds && decksIds.length){
          return this.decksSvc.getDecks({ ids: decksIds, global: false });
        } else {
          return of([]);
        }
      })
    );

    const curDeckId$ = this.playerSvc.getCurrentDeckId().pipe(take(1));

    this.dataSub = combineLatest([
      aiOpponents$,
      decks$,
      curDeckId$
    ]).subscribe(([opponents, decks, curDeckId]) => {
      this.aiOpponents = opponents;
      this.availableDecks = decks;

      const deckIndex = this.availableDecks.map(deck => deck.id).indexOf(curDeckId);
      this.curDeckIndex = deckIndex > 0
        ? deckIndex
        : 0;
      this.initDeckIndex = deckIndex > 0
        ? deckIndex
        : 0;
      
      console.log(opponents, decks);

      this.loadingSvc.removeLoadingTask('LOAD_GAME_START_DATA');
    });
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
