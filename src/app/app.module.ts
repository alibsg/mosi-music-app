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
import { HomePageComponent } from './pages/main/home-page/home-page.component';
import { MusicPlayerComponent } from './components/music-player/music-player.component';
import { MusicSeekerComponent } from './components/music-seeker/music-seeker.component';
import { PlayerHoverDirective } from './components/music-player/player-hover.directive';
import { DropdownDirective } from './components/shared/dropdown.directive';
import { HeaderComponent } from './components/header/header.component';
import { appReducerMap } from './store/app.reducer';
import { AuthEffects } from './pages/auth/store/auth.effects';
import { SongItemComponent } from './components/song-item/song-item.component';
import { AdminComponent } from './pages/admin/admin.component';
import { SongsComponent } from './pages/admin/songs/songs.component';
import { SongUploadComponent } from './pages/admin/song-upload/song-upload.component';
import { UsersComponent } from './pages/admin/users/users.component';
import { UploadItemComponent } from './components/upload-item/upload-item.component';
import { FileSizePipe } from './components/shared/filesize.pipe';
import { HomeEffects } from './pages/main/home-page/store/home.effects';
import { GenresPageComponent } from './pages/main/genres-page/genres-page.component';
import { ArtistsPageComponent } from './pages/main/artists-page/artists-page.component';
import { AlbumsPageComponent } from './pages/main/albums-page/albums-page.component';
import { FavoritesPageComponent } from './pages/main/favorites-page/favorites-page.component';
import { PlaylistsPageComponent } from './pages/main/playlists-page/playlists-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    MainComponent,
    HomePageComponent,
    MusicPlayerComponent,
    MusicSeekerComponent,
    PlayerHoverDirective,
    DropdownDirective,
    HeaderComponent,
    SongItemComponent,
    AdminComponent,
    SongsComponent,
    SongUploadComponent,
    UsersComponent,
    UploadItemComponent,
    FileSizePipe,
    GenresPageComponent,
    ArtistsPageComponent,
    AlbumsPageComponent,
    FavoritesPageComponent,
    PlaylistsPageComponent
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
    EffectsModule.forRoot([AuthEffects, HomeEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
