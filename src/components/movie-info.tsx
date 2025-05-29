'use client';
import { IMovie, IMovieInfo } from '@/types/api-response';
import React, { useEffect, useState } from 'react';
import RatingCompComponent from './client/rating';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/context/favorites-context';
import { cn } from '@/lib/utils';
import ISO6391 from 'iso-639-1';

type Props = {
    info: IMovieInfo;
};

type DownloadItem = {
    quality: number;
    size: number;
    link: string;
};

const MovieInfo = ({ info }: Props) => {
    const { isFavorited, toggleFavorite } = useFavorites();
    const [downloadLinks, setDownloadLinks] = useState<DownloadItem[]>([]);

   useEffect(() => {
    const fetchDownloadLinks = async () => {
        console.log('Fetching movie:', info.title);
        try {
            const res = await fetch(`/api/movies?name=${encodeURIComponent(info.title)}`);
            if (res.ok) {
                const data = await res.json();
                setDownloadLinks(data);
            } else {
                console.error('Failed to fetch download links, status:', res.status);
            }
        } catch (err) {
            console.error('Error fetching download links:', err);
        }
    };

    if (info.title) {
        fetchDownloadLinks();
    }
}, [info.title]);


    const otherDetails = [
        { label: 'Runtime', value: `${info?.runtime} min` },
        { label: 'Release Date', value: `${info?.release_date}` },
        { label: 'Original Language', value: `${ISO6391.getName(info?.original_language)}` },
    ];

    return (
        <div className="rounded-2xl border bg-card relative overflow-hidden">
            <div className="max-md:hidden absolute inset-0">
                <img className="size-full" src={`https://image.tmdb.org/t/p/w780${info?.backdrop_path}`} alt="" />
            </div>

            <div className="size-full grid md:grid-cols-[3fr_6fr] backdrop-blur-[0px] gap-8 2xl:gap-10 p-5 2xl:p-6 bg-card/90 z-10 relative">
                <div className="relative">
                    <img className="rounded-lg border w-full h-full" src={`https://image.tmdb.org/t/p/w780${info?.poster_path}`} />
                    <div
                        onClick={() => toggleFavorite(info as unknown as IMovie)}
                        className="absolute z-30 top-2 right-2 text-primary p-2 rounded-md bg-card/50 cursor-pointer"
                    >
                        <Heart
                            className={cn(
                                'transition-all duration-300 z-30 size-6',
                                isFavorited(info as unknown as IMovie) && 'fill-primary text-primary'
                            )}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-5">
                    <div>
                        <h2 className="text-2xl md:text-4xl font-bold">{info?.title}</h2>
                        <h4 className="md:text-lg mt-1 text-foreground/95">{info?.tagline}</h4>
                        <RatingCompComponent className="mt-1" rating={info?.vote_average} starDimension={24} />
                    </div>

                    <div>
                        <h4 className="font-bold">Genres</h4>
                        <div className="mt-1 flex gap-2 items-center flex-wrap">
                            {info?.genres.map(genre => (
                                <span key={genre.id} className="px-2 py-1 rounded text-xs font-semibold bg-primary">
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold">Overview</h4>
                        <p className="mt-1 text-sm md:text-base text-foreground/80">{info?.overview}</p>
                    </div>

                    <div className="mt-auto">
                        <h4 className="font-bold mb-2">Details</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {otherDetails.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col md:flex-row items-center justify-between rounded-md bg-black/60 py-2 px-4 border"
                                >
                                    <h4 className="text-xs md:text-base capitalize">{item.label}</h4>
                                    <p className="text-primary font-semibold">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto">
                        <h4 className="font-bold mb-2">Download</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {downloadLinks.map((item, index) => (
                                <a
                                    key={index}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col md:flex-row items-center justify-between rounded-md bg-black/60 py-2 px-4 border hover:bg-primary hover:text-white transition"
                                >
                                    <h4 className="text-xs md:text-base capitalize">{item.quality}p</h4>
                                    <p className="font-semibold">{item.size}MB</p>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieInfo;
