import { Home, Clapperboard, Library, Search, ListMusicIcon, TvIcon, Film } from 'lucide-react';

const NavLinks = [
    {
        name: 'Home',
        href: '/home',
        icons: Home,
    },
    {
        name: 'search',
        href: '/search',
        icons: Clapperboard,
    },
    {
        name: 'Movies',
        href: '/movies',
        icons: Film,
    },
    {
        name: 'Tv Shows',
        href: '/Tv_Shows',
        icons: TvIcon,
    },
    // {
    //     name: 'Playlist',
    //     href: '/queue',
    //     icons: ListMusicIcon,
    // },
];

export default NavLinks;
