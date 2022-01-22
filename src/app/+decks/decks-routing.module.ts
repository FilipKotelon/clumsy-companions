import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditDeckComponent } from './pages/edit-deck/edit-deck.component';

let routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: EditDeckComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DecksRoutingModule {}