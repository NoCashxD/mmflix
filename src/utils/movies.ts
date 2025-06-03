import tmdbClient from '@/lib/tmdb';
import { IApiResponse, ICast, IMovie, IMovieInfo } from '@/types/api-response';
import { GenericAbortSignal } from 'axios';

interface DiscoverMoviesProps {
  page?: number;
  sort_by?: string;
  primary_release_year?: string;
  with_genres?: string;
  with_cast?: string;
  with_people?: string;
  with_original_language?: string;
}

const getAllowedMovieNames = async (): Promise<string[]> => {
  try {
    const baseUrl = "https://mmflix.vercel.app";
    const response = await fetch(`${baseUrl}/api/allowed-movies`);
    const data = await response.json();
    return data.map((name: string) => name.toLowerCase());
  } catch (error) {
    console.error('Failed to fetch allowed movie names:', error);
    return [];
  }
};

const isAllowedMovie = (title: string, allowedNames: string[]): boolean => {
  const lowerTitle = title.toLowerCase();
  return allowedNames.some(name =>
    lowerTitle.includes(name) || name.includes(lowerTitle)
  );
};

export const discoverMovies = async (props: DiscoverMoviesProps) => {
  try {
    const allowedNames = await getAllowedMovieNames();

    const [movieResponse, tvResponse] = await Promise.all([
      tmdbClient.get<IApiResponse<IMovie[]>>('/discover/movie', {
        params: {
          page: props.page || 1,
          include_adult: false,
          include_video: false,
          ...(props.sort_by && { sort_by: props.sort_by }),
          ...(props.with_original_language && { with_original_language: props.with_original_language }),
          ...(props.primary_release_year && { primary_release_year: props.primary_release_year }),
          ...(props.with_genres && { with_genres: props.with_genres }),
          ...(props.with_cast && { with_cast: props.with_cast }),
          ...(props.with_people && { with_people: props.with_people }),
        },
      }),
      tmdbClient.get<IApiResponse<IMovie[]>>('/discover/tv', {
        params: {
          page: props.page || 1,
          include_adult: false,
          ...(props.sort_by && { sort_by: props.sort_by }),
          ...(props.with_original_language && { with_original_language: props.with_original_language }),
          ...(props.primary_release_year && { first_air_date_year: props.primary_release_year }),
          ...(props.with_genres && { with_genres: props.with_genres }),
          ...(props.with_cast && { with_cast: props.with_cast }),
          ...(props.with_people && { with_people: props.with_people }),
        },
      }),
    ]);

    const movieResults = movieResponse.data.results.map(item => ({
      ...item,
      media_type: 'movie',
    }));

    const tvResults = tvResponse.data.results.map(item => ({
      ...item,
      media_type: 'tv',
    }));

    const allResults = [...movieResults, ...tvResults];
    return allResults.filter(item =>{
      const title = item.original_title || item.name;
       isAllowedMovie(item.title, allowedNames)});
  } catch (error) {
    console.log('Error while fetching combined movie/TV results:', error);
    return [];
  }
};


export const getTrendingMovies = async () => {
  try {
    const allowedNames = await getAllowedMovieNames();

    const [movieResponse, tvResponse] = await Promise.all([
      tmdbClient.get<IApiResponse<IMovie[]>>('/trending/movie/week'),
      tmdbClient.get<IApiResponse<IMovie[]>>('/trending/tv/week'),
    ]);

    const allResults = [...movieResponse.data.results, ...tvResponse.data.results];
    return allResults.filter(item =>{
      const title = item.original_title || item.name;
       isAllowedMovie(item.title, allowedNames)});
  } catch (error) {
    console.log('Error while fetching trending movies/TV:', error);
    return [];
  }
};

interface SearchMoviesProps {
  query: string;
  page?: number;
  type?: string;
  signal?: AbortSignal | GenericAbortSignal;
}

export const searchMovies = async ({ query, page = 1, signal }: SearchMoviesProps) => {
  try {
    const allowedNames = await getAllowedMovieNames();

    const [movieResponse, tvResponse] = await Promise.all([
      tmdbClient.get<IApiResponse<IMovie[]>>(`/search/movie`, {
        signal,
        params: {
          query,
          include_adult: false,
          page,
        },
      }),
      tmdbClient.get<IApiResponse<IMovie[]>>(`/search/tv`, {
        signal,
        params: {
          query,
          include_adult: false,
          page,
        },
      }),
    ]);

    const allResults = [...movieResponse.data.results, ...tvResponse.data.results];
    return allResults.filter(item =>{
      const title = item.original_title || item.name;
       isAllowedMovie(item.title, allowedNames)});
  } catch (error) {
    console.log('Error while fetching search results:', error);
    return [];
  }
};

export const getMovieInfo = async (id: string, media_type: string) => {
  const allowedNames = await getAllowedMovieNames();

  try {
    const mainData = await tmdbClient.get<IMovieInfo>(`/${media_type}/${id}`, {
      params: { language: 'en-US' },
    });

    const title =
      mainData.data.title ||
      mainData.data.original_title ||
      mainData.data.name ||
      mainData.data.original_name;

    // Uncomment this if you want to restrict based on allowed titles
    // if (!isAllowedMovie(title, allowedNames)) return null;

    const [similarResponse, castResponse] = await Promise.all([
      tmdbClient.get<IApiResponse<IMovie[]>>(`/${media_type}/${id}/similar`, {
        params: { language: 'en-US' },
      }),
      tmdbClient.get<{ cast: ICast[] }>(`/${media_type}/${id}/credits`, {
        params: { language: 'en-US' },
      }),
    ]);

    return {
      ...mainData.data,
      media_type,
      cast: castResponse.data.cast,
      similarMovies: similarResponse.data.results.filter(sim =>
        isAllowedMovie(
          sim.title || sim.original_title || sim.name || sim.original_name,
          allowedNames
        )
      ),
    };
  } catch (err) {
    return null;
  }
};

