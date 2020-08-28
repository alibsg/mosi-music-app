import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { MainComponent } from './pages/main/main.component';
import { FileUploadComponent } from './pages/file-upload/file-upload.component';
import { AdminComponent } from './pages/admin/admin.component';
import { SongsComponent } from './pages/admin/songs/songs.component';
import { SongUploadComponent } from './pages/admin/song-upload/song-upload.component';
import { UsersComponent } from './pages/admin/users/users.component';


const routes: Routes = [
  {path: '', redirectTo: '/auth/login', pathMatch: 'full'},
  {path: 'auth/login', component: LoginComponent},
  {path: 'auth/signup', component: SignupComponent},
  {path: 'main', component: MainComponent},
  {path: 'admin', component: AdminComponent, children: [
    {path: 'songs', component: SongsComponent},
    {path: 'songupload', component: SongUploadComponent},
    {path: 'users', component: UsersComponent}
  ]},
  {path: 'upload', component: FileUploadComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
