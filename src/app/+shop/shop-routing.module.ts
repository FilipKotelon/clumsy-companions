import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PacksComponent } from './pages/packs/packs.component';
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