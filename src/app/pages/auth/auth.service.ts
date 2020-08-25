import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from 'src/app/store/app.reducer';
import { Logout } from './store/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  logoutTimer: any = null;

  constructor(private store: Store<AppState>) {}
  setLogoutTimer(time: number) {
    this.logoutTimer = setTimeout(() => {
      this.store.dispatch(new Logout());
    }, time);
  }

  clearLogoutTime() {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
    this.logoutTimer = null;
  }
}
