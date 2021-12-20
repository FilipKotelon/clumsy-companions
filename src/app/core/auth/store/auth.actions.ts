import { User, UserRole } from '@core/auth/auth.types';
import { Action } from '@ngrx/store';

export const LOGIN_START = '[Auth] Login Start';
export const SIGNUP_START = '[Auth] Signup Start';
export const AUTH_SUCCESS = '[Auth] Auth Success';
export const AUTO_LOGIN = '[Auth] Auto Login';
export const LOGOUT = '[Auth] Logout';
export const REFRESH_TOKEN = '[Auth] Refresh Token';

export interface UserLoginData {
  email: string;
  password: string;
}

export interface UserRegisterData extends UserLoginData {
  username: string;
}

export interface UserFullData {
  id: string;
  username: string;
  email: string;
  token: string;
  role: UserRole;
  expirationDate: Date;
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

export interface AuthSuccessFullData {
  user: UserFullData;
  redirectTo?: string;
}

export interface AuthSuccessData {
  user: User;
  redirectTo?: string;
}

export interface RefreshTokenData {
  token: string;
  expirationTime: Date;
}

export type AuthActions = LoginStart | SignUpStart | AuthSuccess | AutoLogin | Logout | RefreshToken;

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor( public payload: UserLoginData ){}
}

export class SignUpStart implements Action {
  readonly type = SIGNUP_START;

  constructor( public payload: UserRegisterData ){}
}

export class AuthSuccess implements Action {
  readonly type = AUTH_SUCCESS;

  constructor(public payload: AuthSuccessData) {}
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;

  constructor(public payload?: UserFullData) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class RefreshToken implements Action {
  readonly type = REFRESH_TOKEN;

  constructor(public payload: RefreshTokenData) {}
}