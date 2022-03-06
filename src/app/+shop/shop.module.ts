import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';

import { ShopComponent } from './shop.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PacksComponent } from './pages/packs/packs.component';
import { ShopRoutingModule } from './shop-routing.module';
import { ShopItemWrapperComponent } from './components/shop-item-wrapper/shop-item-wrapper.component';
import { AvatarsComponent } from './pages/avatars/avatars.component';
import { SleevesComponent } from './pages/sleeves/sleeves.component';

@NgModule({
  declarations: [
    ShopComponent,
    SidebarComponent,
    PacksComponent,
    ShopItemWrapperComponent,
    AvatarsComponent,
    SleevesComponent
  ],
  imports: [
    SharedModule,
    ShopRoutingModule
  ]
})
export class ShopModule { }
