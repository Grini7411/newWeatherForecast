import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FavoritesComponent} from './favorites/favorites.component';
import {MainComponent} from './main/main.component';

const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full'},
  { path: 'favorites', component: FavoritesComponent},
  { path: 'main', component: MainComponent }
// {path:"**",component:NotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
