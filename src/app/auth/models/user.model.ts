export enum UserRole {
  Admin = 'admin',
  Client = 'client'
}

export class User {
  constructor(
    public email: string,
    public id: string,
    public role: UserRole,
    private _token: string,
    private _tokenExpirationDate: Date,
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