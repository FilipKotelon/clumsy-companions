import { HubRoutingModule } from './hub-routing.module';
import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { HubComponent } from './hub.component';
import { NavComponent } from './components/nav/nav.component';



@NgModule({
  declarations: [
    HubComponent,
    NavComponent
  ],
  imports: [
    SharedModule,
    HubRoutingModule
  ]
})
export class HubModule { }
