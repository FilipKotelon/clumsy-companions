import { HubRoutingModule } from './hub-routing.module';
import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { HubComponent } from './hub.component';
import { NavComponent } from './components/nav/nav.component';
import { PacksComponent } from './pages/packs/packs.component';
import { PackWrapperComponent } from './components/pack-wrapper/pack-wrapper.component';
import { DecksComponent } from './pages/decks/decks.component';
import { DeckWrapperComponent } from './components/deck-wrapper/deck-wrapper.component';
import { HomeComponent } from './pages/home/home.component';



@NgModule({
  declarations: [
    HubComponent,
    NavComponent,
    PacksComponent,
    PackWrapperComponent,
    DecksComponent,
    DeckWrapperComponent,
    HomeComponent
  ],
  imports: [
    SharedModule,
    HubRoutingModule
  ]
})
export class HubModule { }
