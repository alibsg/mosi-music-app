import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

import { SongItem } from './song-item.model';
import { MusicFileService } from 'src/app/services/music-file.service';

@Component({
  selector: 'app-song-item',
  templateUrl: './song-item.component.html',
  styleUrls: ['./song-item.component.scss'],
  providers: [MusicFileService]
})
export class SongItemComponent implements OnInit, OnDestroy {
  @Input() songItem: SongItem;
  @Output() itemClicked = new EventEmitter<number>();
  infoReadySubscription: Subscription;
  imageUrl = this.musicFileService.defaultCoverUrl;

  constructor(private musicFileService: MusicFileService ) { }

  ngOnInit(): void {
    if (this.songItem.songUrl) {
      this.musicFileService.getSongInfo(this.songItem.songUrl);
      this.infoReadySubscription = this.musicFileService.musicInfoReady.subscribe( info => {
        this.imageUrl = info.coverUrl;
      });
    }
  }

  ngOnDestroy() {
    this.infoReadySubscription.unsubscribe();
  }

  onFavorite() {
    this.songItem.favorite = !this.songItem.favorite;
  }

}
