import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { EditDeckComponent } from './pages/edit-deck/edit-deck.component';
import { DeckCardWrapperComponent } from './components/deck-card-wrapper/deck-card-wrapper.component';
import { DecksRoutingModule } from './decks-routing.module';

@NgModule({
  declarations: [
    EditDeckComponent,
    DeckCardWrapperComponent
  ],
  imports: [
    SharedModule,
    DecksRoutingModule
  ]
})
export class DecksModule { }
