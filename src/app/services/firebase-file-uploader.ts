import { AngularFireStorageReference, AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';

export class FirebaseFileUploader {
  uploadProgress: Observable<number>;
  downloadURL: Subject<Observable<string>> = new Subject<Observable<string>>();
  private ref: AngularFireStorageReference;
  private task: AngularFireUploadTask;

  constructor(
    private targetFolder: string,
    private file: File,
    private afStorage: AngularFireStorage
  ) {}

  startUpload() {
    this.ref = this.afStorage.ref(`${this.targetFolder}/` + this.file.name);
    this.task = this.ref.put(this.file);
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges().pipe(
      finalize(() => {
          this.downloadURL.next(this.ref.getDownloadURL());
      })
    ).subscribe();
  }
}
