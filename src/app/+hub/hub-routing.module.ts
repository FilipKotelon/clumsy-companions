import { HubComponent } from './hub.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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