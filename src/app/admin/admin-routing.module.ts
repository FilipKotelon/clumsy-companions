import { WelcomeComponent } from './pages/welcome/welcome.component'
import { AdminComponent } from './admin.component'
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

let routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: WelcomeComponent
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
export class AdminRoutingModule {}