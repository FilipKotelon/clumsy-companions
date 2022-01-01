import { Component, Input } from '@angular/core';
import { ShopProduct } from '@app/core/shop/shop.types';

@Component({
  selector: 'app-admin-shop-item-wrapper',
  templateUrl: './admin-shop-item-wrapper.component.html',
  styleUrls: ['./admin-shop-item-wrapper.component.scss']
})
export class AdminShopItemWrapperComponent {
  @Input() shopProduct: ShopProduct;
}
