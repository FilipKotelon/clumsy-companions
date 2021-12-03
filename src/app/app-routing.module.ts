import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

let routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('@home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('@admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('@auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'core',
    loadChildren: () => import('@core/core.module').then(m => m.CoreModule)
  },
  {
    path: 'decks',
    loadChildren: () => import('@decks/decks.module').then(m => m.DecksModule)
  },
  {
    path: 'hub',
    loadChildren: () => import('@hub/hub.module').then(m => m.HubModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}