export class Player {
  constructor(
    public username: string,
    public currentAvatarId: string,
    public currentDeckId: string,
    public decksIds: string[],
    public ownedAvatarsIds: string[],
    public ownedPacksIds: string[],
    public ownedCardsIds: string[],
    public ownedSleevesIds: string[],
    public coins: number,
    public winCount: number,
    public lossCount: number
  ) {}
}

export const PLAYER_SETTINGS = {
  BASE_ENERGY: 20,
  BASE_FOOD: 0,
  BASE_CARDS_IN_HAND: 7
}
