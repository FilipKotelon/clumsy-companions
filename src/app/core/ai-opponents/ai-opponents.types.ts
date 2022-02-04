export interface AIOpponentMainData {
  name: string;
  coinsReward: number;
  avatarId: string;
  deckId: string;
  difficulty: string;
  rewardPackId: string;
  playable: boolean;
}

export interface AIOpponent extends AIOpponentMainData {
  id: string;
}

export interface AIOpponentWithThumbnail extends AIOpponent {
  imgUrl: string;
}

export interface AIOpponentQueryParams {
  playable?: boolean;
}
