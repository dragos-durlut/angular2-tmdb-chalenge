
  export interface SingleMovieGenreHttpResponseModel
  {
      id: number;
      name: string;
  }

  export interface MovieGenreHttpResponseModel
  {    
    genres: Array<SingleMovieGenreHttpResponseModel>;
    
  }