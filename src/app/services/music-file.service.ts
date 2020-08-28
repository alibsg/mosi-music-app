import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import * as jsmediatags from 'jsmediatags';

import { FirebaseFileUploader } from './firebase-file-uploader';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class MusicFileService {
  readonly defaultCoverUrl = '../../assets/images/no-cover.png';
  musicInfoReady = new Subject<{
    coverUrl: string,
    artist: string,
    title: string,
    album?: string
  }>();

  constructor(private afStorage: AngularFireStorage) { }

  getUploaderObject(file: File): FirebaseFileUploader {
    return new FirebaseFileUploader('music', file, this.afStorage);
  }

  getSongInfo(url: string) {
    let coverUrl = this.defaultCoverUrl;
    let artistRes = '';
    let titleRes = '';
    jsmediatags.Config.setDisallowedXhrHeaders([
      'if-modified-since'
    ]);

    jsmediatags.Config.EXPERIMENTAL_avoidHeadRequests();
    jsmediatags.read(url, {
      onSuccess: tag => {
        const {picture, artist, title} = tag.tags; // create reference to track art
        if (picture) {
          let base64String = '';
          for (const data of picture.data) {
            base64String += String.fromCharCode(data);
          }
          coverUrl  = 'data:' + picture.format + ';base64,' + window.btoa(base64String);
        }
        if (artist) {
          artistRes = artist;
        }
        if (title) {
          titleRes = title;
        }
        this.musicInfoReady.next({coverUrl: coverUrl, artist: artistRes, title: titleRes});
      },
      onError: error => {
        this.musicInfoReady.next({coverUrl: coverUrl, artist: artistRes, title: titleRes});
      }
    });
  }
}

