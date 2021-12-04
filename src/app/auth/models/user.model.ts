export enum UserRole {
  Admin = 'admin',
  Player = 'player'
}

export class User {
  constructor(
    public email: string,
    public id: string,
    public role: UserRole,
    private _token: string,
    private _tokenExpirationDate: Date,
    public currentAvatarId: string,
    public currentDeckId: string,
    public decks: string[],
    public ownedAvatars: string[],
    public ownedPacks: string[],
    public ownedCards: string[],
    public ownedSleeves: string[],
    public coins: number,
    public winCount: number,
    public lossCount: number,
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }

  get tokenExpirationDate() {
    return this._tokenExpirationDate;
  }
}