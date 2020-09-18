import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, switchMap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { Track, TrackData } from '../model/track.model';
import { of, forkJoin } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(private httpClient: HttpClient) { }

  private storeTrackParam(param: string, value: string) {
    value = value.toLowerCase();
    let httpParams = new HttpParams();
    httpParams = httpParams.append('orderBy', `"name"`);
    httpParams = httpParams.append('startAt', `"${value}"`);
    httpParams = httpParams.append('endAt', `"${value}\uf8ff"`);
    return this.httpClient
      .get(`${environment.firebaseConfig.databaseURL}/${param}.json`, {
        params: httpParams
      })
      .pipe(
        map(response => {
          const arr = [];
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              arr.push(response[key]);
            }
          }
          return arr;
        }),
        switchMap((arr: any[]) => {
          if (arr.length === 0) {
            return this.httpClient.post(`${environment.firebaseConfig.databaseURL}/${param}.json`, { name: value });
          }
          return of(true);
        }),
        switchMap(resp => of(true)),
        catchError(error => of(false))
      );
  }

  private storeTrackMap(param: string, data: TrackData) {
    return this.httpClient.post(`${environment.firebaseConfig.databaseURL}/${param}.json`, data).pipe(
      switchMap(resp => of(true)),
      catchError(error => of(false))
    );
  }

  storeGenre(genre: string[]) {
    return genre.map(g => this.storeTrackParam('genres', g.toLowerCase()));
  }

  storeArtist(artist: string[]) {
    return artist.map(a => this.storeTrackParam('artists', a.toLowerCase()));
  }

  storeAlbum(album: string[]) {
    return album.map(a => this.storeTrackParam('albums', a.toLowerCase()));
  }

  storeGenreMap(id: string, genre: string[]) {
    return genre.map(g => this.storeTrackMap('trackgenres', new TrackData(id, g.toLowerCase())));
  }

  storeArtistMap(id: string, artist: string[]) {
    return artist.map(a => this.storeTrackMap('trackartists', new TrackData(id, a.toLowerCase())));
  }

  storeAlbumMap(id: string, album: string[]) {
    return album.map(a => this.storeTrackMap('trackalbums', new TrackData(id, a.toLowerCase())));
  }

  storeSongInfo(track: Track) {
    return this.httpClient.post(`${environment.firebaseConfig.databaseURL}/tracks.json`, track);
  }

  // test method
  storeGenres() {
    return this.httpClient
      .get(`${environment.firebaseConfig.databaseURL}/trackgenres.json`)
      .pipe(
        map(response => {
          const arr = [];
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              arr.push(response[key]);
            }
          }
          return arr;
        }),
        switchMap((arr: {data: string, id: string}[]) => {
          const obsArray = [];
          for (const item of arr) {
            obsArray.push(this.storeTrackParam('genres', item.data));
          }
          return forkJoin(obsArray);
        })
      );
  }
}
