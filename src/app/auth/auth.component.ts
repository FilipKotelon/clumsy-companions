import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as AuthActions from '@auth/store/auth.actions'
import * as AppMsgActions from '@app/store/app-msg.actions'
import * as fromApp from '@app/store/app.reducer'
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

export enum AuthType {
  LogIn,
  SignUp
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  curAuthType: AuthType;
  contactForm: FormGroup;

  /**
   * Assigned to a property so I can access it in the template
   */
  allAuthTypes = AuthType;

  /**
   * The most basic password requirement for firebase, which should be 6 characters long.
   */
  passwordRegex = /^.{6,}$/;
  // passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

  constructor(protected router: Router, private store: Store<fromApp.AppState>) { }

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
    if(this.contactForm.valid){
      this.handleSubmit();
    } else {
      this.handleError();
    }
  }

  handleSubmit = () => {
    const email = this.contactForm.get('email')?.value;
    const password = this.contactForm.get('password')?.value;

    if(email && password){
      if(this.curAuthType === AuthType.LogIn){
        this.store.dispatch(
          new AuthActions.LoginStart({ email, password })
        )
      } else if(this.curAuthType === AuthType.SignUp){
        const username = this.contactForm.get('username')?.value;
        
        this.store.dispatch(
          new AuthActions.SignUpStart({ email, password, username })
        )
      }
    } else {
      this.store.dispatch(
        new AppMsgActions.AppError('Email and password were not provided.')
      )
    }
  }

  handleError = () => {
    const email = this.contactForm.get('email')?.value;
    const password = this.contactForm.get('password')?.value;

    if(!email && !password){
      this.store.dispatch(
        new AppMsgActions.AppError('Please provide your email and password.')
      )
    } else {
      this.store.dispatch(
        new AppMsgActions.AppError('Please check if you provided the correct email and password.')
      )
    }
  }

  initForm = () => {
    if(this.curAuthType === AuthType.LogIn){
      this.contactForm = new FormGroup({
        'email': new FormControl(null, [Validators.required, Validators.email]),
        'password': new FormControl(null, [Validators.required, this.validatePassword]),
      })
    } else {
      this.contactForm = new FormGroup({
        'username': new FormControl(null, [Validators.required]),
        'email': new FormControl(null, [Validators.required, Validators.email]),
        'password': new FormControl(null, [Validators.required, this.validatePassword]),
      })
    }
  }

  validatePassword = (control: FormControl): ValidationErrors => {
    if(!this.passwordRegex.test(control.value)){
      return {'passwordIncorrect': true}
    }
    return null;
  }
}
