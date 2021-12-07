export class Player {
  constructor(
    public username: string,
    public currentAvatarId: string,
    public currentDeckId: string,
    public decks: string[],
    public ownedAvatars: string[],
    public ownedPacks: string[],
    public ownedCards: string[],
    public ownedSleeves: string[],
    public coins: number,
    public winCount: number,
    public lossCount: number
  ) {}
}