import { MovieGenreModel } from 'src/common/models/MovieGenreModel';



export interface MovieModel
  {
    Id: number;
    VoteCount: number;    
    IsVideo: boolean;
    VoteAverage: number;
    Title: string;
    Popularity: number;
    PosterPath: string;
    OriginalLanguage: string;
    OriginalTitle: string;
    GenreIds: Array<number>;
    Genres: Array<MovieGenreModel>;
    GenreNames: Array<string>;
    BackdropPath: string;
    IsAdult: boolean;
    Overview: string;
    ReleaseDate: string;      
  }