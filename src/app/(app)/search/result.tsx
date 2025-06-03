'use client';

import MovieCard from '@/components/movie-card';
import SearchBar from '@/components/search-bar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { IMovie } from '@/types/api-response';
import { getTrendingMovies } from '@/utils/movies';
import axios from 'axios';
import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const SearchResults = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<IMovie[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        (async () => {
            setLoading(true);
            const { data } = await axios.get('/search/api', { signal, params: { query } });
            setResults(data);
            setLoading(false);
            console.log(data);
        })();
        
        
        return () => controller.abort();
    }, [query]);

    return (
        <div>
            <SearchBar onChange={setQuery} />

            {query.length > 0 && (
                <Card className="max-w-screen-md mx-auto mt-8">
                    <CardHeader>
                        <CardTitle>Search Results</CardTitle>
                        <CardDescription>
                            {loading ? (
                                'Searching...'
                            ) : (
                                <p>
                                    {results.length} {results.length === 1 ? 'result' : 'results'} found for &quot;{query}&quot;
                                </p>
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-1 md:grid-cols-2">
                        {!loading &&
                           results.map(movie => {
  const title =
    movie.title || movie.name || movie.original_title || movie.original_name || 'Untitled';

  const releaseDate = movie.release_date || movie.first_air_date;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder.png'; // Use a fallback image in your public folder

  return (
    <Link
      prefetch={false}
      href={`/browse/${movie.id}?type=${movie.media_type || 'movie'}`}
      key={`${movie.media_type || 'movie'}-${movie.id}`}
      className="py-1.5 px-2 rounded-md gap-3 flex hover:bg-muted cursor-pointer group transition-all"
    >
      <img
        className="border rounded-md size-10 object-cover"
        src={imageUrl}
        alt={title}
        loading="lazy"
      />

      <div className="flex-1">
        <h3 className="line-clamp-1 text-ellipsis font-medium">{title}</h3>
        <p className="text-xs text-muted-foreground capitalize">
          {movie.original_language} - {releaseYear}
        </p>
      </div>
    </Link>
  );
})
};


                        {loading && (
                            <p className="text-center col-span-2 items-center place-items-center text-muted-foreground py-10">
                                <Loader2Icon className="text-primary size-8 animate-spin" />
                            </p>
                        )}

                        {!loading && results.length === 0 && (
                            <p className="text-center col-span-2 text-muted-foreground py-10">No results found for &quot;{query}&quot;</p>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default SearchResults;
