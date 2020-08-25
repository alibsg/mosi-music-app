import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AppState } from 'src/app/store/app.reducer';
import { SignupStart } from '../store/auth.actions';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  storeSubscription: Subscription;
  loading = false;
  error: string;
  signUpForm: FormGroup;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.storeSubscription = this.store.select('auth').subscribe(state => {
      this.loading = state.loading;
      this.error = state.error;
    });
    this.initForm();
  }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
  }

  private initForm() {
    const firstname = '';
    const lastname = '';
    const email = '';
    const password = '';

    this.signUpForm = new FormGroup({
      firstname: new FormControl(firstname, [Validators.required, Validators.maxLength(20)]),
      lastname: new FormControl(lastname, [Validators.required, Validators.maxLength(40)]),
      email: new FormControl(email, [Validators.required, Validators.email]),
      password: new FormControl(password, [Validators.required])
    });
  }

  onSubmit() {
    this.store.dispatch(new SignupStart(this.signUpForm.value));
  }

  getControlIsInvalid(name: string) {
    return this.signUpForm.get(name).invalid && this.signUpForm.get(name).touched;
  }
}
