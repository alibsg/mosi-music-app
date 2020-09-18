import { Action } from '@ngrx/store';

export const LOGIN_START = '[Auth] login start';
export const SIGNUP_START = '[Auth] signup start';
export const LOGIN_SIGNUP_FAILED = '[Auth] login/signup failed';
export const LOGIN_SUCCESS = '[Auth] login success';
export const SIGNUP_SUCCESS = '[Auth] signup success';
export const SET_USER_INFO = '[Auth] set user info';
export const LOGOUT = '[Auth] logout';
export const AUTO_LOGIN = '[Auth] auto login';

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: {
    email: string,
    password: string,
  }) {}
}

export class SignupStart implements Action {
  readonly type = SIGNUP_START;

  constructor(public payload: {
    firstname: string,
    lastname: string,
    email: string,
    password: string,
  }) {}
}

export class AuthenticationFailed implements Action {
  readonly type = LOGIN_SIGNUP_FAILED;

  constructor(public payload: string) { }
}

export class SignupSuccess implements Action {
  readonly type = SIGNUP_SUCCESS;

  constructor(public payload: {
    firstname: string,
    lastname: string,
    email: string,
    localId: string,
    idToken: string,
    expirationDate: Date
  }) {}
}

export class LoginSuccess implements Action {
  readonly type = LOGIN_SUCCESS;

  constructor(public payload: {
    email: string,
    localId: string,
    idToken: string,
    expirationDate: Date,
    redirect: boolean,
  }) {}
}

export class SetUserInfo implements Action {
  readonly type = SET_USER_INFO;

  constructor(public payload: {
    firstname: string,
    lastname: string,
    role: string,
  }) { }
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export type AuthActions = LoginStart | SignupStart | AuthenticationFailed | LoginSuccess | SignupSuccess | SetUserInfo | Logout;
