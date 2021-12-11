import { AdminRoutingModule } from './admin-routing.module'
import { SharedModule } from '@shared/shared.module'
import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { NavComponent } from './components/nav/nav.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AdminCardComponent } from './components/admin-card/admin-card.component';
import { CardsComponent } from './pages/cards/cards.component';
import { SetsComponent } from './pages/sets/sets.component';
import { PacksComponent } from './pages/packs/packs.component';
import { AvatarsComponent } from './pages/avatars/avatars.component';
import { SleevesComponent } from './pages/sleeves/sleeves.component';
import { PlayersComponent } from './pages/players/players.component';
import { AiOpponentsComponent } from './pages/ai-opponents/ai-opponents.component';



@NgModule({
  declarations: [
    AdminComponent,
    NavComponent,
    SidebarComponent,
    WelcomeComponent,
    AdminCardComponent,
    CardsComponent,
    SetsComponent,
    PacksComponent,
    AvatarsComponent,
    SleevesComponent,
    PlayersComponent,
    AiOpponentsComponent
  ],
  imports: [
    SharedModule,
    AdminRoutingModule,
    NgScrollbarModule
  ]
})
export class AdminModule { }
