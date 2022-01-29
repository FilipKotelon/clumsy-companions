import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SetsEditComponent } from './pages/sets/sets-edit/sets-edit.component';
import { CardsEditComponent } from './pages/cards/cards-edit/cards-edit.component';
import { AiOpponentsComponent } from './pages/ai-opponents/ai-opponents.component';
import { PlayersComponent } from './pages/players/players.component';
import { SleevesComponent } from './pages/sleeves/sleeves.component';
import { AvatarsComponent } from './pages/avatars/avatars.component';
import { PacksComponent } from './pages/packs/packs.component';
import { SetsComponent } from './pages/sets/sets.component';
import { CardsComponent } from './pages/cards/cards.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { AdminComponent } from './admin.component';
import { PacksEditComponent } from './pages/packs/packs-edit/packs-edit.component';
import { DecksComponent } from './pages/decks/decks.component';
import { SleevesEditComponent } from './pages/sleeves/sleeves-edit/sleeves-edit.component';
import { AvatarsEditComponent } from './pages/avatars/avatars-edit/avatars-edit.component';
import { AiOpponentsEditComponent } from './pages/ai-opponents/ai-opponents-edit/ai-opponents-edit.component';

let routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: WelcomeComponent,
        data: {
          animation: '1'
        }
      },
      {
        path: 'cards',
        data: {
          animation: '2'
        },
        children: [
          {
            path: '',
            pathMatch: 'full',
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
        data: {
          animation: '3'
        },
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: SetsComponent,
            data: {
              animation: '31'
            }
          },
          {
            path: 'new',
            component: SetsEditComponent,
            data: {
              animation: '32'
            }
          },
          {
            path: 'edit/:id',
            component: SetsEditComponent,
            data: {
              animation: '33'
            }
          },
        ]
      },
      {
        path: 'packs',
        data: {
          animation: '4'
        },
        children: [
          {
            path: '',
            component: PacksComponent,
            pathMatch: 'full',
            data: {
              animation: '41'
            },
          },
          {
            path: 'new',
            component: PacksEditComponent,
            data: {
              animation: '42'
            },
          },
          {
            path: 'edit/:id',
            component: PacksEditComponent,
            data: {
              animation: '43'
            }
          },
        ]
      },
      {
        path: 'avatars',
        data: {
          animation: '5'
        },
        children: [
          {
            path: '',
            component: AvatarsComponent,
            pathMatch: 'full',
            data: {
              animation: '51'
            },
          },
          {
            path: 'new',
            component: AvatarsEditComponent,
            data: {
              animation: '52'
            },
          },
          {
            path: 'edit/:id',
            component: AvatarsEditComponent,
            data: {
              animation: '53'
            }
          },
        ]
      },
      {
        path: 'sleeves',
        data: {
          animation: '6'
        },
        children: [
          {
            path: '',
            component: SleevesComponent,
            pathMatch: 'full',
            data: {
              animation: '61'
            },
          },
          {
            path: 'new',
            component: SleevesEditComponent,
            data: {
              animation: '62'
            },
          },
          {
            path: 'edit/:id',
            component: SleevesEditComponent,
            data: {
              animation: '63'
            }
          },
        ]
      },
      {
        path: 'players',
        component: PlayersComponent,
        data: {
          animation: '7'
        }
      },
      {
        path: 'ai-opponents',
        data: {
          animation: '8'
        },
        children: [
          {
            path: '',
            component: AiOpponentsComponent,
            pathMatch: 'full',
            data: {
              animation: '81'
            },
          },
          {
            path: 'new',
            component: AiOpponentsEditComponent,
            data: {
              animation: '82'
            },
          },
          {
            path: 'edit/:id',
            component: AiOpponentsEditComponent,
            data: {
              animation: '83'
            },
          },
        ]
      },
      {
        path: 'decks',
        data: {
          animation: '9'
        },
        children: [
          {
            path: '',
            component: DecksComponent,
            pathMatch: 'full',
            data: {
              animation: '91'
            }
          },
          {
            path: 'new',
            loadChildren: () => import('@decks/decks.module').then(m => m.DecksModule),
            data: {
              animation: '92'
            }
          },
          {
            path: 'edit/:id',
            loadChildren: () => import('@decks/decks.module').then(m => m.DecksModule),
            data: {
              animation: '93'
            }
          }
        ]
      }
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