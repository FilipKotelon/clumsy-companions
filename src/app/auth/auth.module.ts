import { SharedModule } from '@shared/shared.module'
import { NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';



@NgModule({
  declarations: [
    AuthComponent
  ],
  imports: [
    SharedModule
  ]
})
export class AuthModule { }
