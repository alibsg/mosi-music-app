import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AppState } from 'src/app/store/app.reducer';
import { Logout } from 'src/app/pages/auth/store/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() shrink = false;
  storeSubscription: Subscription;
  firstname = '';
  constructor( private store: Store<AppState>) { }

  ngOnInit(): void {
    this.storeSubscription = this.store.select('auth').subscribe( state => {
      this.firstname = state.firstname;
    });
  }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
  }

  logout() {
    this.store.dispatch(new Logout());
  }
}
