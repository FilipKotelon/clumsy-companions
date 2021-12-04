import { HubRoutingModule } from './hub-routing.module'
import { SharedModule } from '@shared/shared.module'
import { NgModule } from '@angular/core';
import { HubComponent } from './hub.component';



@NgModule({
  declarations: [
    HubComponent
  ],
  imports: [
    SharedModule,
    HubRoutingModule
  ]
})
export class HubModule { }
