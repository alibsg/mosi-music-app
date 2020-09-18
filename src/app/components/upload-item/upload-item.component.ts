import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { MusicFileService } from 'src/app/services/music-file.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-upload-item',
  templateUrl: './upload-item.component.html',
  styleUrls: ['./upload-item.component.scss'],
  providers: [MusicFileService]
})
export class UploadItemComponent implements OnInit, OnDestroy {
  fileinfoSubscription: Subscription;
  fileUploadFinishSubscription: Subscription;
  uploadProgress: Observable<number>;
  uploasFinished: boolean = null;
  imageUrl: string;
  @Input() file: File;
  @Output() closeItem = new EventEmitter();

  constructor(private fileService: MusicFileService) {
  }

  ngOnInit(): void {
    this.fileService.getSongInfo(this.file);
    this.fileinfoSubscription = this.fileService.musicInfoReady.subscribe( info => {
      this.imageUrl = info.coverUrl;
      this.fileService.storeTrack(this.file, info);
      this.uploadProgress = this.fileService.fireBaseFileProggres;
      this.fileService.fireBaseStoreFileFinished.pipe(take(1)).subscribe(value => this.uploasFinished = value);
    });
  }

  ngOnDestroy(): void {
    this.fileinfoSubscription.unsubscribe();

  }

  onClose() {
    this.closeItem.emit();
  }

}
