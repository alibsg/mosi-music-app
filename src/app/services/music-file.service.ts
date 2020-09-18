import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Subject, Observable, forkJoin } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as jsmediatags from 'jsmediatags';

import { FirebaseFileUploader } from './firebase-file-uploader';
import { DataStorageService } from './data-storage.service';
import { Track } from '../model/track.model';
import { AppState } from '../store/app.reducer';

@Injectable({ providedIn: 'root' })
export class MusicFileService {
  readonly defaultCoverUrl = '../../assets/images/no-cover.png';
  musicInfoReady = new Subject<{
    coverUrl: string,
    artist: string,
    title: string,
    genre: string,
    album: string,
    year: string
  }>();

  fireBaseFileUploader: FirebaseFileUploader;
  fireBaseFileProggres: Observable<number>;
  fireBaseStoreFileFinished = new Subject<boolean>();

  constructor(
    private afStorage: AngularFireStorage,
    private dataStorageService: DataStorageService,
    private store: Store<AppState>) {
      jsmediatags.Config.setDisallowedXhrHeaders([
        'if-modified-since'
      ]);
      jsmediatags.Config.EXPERIMENTAL_avoidHeadRequests();
    }

  uploadPuase() {
    if (this.fireBaseFileUploader) {
      this.fireBaseFileUploader.pause();
    }
  }

  uploadResume() {
    if (this.fireBaseFileUploader) {
      this.fireBaseFileUploader.resume();
    }
  }

  uploadCancel() {
    if (this.fireBaseFileUploader) {
      this.fireBaseFileUploader.cancel();
    }
  }

  private readSongInfo(file: string | File) {
    let coverUrl = this.defaultCoverUrl;
    const defaultData = { coverUrl: this.defaultCoverUrl, artist: '', title: '', genre: '', album: '', year: '' };
    jsmediatags.read(file, {
      onSuccess: tag => {
        const { picture, artist, title, genre, album, year } = tag.tags; // create reference to track art
        if (picture) {
          let base64String = '';
          for (const data of picture.data) {
            base64String += String.fromCharCode(data);
          }
          coverUrl = 'data:' + picture.format + ';base64,' + window.btoa(base64String);
        }
        this.musicInfoReady.next({
          coverUrl: coverUrl,
          artist: artist || '',
          title: title || '',
          genre: genre || '',
          album: album || '',
          year: year || ''
        });
      },
      onError: error => {
        this.musicInfoReady.next(defaultData);
      }
    });
  }

  getSongInfo(file: string | File) {
    this.readSongInfo(file);
  }

  storeTags(track: Track) {
    const albums = track.album.split(';');
    const genres = track.genre.split(';');
    const artists = track.artist.split(';');
    return forkJoin([
      ...this.dataStorageService.storeAlbum(albums),
      ...this.dataStorageService.storeArtist(artists),
      ...this.dataStorageService.storeGenre(genres)
    ]).pipe(map(values => {
      for (const v of values) {
        if (!v) {
          return false;
        }
      }
      return true;
    }));
  }

  storeTrackMap(track: Track) {
    const albums = track.album.split(';');
    const genres = track.genre.split(';');
    const artists = track.artist.split(';');
    return forkJoin([
      ...this.dataStorageService.storeAlbumMap(track.id, albums),
      ...this.dataStorageService.storeArtistMap(track.id, artists),
      ...this.dataStorageService.storeGenreMap(track.id, genres)
    ]).pipe(map(values => {
      for (const v of values) {
        if (!v) {
          return false;
        }
      }
      return true;
    }));
  }

  storeTrack(file: File, info: { coverUrl: string, artist: string, title: string, genre: string, album?: string, year?: string }) {
    this.store.select('auth').pipe(
      take(1),
      map(state => state.user)).subscribe(user => {
        if (user) {
          this.fireBaseFileUploader = new FirebaseFileUploader('music', file, this.afStorage);
          this.fireBaseFileUploader.startUpload().subscribe({
            next: resp => {
              if (resp === false) {
              }
            },
            error: null,
          });
          // getting dowmload url
          this.fireBaseFileUploader.downloadURL.pipe(take(1)).subscribe(urlObs => {
            urlObs.pipe(take(1)).subscribe(url => {
              // we have url store track info fields
              const track = new Track('', info.title, info.artist, info.genre, info.album, info.year, url, new Date(), user.id);
              this.storeTags(track).pipe(take(1)).subscribe(res => {
                if (res) {
                  // store the whole track info
                  this.dataStorageService.storeSongInfo(track).pipe(take(1)).subscribe({
                    next: (resp: { name: string }) => {
                      // we have stored id
                      const id = resp.name;
                      track.id = id;
                      // store all maps to this id
                      this.storeTrackMap(track).pipe(take(1)).subscribe(tmres => {
                        if (tmres) {
                          this.fireBaseStoreFileFinished.next(true);
                        }
                        else {
                          this.fireBaseStoreFileFinished.next(false);
                        }
                      }
                      );
                    },
                    error: error => this.fireBaseStoreFileFinished.next(false)
                  });
                } else {
                  this.fireBaseStoreFileFinished.next(false);
                }
              });
            });
          });
          this.fireBaseFileProggres = this.fireBaseFileUploader.uploadProgress;
        }
      });
  }

  storeCurrentGenres() {
    this.dataStorageService.storeGenres().pipe(take(1)).subscribe(v => {
      console.log(v);
    });
  }
}

