import { Component, OnInit, OnDestroy } from '@angular/core';
import { MusicFileService } from 'src/app/services/music-file.service';
import { Observable, Subscription } from 'rxjs';

import { FirebaseFileUploader } from 'src/app/services/firebase-file-uploader';
import { DataStorageService } from 'src/app/services/data-storage.service';
import { Genre } from 'src/app/model/genre.model';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit, OnDestroy {
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;
  downloadURLSubscription: Subscription;
  uploadObject: FirebaseFileUploader;

  constructor(private musicFileServece: MusicFileService, private dataStorage: DataStorageService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.downloadURLSubscription) {
      this.downloadURLSubscription.unsubscribe();
    }
  }

  upload(files: File[]) {
    this.uploadObject = this.musicFileServece.getUploaderObject(files[0]);
    this.uploadObject.startUpload();
    this.uploadProgress = this.uploadObject.uploadProgress;
    this.downloadURLSubscription = this.uploadObject.downloadURL.subscribe( obs => {
      this.downloadURL = obs;
    });
  }

  store() {
    const genre = new Genre('jazz');
    this.dataStorage.storeGenre(genre);
  }
}
