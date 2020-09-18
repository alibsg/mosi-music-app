import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { MainComponent } from './pages/main/main.component';
import { AdminComponent } from './pages/admin/admin.component';
import { SongsComponent } from './pages/admin/songs/songs.component';
import { SongUploadComponent } from './pages/admin/song-upload/song-upload.component';
import { UsersComponent } from './pages/admin/users/users.component';
import { HomePageComponent } from './pages/main/home-page/home-page.component';
import { GenresPageComponent } from './pages/main/genres-page/genres-page.component';
import { ArtistsPageComponent } from './pages/main/artists-page/artists-page.component';
import { AlbumsPageComponent } from './pages/main/albums-page/albums-page.component';
import { FavoritesPageComponent } from './pages/main/favorites-page/favorites-page.component';
import { PlaylistsPageComponent } from './pages/main/playlists-page/playlists-page.component';


const routes: Routes = [
  {path: '', redirectTo: '/auth/login', pathMatch: 'full'},
  {path: 'auth/login', component: LoginComponent},
  {path: 'auth/signup', component: SignupComponent},
  {path: 'main', component: MainComponent, children: [
    {path: 'home', component: HomePageComponent},
    {path: 'genres', component: GenresPageComponent},
    {path: 'artists', component: ArtistsPageComponent},
    {path: 'albums', component: AlbumsPageComponent},
    {path: 'favorites', component: FavoritesPageComponent},
    {path: 'playlists', component: PlaylistsPageComponent},
  ]},
  {path: 'admin', component: AdminComponent, children: [
    {path: 'songs', component: SongsComponent},
    {path: 'songupload', component: SongUploadComponent},
    {path: 'users', component: UsersComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
