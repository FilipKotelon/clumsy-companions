import { CardType } from '@shared/components/card/models/card.model'

export interface CardQueryParams {
  search?: string;
  set?: string;
  type?: CardType;
}