import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-song-item',
  templateUrl: './song-item.component.html',
  styleUrls: ['./song-item.component.scss']
})
export class SongItemComponent implements OnInit {
  @Input() rated = false;
  @Input() favorite = false;
  @Input() imageUrl = '';

  constructor() { }

  ngOnInit(): void {
    if (!this.imageUrl) {
      this.imageUrl = '../../assets/images/no-cover.png';
    }
  }

  onFavorite() {
    this.favorite = !this.favorite;
  }

}
