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
