import { ShopProduct, ShopProductMainData } from '@core/shop/shop.types';

export interface AvatarMainData extends ShopProductMainData {}

export interface Avatar extends ShopProduct {}

export interface AvatarQueryParams {
  ids?: string[];
  names?: string[];
  visibleInShop?: boolean;
}
