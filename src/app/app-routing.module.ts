import { LoggedInGuard } from './auth/guards/logged-in.guard'
import { NotLoggedInGuard } from './auth/guards/not-logged-in.guard'
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminGuard } from "@auth/guards/admin.guard";

let routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('@home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('@admin/admin.module').then(m => m.AdminModule),
    canActivate: [AdminGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('@auth/auth.module').then(m => m.AuthModule),
    canActivate: [NotLoggedInGuard]
  },
  {
    path: 'hub',
    loadChildren: () => import('@hub/hub.module').then(m => m.HubModule),
    canActivate: [LoggedInGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}