import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './game.component';

let routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: GameComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class GameRoutingModule {}