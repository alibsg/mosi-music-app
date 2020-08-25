import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

import { FirebaseFileUploader } from './firebase-file-uploader';

@Injectable({providedIn: 'root'})
export class MusicFileService {
  constructor(private afStorage: AngularFireStorage) { }

  getUploaderObject(file: File): FirebaseFileUploader {
    return new FirebaseFileUploader('music', file, this.afStorage);
  }
}

