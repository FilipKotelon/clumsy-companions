import { LoggedInGuard } from '@core/auth/guards/logged-in.guard';
import { NotLoggedInGuard } from '@core/auth/guards/not-logged-in.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '@core/auth/guards/admin.guard';

let routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('@home/home.module').then(m => m.HomeModule),
    data: {
      anmimation: '1'
    }
  },
  {
    path: 'admin',
    loadChildren: () => import('@admin/admin.module').then(m => m.AdminModule),
    canActivate: [AdminGuard],
    data: {
      anmimation: '2'
    }
  },
  {
    path: 'auth',
    loadChildren: () => import('@auth/auth.module').then(m => m.AuthModule),
    canActivate: [NotLoggedInGuard],
    data: {
      anmimation: '3'
    }
  },
  {
    path: 'hub',
    loadChildren: () => import('@hub/hub.module').then(m => m.HubModule),
    canActivate: [LoggedInGuard],
    data: {
      anmimation: '4'
    }
  },
  {
    path: 'game',
    loadChildren: () => import('@game/game.module').then(m => m.GameModule),
    canActivate: [LoggedInGuard],
    data: {
      anmimation: '5'
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}