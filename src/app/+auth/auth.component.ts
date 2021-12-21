import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { filter} from 'rxjs/operators';

import { AuthService } from '@core/auth/auth.service';
import { AuthType } from '@core/auth/auth.types';
import { fadeInOut } from '@shared/animations/component-animations';

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
    private authSvc: AuthService
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

  handleLogin = (email: string, password: string): void => {
    this.authSvc.logIn(email, password);
  }

  handleSignUp = (username: string, email: string, password: string): void => {
    this.authSvc.signUp(username, email, password);
  }

  handleResetPassword = (email: string): void => {
    this.authSvc.resetPassword(email);
  }

  handleValidationError = (): void => {
    const email = this.authForm.get('email')?.value;
    const password = this.authForm.get('password')?.value;
    const username = this.authForm.get('username')?.value;

    this.authSvc.handleValidationError(email, password, username, this.curAuthType);
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

  validatePassword = (control: FormControl): ValidationErrors => {
    if(!this.passwordRegex.test(control.value)){
      return {'passwordIncorrect': true}
    }
    return null;
  }
}
