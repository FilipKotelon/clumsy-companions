import { ShopProduct, ShopProductMainData } from '@core/shop/shop.types';

export interface PackMainData extends ShopProductMainData {
  readonly setId: string;
}

export interface Pack extends ShopProduct {
  readonly setId: string;
}