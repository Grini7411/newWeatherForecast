import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';

import { MainComponent } from './main/main.component';

import {AutoCompleteModule} from 'primeng/autocomplete';
import {MenubarModule} from 'primeng/menubar';
import {CardModule} from 'primeng/card';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {CarouselModule} from 'primeng/carousel';
import {ButtonModule} from 'primeng/button';
import { FavoritesComponent } from './favorites/favorites.component';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';

import { GetImgDirective } from './get-img.directive';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    FavoritesComponent,
    GetImgDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AutoCompleteModule,
    MenubarModule,
    FormsModule,
    ToggleButtonModule,
    CarouselModule,
    CardModule,
    MessagesModule,
    MessageModule,
    ProgressSpinnerModule,
    ToastModule,
    ButtonModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
