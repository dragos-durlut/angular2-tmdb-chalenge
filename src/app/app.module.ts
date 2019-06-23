import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoaderComponent } from '../shared/components/loader/loader.component';
import { RatingSystemComponent } from '../shared/components/rating-system/rating-system.component';
import { MovieService } from '../common/services/movie.service';

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent,
    RatingSystemComponent,   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
    
  ],
  providers: [MovieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
