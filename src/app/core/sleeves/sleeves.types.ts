import { ShopProduct, ShopProductMainData } from '@core/shop/shop.types';

export interface SleeveMainData extends ShopProductMainData {}

export interface Sleeve extends ShopProduct {}

export interface SleeveQueryParams {
  ids?: string[];
  visibleInShop?: boolean;
}
