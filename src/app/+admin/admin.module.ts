import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { NavComponent } from './components/nav/nav.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CardsComponent } from './pages/cards/cards.component';
import { SetsComponent } from './pages/sets/sets.component';
import { PacksComponent } from './pages/packs/packs.component';
import { AvatarsComponent } from './pages/avatars/avatars.component';
import { SleevesComponent } from './pages/sleeves/sleeves.component';
import { PlayersComponent } from './pages/players/players.component';
import { AiOpponentsComponent } from './pages/ai-opponents/ai-opponents.component';
import { AiDecksComponent } from './pages/ai-decks/ai-decks.component';
import { AdminItemWrapperComponent } from './components/admin-item-wrapper/admin-item-wrapper.component';
import { CardsEditComponent } from './pages/cards/cards-edit/cards-edit.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { SetsEditComponent } from './pages/sets/sets-edit/sets-edit.component';
import { SimpleListItemComponent } from './components/simple-list-item/simple-list-item.component';
import { FormControlComponent } from './components/form-control/form-control.component';

@NgModule({
  declarations: [
    AdminComponent,
    NavComponent,
    SidebarComponent,
    WelcomeComponent,
    CardsComponent,
    SetsComponent,
    PacksComponent,
    AvatarsComponent,
    SleevesComponent,
    PlayersComponent,
    AiOpponentsComponent,
    AiDecksComponent,
    AdminItemWrapperComponent,
    CardsEditComponent,
    FileUploadComponent,
    SetsEditComponent,
    SimpleListItemComponent,
    FormControlComponent,
  ],
  imports: [
    SharedModule,
    AdminRoutingModule,
    NgScrollbarModule
  ]
})
export class AdminModule { }
