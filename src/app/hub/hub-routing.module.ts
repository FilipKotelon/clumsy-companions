import { HubComponent } from './hub.component'
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

let routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HubComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class HubRoutingModule {}