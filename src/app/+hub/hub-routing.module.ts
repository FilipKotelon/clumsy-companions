import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HubComponent } from './hub.component';
import { CollectionComponent } from './pages/collection/collection.component';
import { DecksComponent } from './pages/decks/decks.component';
import { HomeComponent } from './pages/home/home.component';
import { PacksComponent } from './pages/packs/packs.component';
import { ProfileComponent } from './pages/profile/profile.component';

let routes: Routes = [
  {
    path: '',
    component: HubComponent,
    data: {
      animation: '1'
    },
    children: [
      {
        path: '',
        component: HomeComponent,
        pathMatch: 'full',
        data: {
          animation: '11'
        }
      },
      {
        path: 'shop',
        loadChildren: () => import('@shop/shop.module').then(m => m.ShopModule),
        data: {
          animation: '12'
        }
      },
      {
        path: 'packs',
        component: PacksComponent,
        data: {
          animation: '13'
        }
      },
      {
        path: 'decks',
        data: {
          animation: '14'
        },
        children: [
          {
            path: '',
            component: DecksComponent,
            pathMatch: 'full',
            data: {
              animation: '141'
            }
          },
          {
            path: 'new',
            loadChildren: () => import('@decks/decks.module').then(m => m.DecksModule),
            data: {
              animation: '142'
            }
          },
          {
            path: 'edit/:id',
            loadChildren: () => import('@decks/decks.module').then(m => m.DecksModule),
            data: {
              animation: '143'
            }
          }
        ]
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: {
          animation: '15'
        }
      },
      {
        path: 'collection',
        component: CollectionComponent,
        data: {
          animation: '16'
        }
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
export class HubRoutingModule {}