import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AppState } from 'src/app/store/app.reducer';
import { SongItem } from 'src/app/components/song-item/song-item.model';
import { GetRecentSongsStart } from './store/home.actions';

const ITEMS_PER_PAGE = 5;

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  storeSubscription: Subscription;
  recentSongList: SongItem[] = [];
  recentViewing: SongItem[][] = [];
  recentCurrentPage = 0;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.storeSubscription = this.store.select('home').subscribe(
      state => {
        this.recentSongList = state.recentSongs.map(track => {
          return new SongItem(false, false, track.url, track.title, track.artist);
        });
        let recentNoOfPages = Math.floor(this.recentSongList.length / ITEMS_PER_PAGE);
        recentNoOfPages += (this.recentSongList.length % ITEMS_PER_PAGE) === 0 ? 0 : 1;
        for (let i = 0; i < recentNoOfPages; i++) {
          this.recentViewing.push(
            this.recentSongList.filter((item, index) => ((index >= ITEMS_PER_PAGE * i) && (index < (ITEMS_PER_PAGE * i + ITEMS_PER_PAGE))))
          );
        }
        this.recentCurrentPage = 0;
      }
    );
    this.store.dispatch(new GetRecentSongsStart());
  }

  recentPageSelect(index: number) {
    this.recentCurrentPage = index;
  }

  recentNexPage() {
    if (this.recentCurrentPage < this.recentViewing.length -1) {
      this.recentCurrentPage ++;
    }
  }

  recentPrevPage() {
    if (this.recentCurrentPage > 0) {
      this.recentCurrentPage --;
    }
  }
}
