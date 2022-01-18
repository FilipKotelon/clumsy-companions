import { Card } from "../cards/cards.types";

export interface Deck {
  id: string;
  cards: Card[];
  name: string;
  deckImgUrl: string;
  sleeveImgUrl: string;
}