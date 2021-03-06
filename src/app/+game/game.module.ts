import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';

import { GameComponent } from './game.component';
import { BoardComponent } from './components/board/board.component';
import { SleepyardComponent } from './components/sleepyard/sleepyard.component';
import { GameDeckComponent } from './components/game-deck/game-deck.component';
import { TurnPhaseBarComponent } from './components/turn-phase-bar/turn-phase-bar.component';
import { PlayerHudComponent } from './components/player-hud/player-hud.component';
import { HandComponent } from './components/hand/hand.component';
import { GameOverlayComponent } from './components/game-overlay/game-overlay.component';
import { HandPickerComponent } from './components/hand-picker/hand-picker.component';
import { CoinFlipComponent } from './components/coin-flip/coin-flip.component';
import { LoadingComponent } from './components/loading/loading.component';
import { SettingsComponent } from './components/settings/settings.component';

import { GameRoutingModule } from './game-routing.module';
import { FoldedCardsDirective } from './directives/folded-cards/folded-cards.directive';
import { DraggableCardDirective } from './directives/draggable-card/draggable-card.directive';
import { CardsQueueComponent } from './components/cards-queue/cards-queue.component';
import { CardsInPlayComponent } from './components/cards-in-play/cards-in-play.component';
import { GameEndScreenComponent } from './components/game-end-screen/game-end-screen.component';
import { GameCanvasOverlayComponent } from './components/game-canvas-overlay/game-canvas-overlay.component';
import { GameMessagesComponent } from './components/game-messages/game-messages.component';

@NgModule({
  declarations: [
    GameComponent,
    BoardComponent,
    SleepyardComponent,
    GameDeckComponent,
    TurnPhaseBarComponent,
    PlayerHudComponent,
    HandComponent,
    GameOverlayComponent,
    HandPickerComponent,
    CoinFlipComponent,
    LoadingComponent,
    SettingsComponent,
    FoldedCardsDirective,
    DraggableCardDirective,
    CardsQueueComponent,
    CardsInPlayComponent,
    GameEndScreenComponent,
    GameCanvasOverlayComponent,
    GameMessagesComponent,
  ],
  imports: [
    SharedModule,
    GameRoutingModule
  ]
})
export class GameModule { }
