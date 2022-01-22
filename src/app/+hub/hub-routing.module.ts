import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HubComponent } from './hub.component';
import { DecksComponent } from './pages/decks/decks.component';
import { PacksComponent } from './pages/packs/packs.component';

let routes: Routes = [
  {
    path: '',
    component: HubComponent,
    data: {
      animation: '1'
    },
    children: [
      {
        path: 'shop',
        loadChildren: () => import('@shop/shop.module').then(m => m.ShopModule),
        data: {
          animation: '11'
        }
      },
      {
        path: 'packs',
        component: PacksComponent,
        data: {
          animation: '12'
        }
      },
      {
        path: 'decks',
        data: {
          animation: '13'
        },
        children: [
          {
            path: '',
            component: DecksComponent,
            pathMatch: 'full',
            data: {
              animation: '131'
            }
          },
          {
            path: 'new',
            loadChildren: () => import('@decks/decks.module').then(m => m.DecksModule),
            data: {
              animation: '132'
            }
          },
          {
            path: 'edit/:id',
            loadChildren: () => import('@decks/decks.module').then(m => m.DecksModule),
            data: {
              animation: '133'
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
export class HubRoutingModule {}