import CastCard from '@/components/cast-card';
import MovieCard from '@/components/movie-card';
import MovieInfo from '@/components/movie-info';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { getMovieInfo } from '@/utils/movies';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

interface Props {
    params: Promise<{ media_type: string ,id: string }>;
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const id = (await params).id;
  const media_type = "movie";
  const response = await getMovieInfo(id, media_type); // Pass media_type

  if (!response) return { title: 'Media not found' };

  return {
    title: response.title || response.name,
    description: response.overview,
    openGraph: {
      title: response.title || response.name,
      description: response.overview,
      images: [
        {
          url: `https://image.tmdb.org/t/p/w500/${response.backdrop_path}`,
          width: 500,
          height: 750,
          alt: response.title || response.name,
        },
      ],
    },
  };
}


const Page = async ({ params }: Props) => {
  const id = (await params).id;
  const media_type = "movie";

  const response = await getMovieInfo(id, media_type); // media_type: 'movie' | 'tv'

  if (!response) return notFound();
  const { cast, similarMovies, ...movieInfo } = response;

  return (
    <div className="grid gap-6">
      <MovieInfo info={movieInfo} media_type={media_type} />

      <Card className="w-full overflow-hidden">
        <CardHeader>
          <CardTitle>Cast</CardTitle>
          <CardDescription>Meet the talented actors who bring the {media_type} to life.</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max space-x-4 pb-2">
              {cast.map(cast => (
                <CastCard key={cast.id} cast={cast} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="h-2" />
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="w-full overflow-hidden">
        <CardHeader>
          <CardTitle>Similar {media_type === 'movie' ? 'Movies' : 'TV Shows'}</CardTitle>
          <CardDescription>Explore similar {media_type === 'movie' ? 'movies' : 'series'} you might enjoy.</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max space-x-4 pb-2">
              {similarMovies.map(similar => (
                <MovieCard key={similar.id} movie={similar} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="h-2" />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
