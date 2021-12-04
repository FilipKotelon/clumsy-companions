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
    component: AuthComponent
  },
  {
    path: 'sign-up',
    component: AuthComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule {}