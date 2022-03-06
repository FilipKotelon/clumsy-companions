import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AvatarsComponent } from './pages/avatars/avatars.component';

import { PacksComponent } from './pages/packs/packs.component';
import { SleevesComponent } from './pages/sleeves/sleeves.component';
import { ShopComponent } from './shop.component';

let routes: Routes = [
  {
    path: '',
    component: ShopComponent,
    data: {
      animation: '1'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'packs'
      },
      {
        path: 'packs',
        component: PacksComponent,
        data: {
          animation: '11'
        }
      },
      {
        path: 'avatars',
        component: AvatarsComponent,
        data: {
          animation: '12'
        }
      },
      {
        path: 'sleeves',
        component: SleevesComponent,
        data: {
          animation: '13'
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
export class ShopRoutingModule {}