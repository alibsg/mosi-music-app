import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as AuthActions from './auth.actions';
import { environment } from 'src/environments/environment';
import { User } from '../user.model';
import { UserInfo } from '../userinfo.model';
import { AuthService } from '../auth.service';

export interface AuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {

  constructor(
    private action$: Actions,
    private httpClient: HttpClient,
    private authService: AuthService,
    private router: Router
  ) { }

  @Effect()
  authSignup = this.action$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((authData: AuthActions.SignupStart) => {
      return this.httpClient.post<AuthResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseConfig.apiKey}`,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }).pipe(
          map(resData => {
            const { firstname, lastname } = authData.payload;
            return this.handleUser(resData, { firstname, lastname });
          }),
          catchError(error => {
            return this.handleError(error);
          })
        );
    })
  );
  @Effect()
  authLogin = this.action$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.httpClient.post<AuthResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseConfig.apiKey}`,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }).pipe(
          map(resData => {
            return this.handleUser(resData);
          }),
          catchError(error => {
            return this.handleError(error);
          })
        );
    })
  );

  @Effect()
  loginSuccess = this.action$.pipe(
    ofType(AuthActions.LOGIN_SUCCESS),
    switchMap((userData: AuthActions.LoginSuccess) => {
      let httpParams = new HttpParams();
      httpParams = httpParams.append('orderBy', `"id"`);
      httpParams = httpParams.append('startAt', `"${userData.payload.localId}"`);
      httpParams = httpParams.append('endAt', `"${userData.payload.localId}\uf8ff"`);
      return this.httpClient.get(`${environment.firebaseConfig.databaseURL}/users.json?`, {
        params: httpParams
      }).pipe(
        map(respData => {
          const userinfoArr = [];
          for (const key in respData) {
            if (respData.hasOwnProperty(key)) {
              userinfoArr.push(respData[key]);
            }
          }
          if (userinfoArr.length === 1) {
            const { firstname, lastname, role } = userinfoArr[0];
            return new AuthActions.SetUserInfo({ firstname, lastname, role });
          } else {
            return of({ type: 'dummy' });
          }
        }),
        catchError(() => {
          return of({ type: 'dummy' });
        })
      );
    }),
    tap(() => {
      this.router.navigate(['/main']);
    })
  );

  @Effect()
  signupSuccess = this.action$.pipe(
    ofType(AuthActions.SIGNUP_SUCCESS),
    switchMap((userData: AuthActions.SignupSuccess) => {
      const { firstname, lastname, localId } = userData.payload;
      const userInfo = new UserInfo(firstname, lastname, localId);
      return this.httpClient.post(`${environment.firebaseConfig.databaseURL}/users.json?`, userInfo).pipe(
        map(() => {
          return new AuthActions.SetUserInfo({ firstname, lastname, role: '' });
        }),
        catchError(() => {
          return of({ type: 'dummy' });
        })
      );
    }),
    tap(() => {
      this.router.navigate(['/main']);
    })
  );

  @Effect({ dispatch: false })
  logout = this.action$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTime();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth/login']);
    })
  );

  @Effect()
  autoLogin = this.action$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const user: {
        email: string,
        id: string,
        _token: string,
        _tokenExpirationDate: string
      } = JSON.parse(localStorage.getItem('userData'));
      if (user) {
        const { email, id, _token, _tokenExpirationDate } = user;
        const newUser = new User(email, id, _token, new Date(_tokenExpirationDate));
        if (newUser.token) {
          const logoutAfterMs = new Date(_tokenExpirationDate).getTime() - new Date().getTime();
          this.authService.setLogoutTimer(logoutAfterMs);
          return new AuthActions.LoginSuccess({
            email: email,
            localId: id,
            idToken: _token,
            expirationDate: new Date(_tokenExpirationDate)
          });
        }
      }
      return { type: 'Dummy' };
    })
  );

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'Unknown error occurred!';
    if (errorResponse.error.error) {
      switch (errorResponse.error.error.message) {
        case 'EMAIL_EXISTS':
          errorMessage = 'The email address is already in use by another account.';
          break;
        case 'OPERATION_NOT_ALLOWED':
          errorMessage = 'Password sign-in is disabled for this project.';
          break;
        case 'TOO_MANY_ATTEMPTS_TRY_LATER':
          errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
          break;
        case 'EMAIL_NOT_FOUND':
          errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
          break;
        case 'INVALID_PASSWORD':
          errorMessage = 'The password is invalid or the user does not have a password.';
          break;
        case 'USER_DISABLED':
          errorMessage = 'The user account has been disabled by an administrator.';
          break;
        case 'WEAK_PASSWORD : Password should be at least 6 characters':
          errorMessage = 'Weak password! Password should be at least 6 characters';
          break;
      }
    }
    return of(new AuthActions.AuthenticationFailed(errorMessage));
  }

  private handleUser(resData: AuthResponse, userInfo: { firstname: string, lastname: string } = null) {
    const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
    const user = new User(resData.email, resData.localId, resData.idToken, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    this.authService.setLogoutTimer(+resData.expiresIn * 1000);
    if (userInfo) {
      return new AuthActions.SignupSuccess({
        firstname: userInfo.firstname,
        lastname: userInfo.lastname,
        email: resData.email,
        localId: resData.localId,
        idToken: resData.idToken,
        expirationDate: expirationDate,
      });
    } else {
      return new AuthActions.LoginSuccess({
        email: resData.email,
        localId: resData.localId,
        idToken: resData.idToken,
        expirationDate: expirationDate
        // redirect: true
      });
    }
  }
}

