import { Player } from '@hub/models/player.model'
import { Store, Action } from '@ngrx/store'
import { User } from './../models/user.model'
import { AuthSuccessFullData } from './auth.actions'
import { of } from "rxjs";

import { UserRole } from '../models/user.model'

import * as AuthActions from '@auth/store/auth.actions'
import * as AppMsgActions from '@app/store/msg/app-msg.actions'
import * as AppLoadingActions from '@app/store/loading/app-loading.actions'
import * as PlayerActions from '@hub/store/player/player.actions';

export const handleError = (error, store: Store) => {
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

  store.dispatch(
    new AppLoadingActions.AppLoadingRemove('AUTH_PROCESS')
  );

  return of(new AppMsgActions.AppError(msg))
}

export const handleAuthSuccess = (data: AuthSuccessFullData): Action[] => {
  const user = new User(
    data.user.email,
    data.user.id,
    data.user.role,
    data.user.token,
    data.user.expirationDate
  );

  const player = new Player(
    data.user.username,
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
  )

  localStorage.setItem('loggedInUser', JSON.stringify(data.user));

  return [
    new AuthActions.AuthSuccess({
      user,
      redirectTo: data.redirectTo
    }),
    new PlayerActions.PlayerSet(player)
  ]
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
    _tokenExpirationDate: string
  } = JSON.parse(savedUser);

  const user = new User(
    userData.email,
    userData.id,
    userData.role,
    userData._token,
    new Date(userData._tokenExpirationDate)
  )

  //Token will return null if the token expired
  if(!user.token){
    localStorage.removeItem('loggedInUser');

    return null;
  }

  return user;
}