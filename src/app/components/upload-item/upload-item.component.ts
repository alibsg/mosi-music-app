import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-upload-item',
  templateUrl: './upload-item.component.html',
  styleUrls: ['./upload-item.component.scss']
})
export class UploadItemComponent implements OnInit {
  uploadProgress: Observable<number>;
  constructor() { }

  ngOnInit(): void {
    this.uploadProgress = of(50);
  }

}
