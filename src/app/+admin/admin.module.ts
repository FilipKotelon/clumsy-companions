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
import { AdminItemWrapperComponent } from './components/admin-item-wrapper/admin-item-wrapper.component';
import { CardsEditComponent } from './pages/cards/cards-edit/cards-edit.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { SetsEditComponent } from './pages/sets/sets-edit/sets-edit.component';
import { SimpleListItemComponent } from './components/simple-list-item/simple-list-item.component';
import { AdminCardEffectWrapperComponent } from './components/admin-card-effect-wrapper/admin-card-effect-wrapper.component';
import { AdminControlWrapperComponent } from './components/admin-control-wrapper/admin-control-wrapper.component';
import { AdminEditEffectComponent } from './components/admin-edit-effect/admin-edit-effect.component';
import { AdminShopItemWrapperComponent } from './components/admin-shop-item-wrapper/admin-shop-item-wrapper.component';
import { PacksEditComponent } from './pages/packs/packs-edit/packs-edit.component';
import { DecksComponent } from './pages/decks/decks.component';
import { SleevesEditComponent } from './pages/sleeves/sleeves-edit/sleeves-edit.component';
import { AvatarsEditComponent } from './pages/avatars/avatars-edit/avatars-edit.component';
import { AiOpponentsEditComponent } from './pages/ai-opponents/ai-opponents-edit/ai-opponents-edit.component';

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
    AdminItemWrapperComponent,
    CardsEditComponent,
    FileUploadComponent,
    SetsEditComponent,
    SimpleListItemComponent,
    AdminCardEffectWrapperComponent,
    AdminControlWrapperComponent,
    AdminEditEffectComponent,
    AdminShopItemWrapperComponent,
    PacksEditComponent,
    DecksComponent,
    SleevesEditComponent,
    AvatarsEditComponent,
    AiOpponentsEditComponent,
  ],
  imports: [
    SharedModule,
    AdminRoutingModule,
    NgScrollbarModule
  ]
})
export class AdminModule { }
