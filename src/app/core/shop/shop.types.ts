export interface ShopProductMainData {
  readonly name: string
  readonly imgUrl: string
  readonly price: number
  readonly visibleInShop: boolean
}

export interface ShopProduct extends ShopProductMainData {
  readonly id: string
}