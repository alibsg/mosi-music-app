import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import * as HomeActions from './home.actions';
import { Track } from 'src/app/model/track.model';

@Injectable()
export class HomeEffects {
  constructor(
    private action$: Actions,
    private httpClient: HttpClient
  ) { }

  @Effect()
  getRecentSongsStart = this.action$.pipe(
    ofType(HomeActions.GET_RECENT_SONGS_START),
    switchMap(() => {
      const songArray: Track[] = [];
      return this.httpClient.get(`${environment.firebaseConfig.databaseURL}/tracks.json`).pipe(
        map(resp => {
          for (const key in resp) {
            if (resp.hasOwnProperty(key)) {
              songArray.push(resp[key]);
            }
          }
          return new HomeActions.GetRecentSongsSuccess({recentSongs: songArray});
        })
      );
    })
  );
}
