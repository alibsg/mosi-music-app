import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { MainComponent } from './pages/main/main.component';
import { MusicPlayerComponent } from './components/music-player/music-player.component';
import { MusicSeekerComponent } from './components/music-seeker/music-seeker.component';
import { PlayerHoverDirective } from './components/music-player/player-hover.directive';
import { DropdownDirective } from './components/shared/dropdown.directive';
import { HeaderComponent } from './components/header/header.component';
import { FileUploadComponent } from './pages/file-upload/file-upload.component';
import { appReducerMap } from './store/app.reducer';
import { AuthEffects } from './pages/auth/store/auth.effects';
import { SongItemComponent } from './components/song-item/song-item.component';
import { AdminComponent } from './pages/admin/admin.component';
import { SongsComponent } from './pages/admin/songs/songs.component';
import { SongUploadComponent } from './pages/admin/song-upload/song-upload.component';
import { UsersComponent } from './pages/admin/users/users.component';
import { UploadItemComponent } from './components/upload-item/upload-item.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    MainComponent,
    MusicPlayerComponent,
    MusicSeekerComponent,
    PlayerHoverDirective,
    DropdownDirective,
    HeaderComponent,
    FileUploadComponent,
    SongItemComponent,
    AdminComponent,
    SongsComponent,
    SongUploadComponent,
    UsersComponent,
    UploadItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    HttpClientModule,
    StoreModule.forRoot(appReducerMap),
    EffectsModule.forRoot([AuthEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
