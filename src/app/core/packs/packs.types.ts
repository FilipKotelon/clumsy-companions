import { ShopProduct, ShopProductMainData } from '@core/shop/shop.types';

export interface PackMainData extends ShopProductMainData {
  readonly setId: string;
}

export interface Pack extends ShopProduct {
  readonly setId: string;
}

export interface PackWithAmount extends Pack {
  readonly amount: number;
}

export const PACKS_SETTINGS = {
  CARDS_IN_PACK: 3
}