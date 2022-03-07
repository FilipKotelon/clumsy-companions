export interface DeckMainData {
  cardIds: string[];
  name: string;
  thumbnailCardId: string;
  sleeveId: string;
  setId: string;
  global: boolean;
}

export interface Deck extends DeckMainData {
  id: string;
}

export interface DeckQueryParams {
  ids?: string[];
  names?: string[];
  global?: boolean;
}

export const DECK_SETTINGS = {
  MIN_CARDS: 50,
  MAX_CARDS: 80
}
