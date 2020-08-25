import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from './store/app.reducer';
import { AutoLogin } from './pages/auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'mosi-music-app';

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(new AutoLogin());
  }
}
