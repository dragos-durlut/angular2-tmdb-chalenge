import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { MovieModel } from '../common/models/MovieModel';
import { environment } from "../environments/environment";
import { MovieService } from '../common/services/movie.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  movieModelArray: Array<MovieModel> ;
  filteredMovieModelArray: Array<MovieModel>;
  isLoading = false;
  currentPage = 1;
  middleRatingNumber: number = 3;
  baseImageUrl: string;

  constructor(private movieService: MovieService) {
    this.movieModelArray = new Array<MovieModel>();
    this.baseImageUrl = `${environment.imageApiUrl}/w154`;
  }

  ngOnInit() {
    this.isLoading = true;
    this.movieService
      .buildMovieList()
      .subscribe(movieArray => {
        this.movieModelArray.push(...movieArray)   ;
        this.movieModelArray = this.movieService.sortMoviesByPopularityAsc(this.movieModelArray);        
        this.filterMoviesByRating(this.middleRatingNumber);
        this.isLoading = false;        
      });
      
  }

  public filterMoviesByRating(ratungNr: number): void {
    this.filteredMovieModelArray = this.movieService.filterMoviesByRating(this.movieModelArray, ratungNr);
}


}


