import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { MovieHttpResponseModel, SingleMovieHttpResponseModel } from '../httpResponseModels/MovieHttpResponseModel';
import { MovieGenreHttpResponseModel, SingleMovieGenreHttpResponseModel } from '../httpResponseModels/MovieGenreHttpResponseModel';
import { MovieModel } from '../../common/models/MovieModel';
import { MovieGenreModel } from '../../common/models/MovieGenreModel';
import { reduce } from 'rxjs/internal/operators/reduce';
import { environment } from '../../environments/environment';



  

@Injectable()
export class MovieService {
  constructor(private httpClient: HttpClient) {}

  getMoviesPlayingNow(page: number): Observable<MovieHttpResponseModel> {
      let url:string = `${environment.apiUrl}/movie/popular?api_key=${environment.apiKey}&language=${environment.defaultLanguage}&page=${page}`;
    return this.httpClient      
      .get<MovieHttpResponseModel>(url);      
      
  }

  getMoviesPlayingNowArray(page: number): Observable<Array<SingleMovieHttpResponseModel>> {
    return this.getMoviesPlayingNow(page).pipe(map((data: MovieHttpResponseModel) => {
        return data.results.map(r => r)
    }));
  }

  getMovieGenres(): Observable<MovieGenreHttpResponseModel>
  {
      let url:string = `${environment.apiUrl}/genre/movie/list?api_key=${environment.apiKey}&language=${environment.defaultLanguage}`;
    return this.httpClient    
    .get<MovieGenreHttpResponseModel>(url);       
  }

  getMovieGenresArray(): Observable<Array<SingleMovieGenreHttpResponseModel>>
  {
    return this.getMovieGenres().pipe(map((data: MovieGenreHttpResponseModel) => {
        return data.genres.map(r => r)
    }));
  }

  buildMovieList() : Observable<Array<MovieModel>>
  {
    var rmovieList = new Observable<Array<MovieModel>>();
    var movieGenreHttpResponseModelObservable: Observable<Array<SingleMovieGenreHttpResponseModel>> = this.getMovieGenresArray();
    var movieHttpResponseModelObservable : Observable<Array<SingleMovieHttpResponseModel>> = this.getMoviesPlayingNowArray(1);
    
    //https://www.learnrxjs.io/operators/combination/forkjoin.html
    /* 
    This operator is best used when you have a group of observables and only care about the final emitted value of each. 
    One common use case for this is if you wish to issue multiple requests on page load (or some other event) 
    and only want to take action when a response has been received for all. 
    In this way it is similar to how you might use Promise.all.
    */
    return forkJoin([movieGenreHttpResponseModelObservable, movieHttpResponseModelObservable]).pipe(map((forkData: any) => {
        let singleMovieGenreHttpResponseModelArray = <Array<SingleMovieGenreHttpResponseModel>>forkData[0];
        let singleMovieHttpResponseModelArray = <Array<SingleMovieHttpResponseModel>>forkData[1];

        let genresArray : Array<MovieGenreModel> = singleMovieGenreHttpResponseModelArray.map(x=> <MovieGenreModel>({Id: x.id, Name: x.name}) );

        return singleMovieHttpResponseModelArray.map(m=>this.getMovieModel(m, genresArray) )

        
    }));

    //return movieHttpResponseModelObservable.pipe(map((movieHttpResponseModel: MovieHttpResponseModel) => {
    //    return this.getMovieModelList(movieHttpResponseModel, null)
    //}));

    //return movieGenreHttpResponseModelObservable.pipe(
    //    mergeMap((movieGenreHttpResponseModel:MovieGenreHttpResponseModel)=>
    //    {
    //        return movieHttpResponseModelObservable.pipe(map((movieHttpResponseModel: MovieHttpResponseModel) => {
    //            return this.getMovieModelList(movieHttpResponseModel, movieGenreHttpResponseModel)
    //        }));
    //    }
    //)
    //).pipe( reduce((results, result) => {
    //    results.push(result);
    //    return results;
    //  }, []) )
    
    //.subscribe(movieList => {
    //    console.log(movieList);
    //    
    //    rmovieList = movieList;
    //});
    
    //return  rmovieList;
  }

 
  getMovieModel(mv: SingleMovieHttpResponseModel, movieGenreModelList: Array<MovieGenreModel>)
  {
      return    <MovieModel>({ 
        Id: mv.id,
        VoteCount: mv.vote_count, 
        IsVideo: mv.video,
        VoteAverage: mv.vote_average,
        Title: mv.title,
        Popularity: mv.popularity,
        PosterPath: mv.poster_path,
        OriginalLanguage: mv.original_language,
        OriginalTitle: mv.original_title,
        GenreIds: mv.genre_ids,
        Genres: movieGenreModelList.filter(x=> mv.genre_ids.includes(x.Id)),
        GenreNames: movieGenreModelList.filter(x=> mv.genre_ids.includes(x.Id)).map(y=>y.Name),
        BackdropPath: mv.backdrop_path,
        IsAdult: mv.adult,
        Overview: mv.overview,
        ReleaseDate: mv.release_date
       })   
  }

  
      

  getMovieModelList(movieHttpResponseModel: MovieHttpResponseModel, movieGenreHttpResponseModel:MovieGenreHttpResponseModel)
  {
    var movieGenreModelList: Array<MovieGenreModel> = [];
      if(movieGenreHttpResponseModel != undefined)
        movieGenreModelList = movieGenreHttpResponseModel.genres.map(g=>  <MovieGenreModel>({Id: g.id, Name: g.name}));
     return movieHttpResponseModel.results.map(mv=>this.getMovieModel(mv, movieGenreModelList) );
  }

    public sortMoviesByPopularityAsc(moviesArray: Array<MovieModel>): Array<MovieModel> {
        return moviesArray.sort((movie1, movie2) => {
            if (movie1.Popularity > movie2.Popularity) {
                return 1;
            }
        
            if (movie1.Popularity < movie2.Popularity) {
                return -1;
            }
        
            return 0;
        })
    }

    public filterMoviesByRating(moviesArray: Array<MovieModel>, rating: number) {
        return moviesArray.filter(m => m.VoteAverage >= rating);
    }
}


