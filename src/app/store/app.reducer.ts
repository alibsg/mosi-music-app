import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from '../pages/auth/store/auth.reducer';
import * as fromHome from '../pages/main/home-page/store/heme.reducer';

export interface AppState {
  auth: fromAuth.State;
  home: fromHome.State;
}

export const appReducerMap: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  home: fromHome.homeReducer
};
