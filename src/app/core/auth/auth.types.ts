export enum UserRole {
  Admin = 'admin',
  Player = 'player'
}

export enum AuthType {
  LogIn,
  SignUp,
  ResetPassword
}

export interface DbUser {
  id: string;
  username: string;
  role: UserRole;
  currentAvatarId: string;
  currentDeckId: string;
  decks: string[];
  ownedAvatars: string[];
  ownedPacks: string[];
  ownedCards: string[];
  ownedSleeves: string[];
  coins: number;
  winCount: number;
  lossCount: number;
}

export class User {
  constructor(
    public email: string,
    public id: string,
    public role: UserRole,
    private _token: string,
    private _tokenExpirationDate: Date,
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
