import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AppState } from 'src/app/store/app.reducer';
import { LoginStart } from '../store/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  error: string;
  loading = false;
  storeSubscription: Subscription;
  loginForm: FormGroup;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.storeSubscription = this.store.select('auth').subscribe( state => {
      this.loading = state.loading;
      this.error = state.error;
    });
    this.initForm();
  }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
  }

  private initForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  getControlInvalidity(name: string) {
    return this.loginForm.get(name).invalid && this.loginForm.get(name).touched;
  }

  login() {
    this.store.dispatch(new LoginStart(this.loginForm.value));
  }
}
