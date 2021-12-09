import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/compat/firestore'
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { DbUser } from './models/db-user.model';
import { fadeInOut } from '@shared/animations/component-animations'

import * as fromApp from '@app/store/app.reducer'
import * as AuthActions from '@auth/store/auth.actions'
import * as AppMsgActions from '@app/store/msg/app-msg.actions'
import * as AppLoadingActions from '@app/store/loading/app-loading.actions';
import * as AuthHelpers from '@auth/store/auth.helpers';

export enum AuthType {
  LogIn,
  SignUp,
  ResetPassword
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  animations: [
    fadeInOut
  ]
})
export class AuthComponent implements OnInit {
  curAuthType: AuthType;
  authForm: FormGroup;

  /**
   * Assigned to a property so I can access it in the template
   */
  allAuthTypes = AuthType;

  /**
   * The most basic password requirement for firebase, which should be 6 characters long.
   */
  passwordRegex = /^.{6,}$/;
  // passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

  constructor(
    private router: Router, 
    private store: Store<fromApp.AppState>,
    private fireStore: AngularFirestore,
    private fireAuth: AngularFireAuth
  ) { }

  ngOnInit(): void {
    this.curAuthType = this.getAuthType(this.router.url);
    this.initForm();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((e) => {
      if(e instanceof NavigationEnd){
        this.curAuthType = this.getAuthType(e.url);
        this.initForm();
      }
    });
  }

  getAuthType = (url: string): AuthType => {
    if(url.includes('log-in')){
      return AuthType.LogIn;
    } else if(url.includes('sign-up')) {
      return AuthType.SignUp;
    } else if(url.includes('reset-password')) {
      return AuthType.ResetPassword;
    }
  }

  onSubmit = (): void => {
    if(this.authForm.valid){
      this.handleSubmit();
    } else {
      this.handleValidationError();
    }
  }

  handleSubmit = (): void => {
    const email = this.authForm.get('email')?.value;
    let password;

    if(this.curAuthType !== AuthType.ResetPassword){
      password = this.authForm.get('password')?.value;
    }

    if(this.curAuthType === AuthType.LogIn){

      this.handleLogin(email, password);

    } else if(this.curAuthType === AuthType.SignUp){

      const username = this.authForm.get('username')?.value;
      this.handleSignUp(username, email, password);

    } else if(this.curAuthType === AuthType.ResetPassword){
      
      this.handleResetPassword(email);

    }
  }

  handleValidationError = (): void => {
    const email = this.authForm.get('email')?.value;
    const password = this.authForm.get('password')?.value;
    const username = this.authForm.get('username')?.value;

    if(this.curAuthType === AuthType.LogIn){
      if(!email || !password){
        this.store.dispatch(
          new AppMsgActions.AppError('Please provide your email and password.')
        )
      } else {
        this.store.dispatch(
          new AppMsgActions.AppError('Please check if you provided the correct email and password.')
        )
      }
    } else if(this.curAuthType === AuthType.SignUp){
      if(!email || !password || !username){
        this.store.dispatch(
          new AppMsgActions.AppError('Please provide your username, email and password.')
        )
      } else {
        this.store.dispatch(
          new AppMsgActions.AppError('Please check if you provided a correct username, email and password.')
        )
      }
    } else if(this.curAuthType === AuthType.ResetPassword) {
      if(!email){
        this.store.dispatch(
          new AppMsgActions.AppError('Please provide your email.')
        )
      } else {
        this.store.dispatch(
          new AppMsgActions.AppError('Please check if you provided the correct email.')
        )
      }
    }
  }

  handleLogin = (email: string, password: string): void => {
    if(email && password){
      this.store.dispatch(
        new AuthActions.LoginStart({ email, password })
      )
    } else {
      this.store.dispatch(
        new AppMsgActions.AppError('Email, password or both were not provided.')
      )
    }
  }

  handleSignUp = (username: string, email: string, password: string): void => {
    if(username && email && password) {
      this.checkForSameUsername(username).subscribe(canCreate => {
        if(canCreate){
          this.store.dispatch(
            new AuthActions.SignUpStart({ email, password, username })
          )
        } else {
          this.store.dispatch(
            new AppMsgActions.AppError('This username is already in use :c Sorry if u spent an hour making up a cool username.')
          )
        }
      });
    } else {
      this.store.dispatch(
        new AppMsgActions.AppError('Email, password, username or all of the above were not provided.')
      )
    }
  }

  handleResetPassword = (email: string): void => {
    this.store.dispatch(
      new AppLoadingActions.AppLoadingAdd('AUTH_PASSWORD_RESET_REQUEST')
    );

    this.fireAuth.sendPasswordResetEmail(email)
      .then(() => {
        this.store.dispatch(
          new AppLoadingActions.AppLoadingRemove('AUTH_PASSWORD_RESET_REQUEST')
        );

        this.store.dispatch(
          new AppMsgActions.AppInfo('Password reset link has been sent to the email you provided.')
        );
      })
      .catch(e => {
        AuthHelpers.handleError(e, this.store, 'AUTH_PASSWORD_RESET_REQUEST', true);
      })
  }

  initForm = (): void => {
    if(this.curAuthType === AuthType.LogIn){
      this.authForm = new FormGroup({
        'email': new FormControl(null, [Validators.required, Validators.email]),
        'password': new FormControl(null, [Validators.required, this.validatePassword]),
      })
    } else if(this.curAuthType === AuthType.SignUp) {
      this.authForm = new FormGroup({
        'username': new FormControl(null, [Validators.required]),
        'email': new FormControl(null, [Validators.required, Validators.email]),
        'password': new FormControl(null, [Validators.required, this.validatePassword]),
      })
    } else if(this.curAuthType === AuthType.ResetPassword) {
      this.authForm = new FormGroup({
        'email': new FormControl(null, [Validators.required, Validators.email]),
      })
    }
  }

  checkForSameUsername = (username: string): Observable<boolean> => {
    return this.fireStore.collection<DbUser>('users', ref => {
      let query: CollectionReference | Query = ref;
      query = query.where('username', '==', username);

      return query;
    }).get().pipe(
      take(1),
      map(users => {
        const theUsers = users.docs;

        if(theUsers.length){
          return false;
        }
        return true;
      })
    )
  }

  validatePassword = (control: FormControl): ValidationErrors => {
    if(!this.passwordRegex.test(control.value)){
      return {'passwordIncorrect': true}
    }
    return null;
  }
}
