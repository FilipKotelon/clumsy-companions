import { SharedModule } from '@shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';



@NgModule({
  declarations: [
    HomeComponent,
    WelcomeComponent
  ],
  imports: [
    SharedModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
