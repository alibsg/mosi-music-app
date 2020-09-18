import { Track } from 'src/app/model/track.model';
import * as HomeActions from './home.actions';

export interface State {
  recentSongs: Track[];
  nowPlayingSongs: Track[];
}

const initialState: State = {
  recentSongs: [],
  nowPlayingSongs: []
};

export function homeReducer(state: State = initialState, action: HomeActions.HomeActions): State {
  switch (action.type) {
    case HomeActions.GET_RECENT_SONGS_START:
      return {
        ...state,
        recentSongs : []
      };

    case HomeActions.GET_RECENT_SONGS_SUCCESS:
      return {
        ...state,
        recentSongs: [...action.payload.recentSongs]
      };
    default:
      return state;
  }
}

