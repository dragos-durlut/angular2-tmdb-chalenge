export interface SingleMovieHttpResponseModel
{
    vote_count: number;
    id: number;
    video: boolean;
    vote_average: number;
    title: string;
    popularity: number;
    poster_path: string;
    original_language: string;
    original_title: string;
    genre_ids: Array<number>;
    backdrop_path: string;
    adult: boolean;
    overview: string;
    release_date: string;
}

export interface MovieHttpResponseModel {    
    results: Array<SingleMovieHttpResponseModel>;
    page: number;
    total_results: number;
    total_pages: number;
  }
