import { AngularFirestore, CollectionReference, Query } from '@angular/fire/compat/firestore'
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { fadeInOut } from '@shared/animations/component-animations'
import * as AuthActions from '@auth/store/auth.actions'
import * as AppMsgActions from '@app/store/app-msg.actions'
import * as fromApp from '@app/store/app.reducer'
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';
import { DbUser } from './models/db-user.model';
import { Observable } from 'rxjs';

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
    private fireStore: AngularFirestore
  ) { }

  ngOnInit(): void {
    if(this.router.url.includes('log-in')){
      this.curAuthType = AuthType.LogIn;
    } else {
      this.curAuthType = AuthType.SignUp;
    }

    this.initForm();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((e) => {
      if(e instanceof NavigationEnd){
        if(e.url.includes('log-in')){
          this.curAuthType = AuthType.LogIn;
        } else {
          this.curAuthType = AuthType.SignUp;
        }

        this.initForm();
      }
    });
  }

  onSubmit = () => {
    if(this.authForm.valid){
      this.handleSubmit();
    } else {
      this.handleError();
    }
  }

  handleSubmit = () => {
    const email = this.authForm.get('email')?.value;
    const password = this.authForm.get('password')?.value;

    if(email && password){
      if(this.curAuthType === AuthType.LogIn){
        this.store.dispatch(
          new AuthActions.LoginStart({ email, password })
        )
      } else if(this.curAuthType === AuthType.SignUp){
        const username = this.authForm.get('username')?.value;
        
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
      }
    } else {
      this.store.dispatch(
        new AppMsgActions.AppError('Email and password were not provided.')
      )
    }
  }

  handleError = () => {
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
    } else {
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

  initForm = () => {
    if(this.curAuthType === AuthType.LogIn){
      this.authForm = new FormGroup({
        'email': new FormControl(null, [Validators.required, Validators.email]),
        'password': new FormControl(null, [Validators.required, this.validatePassword]),
      })
    } else {
      this.authForm = new FormGroup({
        'username': new FormControl(null, [Validators.required]),
        'email': new FormControl(null, [Validators.required, Validators.email]),
        'password': new FormControl(null, [Validators.required, this.validatePassword]),
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
