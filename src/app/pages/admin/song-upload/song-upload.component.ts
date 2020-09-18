import { Component, OnInit } from '@angular/core';

import { DataStorageService } from 'src/app/services/data-storage.service';
import { MusicFileService } from 'src/app/services/music-file.service';

@Component({
  selector: 'app-song-upload',
  templateUrl: './song-upload.component.html',
  styleUrls: ['./song-upload.component.scss'],
})
export class SongUploadComponent implements OnInit {
  fileList: File[] = [];
  imageUrl = '';

  constructor(private musicfileService: MusicFileService) { }

  ngOnInit(): void {
  }

  onAddFiles(fileSelector: HTMLInputElement) {
    fileSelector.click();
  }

  onGetFileNames(files: File[]) {
    for (const file of files) {
      this.fileList.push(file);
    }
  }

  onCloseItem(id: number) {
    this.fileList = this.fileList.filter( (item, index) => index !== id);
  }

  // onStoreGenres() {
  //   this.musicfileService.storeCurrentGenres();
  // }

}
