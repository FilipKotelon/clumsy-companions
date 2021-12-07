import { AuthComponent } from './auth.component'
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

let routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'log-in'
  },
  {
    path: 'log-in',
    component: AuthComponent,
    data: {
      anmimation: '1'
    }
  },
  {
    path: 'sign-up',
    component: AuthComponent,
    data: {
      anmimation: '2'
    }
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule {}