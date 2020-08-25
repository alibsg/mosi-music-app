import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Genre } from '../model/genre.model';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(private httpClient: HttpClient) { }

  storeGenre(genre: Genre) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('orderBy', `"name"`);
    httpParams = httpParams.append('startAt', `"${genre.name}"`);
    httpParams = httpParams.append('endAt', `"${genre.name}\uf8ff"`);
    this.httpClient
      .get(`${environment.firebaseConfig.databaseURL}/genres.json?`, {
        params: httpParams
      })
      .pipe(
        map(response => {
          const genreArr = [];
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              genreArr.push(response[key]);
            }
          }
          return genreArr;
        }))
      .subscribe(genreArr => {
        console.log(genreArr);
        if (genreArr.length === 0) {
          this.httpClient.post(`${environment.firebaseConfig.databaseURL}/genres.json`, genre).subscribe(posrResp => {
            console.log(posrResp);
          });
        }
      });
  }
}
