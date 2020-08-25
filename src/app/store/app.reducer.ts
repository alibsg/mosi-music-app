import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from '../pages/auth/store/auth.reducer';

export interface AppState {
  auth: fromAuth.State;
}

export const appReducerMap: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer
};
