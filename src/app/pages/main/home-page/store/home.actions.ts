import { Action } from '@ngrx/store';

import { Track } from 'src/app/model/track.model';

export const GET_RECENT_SONGS_START = '[Home] Get Recent Songs Start';
export const GET_RECENT_SONGS_SUCCESS = '[Home] Get Recent Songs Success';

export class GetRecentSongsStart implements Action {
  readonly type = GET_RECENT_SONGS_START;
}

export class GetRecentSongsSuccess implements Action {
  readonly type = GET_RECENT_SONGS_SUCCESS;

  constructor( public payload: {recentSongs: Track[]}) {}
}

export type HomeActions = GetRecentSongsStart | GetRecentSongsSuccess;
