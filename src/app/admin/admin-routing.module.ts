import { CardsEditComponent } from './pages/cards/cards-edit/cards-edit.component';
import { AiOpponentsComponent } from './pages/ai-opponents/ai-opponents.component'
import { PlayersComponent } from './pages/players/players.component'
import { SleevesComponent } from './pages/sleeves/sleeves.component'
import { AvatarsComponent } from './pages/avatars/avatars.component'
import { PacksComponent } from './pages/packs/packs.component'
import { SetsComponent } from './pages/sets/sets.component'
import { CardsComponent } from './pages/cards/cards.component'
import { WelcomeComponent } from './pages/welcome/welcome.component'
import { AdminComponent } from './admin.component'
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

let routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: WelcomeComponent,
        data: {
          anmimation: '1'
        }
      },
      {
        path: 'cards',
        data: {
          anmimation: '2'
        },
        children: [
          {
            path: '',
            component: CardsComponent,
            data: {
              animation: '21'
            }
          },
          {
            path: 'new',
            component: CardsEditComponent,
            data: {
              animation: '22'
            }
          },
          {
            path: 'edit/:id',
            component: CardsEditComponent,
            data: {
              animation: '23'
            }
          }
        ]
      },
      {
        path: 'sets',
        component: SetsComponent,
        data: {
          anmimation: '3'
        }
      },
      {
        path: 'packs',
        component: PacksComponent,
        data: {
          anmimation: '4'
        }
      },
      {
        path: 'avatars',
        component: AvatarsComponent,
        data: {
          anmimation: '5'
        }
      },
      {
        path: 'sleeves',
        component: SleevesComponent,
        data: {
          anmimation: '6'
        }
      },
      {
        path: 'players',
        component: PlayersComponent,
        data: {
          anmimation: '7'
        }
      },
      {
        path: 'ai-opponents',
        component: AiOpponentsComponent,
        data: {
          anmimation: '8'
        }
      },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule {}