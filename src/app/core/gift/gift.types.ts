import { Avatar } from '@core/avatars/avatars.types';
import { Card } from '@core/cards/cards.types';
import { Deck } from '@core/decks/decks.types';
import { Pack } from '@core/packs/packs.types';

export interface Gift {
  title: string;
  description?: string;
  avatar?: Avatar;
  cards?: Card[];
  coins?: number;
  decks?: Deck[];
  packs?: Pack[];
}

export interface WelcomeBundle {
  decksGift: {
    title: string;
    description: string;
    decks: Deck[];
  },
  coinsGift: {
    title: string;
    description: string;
    coins: number;
  },
  avatarGift: {
    title: string;
    description: string;
    avatar: Avatar;
  }
}
