import { UserRole } from "./user.model";

export class DbUser {
  constructor(
    public id: string,
    public username: string,
    public role: UserRole,
    public currentAvatarId: number,
    public currentDeckId: number,
    public decks: number[],
    public ownedAvatars: number[],
    public ownedPacks: number[],
    public ownedCards: number[],
    public ownedSleeves: number[],
    public coins: number,
    public winCount: number,
    public lossCount: number,
  ) {}
}