import { AdminRoutingModule } from './admin-routing.module'
import { SharedModule } from '@shared/shared.module'
import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { NavComponent } from './components/nav/nav.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { NgScrollbarModule } from 'ngx-scrollbar';



@NgModule({
  declarations: [
    AdminComponent,
    NavComponent,
    SidebarComponent,
    WelcomeComponent
  ],
  imports: [
    SharedModule,
    AdminRoutingModule,
    NgScrollbarModule
  ]
})
export class AdminModule { }
