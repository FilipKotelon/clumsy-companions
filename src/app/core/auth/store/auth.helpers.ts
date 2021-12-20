import { LoadingTask } from '@core/loading/loading.types';
import { Player } from '@core/player/player.types';
import { Store, Action } from '@ngrx/store';
import { User, UserRole } from '@core/auth/auth.types';
import { AuthSuccessFullData } from './auth.actions';
import { Observable, of } from 'rxjs';

import * as AuthActions from '@core/auth/store/auth.actions';
import * as MessageActions from '@core/message/store/message.actions';
import * as LoadingActions from '@core/loading/store/loading.actions';
import * as PlayerActions from '@core/player/store/player.actions';

export const handleError = (error, store: Store, task: LoadingTask = 'AUTH_PROCESS', dispatchMsg: boolean = false): Observable<MessageActions.Error> => {
  let msg = 'An error occurred. Please try again later.';
  console.log(error);

  if(!error.code){
    return of(new MessageActions.Error(msg))
  }

  switch(error.code){
    case 'auth/email-already-exists':
      msg = 'An account with this email already exists.';
      break;
    case 'auth/internal-error':
      msg = 'An internal error has occured. Please try again later.';
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
    new LoadingActions.AppLoadingRemove(task)
  );

  if(dispatchMsg){
    store.dispatch(new MessageActions.Error(msg));

    return;
  }

  return of(new MessageActions.Error(msg))
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

  localStorage.setItem('loggedInUser', JSON.stringify(user));

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