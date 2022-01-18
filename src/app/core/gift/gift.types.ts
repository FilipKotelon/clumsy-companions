import { Card } from '@core/cards/cards.types';
import { Deck } from '@core/decks/decks.types';
import { Pack } from '@core/packs/packs.types';

export interface Gift {
  title: string;
  description?: string;
  cards?: Card[];
  coins?: number;
  decks?: Deck[];
  packs?: Pack[];
}