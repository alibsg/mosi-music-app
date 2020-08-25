import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface State {
  firstname: string;
  lastname: string;
  role: string;
  user: User;
  error: string;
  loading: boolean;
}

const initialState: State = {
  firstname: null,
  lastname: null,
  role: null,
  user: null,
  error: null,
  loading: false
};

export function authReducer(state = initialState, action: AuthActions.AuthActions): State {
  switch (action.type) {
    case AuthActions.LOGIN_START:
    case AuthActions.SIGNUP_START:
      return {
        ...state,
        user: null,
        error: null,
        loading: true
      };

    case AuthActions.LOGIN_SIGNUP_FAILED:
      return {
        ...state,
        user: null,
        loading: false,
        error: action.payload,
      };
    case AuthActions.LOGIN_SUCCESS:
    case AuthActions.SIGNUP_SUCCESS:
      const { email, localId, idToken, expirationDate } = action.payload;
      return {
        ...state,
        user: new User(email, localId, idToken, expirationDate),
        loading: false,
        error: null
      };
    case AuthActions.SET_USER_INFO:
      return {
        ...state,
        firstname: action.payload.firstname,
        lastname: action.payload.lastname,
        role: action.payload.role
      };
    case AuthActions.LOGOUT:
      return {
        ...initialState
      };
    default:
      return state;
  }
}
