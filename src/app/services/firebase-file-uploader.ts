import { AngularFireStorageReference, AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { Observable, of, Subject } from 'rxjs';
import { finalize, catchError, map } from 'rxjs/operators';

export class FirebaseFileUploader {
  uploadProgress: Observable<number>;
  downloadURL = new Subject<Observable<string>>();
  state: string;
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
    return this.task.snapshotChanges().pipe(
      map(snapshot => {
        return snapshot.state;
      }),
      finalize(() => {
        this.downloadURL.next(this.ref.getDownloadURL());
      }),
      catchError(error => of(false))
    );
  }

  pause() {
    this.task.pause();
  }

  resume() {
    this.task.resume();
  }

  cancel() {
    this.task.cancel();
  }
}
