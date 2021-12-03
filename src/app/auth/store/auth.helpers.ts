import { User } from './../models/user.model'
import { AuthSuccessData } from './auth.actions'
import { of } from "rxjs";

import { UserRole } from '../models/user.model'
import * as AuthActions from '@auth/store/auth.actions'
import * as AppMsgActions from '@app/store/app-msg.actions'

export const handleError = (error) => {
  let msg = 'An error occurred. Try again later.';
  console.log(error);

  if(!error.code){
    return of(new AppMsgActions.AppError(msg))
  }

  switch(error.code){
    case 'auth/email-already-exists':
      msg = 'An account with this email already exists.';
      break;
    case 'auth/internal-error':
      msg = 'An internal error has occured. Try again later.';
      break;
    case 'auth/invalid-email':
      msg = 'This email is not valid.';
      break;
    case 'auth/invalid-password':
      msg = 'The password must contain at least 6 characters.';
      break;
    case 'auth/wrong-password':
      msg = 'The password for this account is not correct.';
      break;
    case 'auth/user-not-found':
      msg = 'No user found for this email.';
      break;
  }

  return of(new AppMsgActions.AppError(msg))
}

export const handleAuthSuccess = (data: AuthSuccessData) => {
  const user = new User(
    data.user.email,
    data.user.userId,
    data.user.role,
    data.user.token,
    data.user.expirationDate,
    data.user.currentAvatarId,
    data.user.currentDeckId,
    data.user.decks,
    data.user.ownedAvatars,
    data.user.ownedPacks,
    data.user.ownedCards,
    data.user.ownedSleeves,
    data.user.coins,
    data.user.winCount,
    data.user.lossCount
  );

  localStorage.setItem('loggedInUser', JSON.stringify(user));

  return new AuthActions.AuthSuccess({
    user: {
      ...data.user
    },
    redirectTo: data.redirectTo
  })
}

export const getLocalStorageUser = (): User => {
  const savedUser = localStorage.getItem('loggedInUser');

  if(!savedUser){
    return null;
  }

  const userData : {
    email: string,
    id: string,
    role: UserRole,
    _token: string,
    _tokenExpirationDate: string,
    currentAvatarId: number,
    currentDeckId: number,
    decks: number[],
    ownedAvatars: number[],
    ownedPacks: number[],
    ownedCards: number[],
    ownedSleeves: number[],
    coins: number,
    winCount: number,
    lossCount: number
  } = JSON.parse(savedUser);

  const user = new User(
    userData.email,
    userData.id,
    userData.role,
    userData._token,
    new Date(userData._tokenExpirationDate),
    userData.currentAvatarId,
    userData.currentDeckId,
    userData.decks,
    userData.ownedAvatars,
    userData.ownedPacks,
    userData.ownedCards,
    userData.ownedSleeves,
    userData.coins,
    userData.winCount,
    userData.lossCount
  )

  //Token will return null if the token expired
  if(!user.token){
    localStorage.removeItem('loggedInUser');

    return null;
  }

  return user;
}