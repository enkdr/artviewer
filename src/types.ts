type EntityType = 'artists' | 'artworks' | 'galleries' | 'countries' | 'styles';

// keyPath is the key used to store the data in IndexedDB
export interface EntityMeta<T> {
    key: EntityType;
    keyPath: string;
    url: string;
    transform: (data: unknown) => T[]
}

export interface Artist {
    artistId: string;
    artistTitle: string;
    artistFirstname: string;
    artistLastname: string;
    artistImageUrl: string;
    artistNationality: string;
    artistShortBio: string;
    artistBio: string;
    artistBorn: string;
    artistDied: string;
}

export interface Style {
    styleId: string;
    styleTitle: string;
}

export interface Artwork {
    artworkId: string;
    galleryId: string;
    artworkTitle: string;
    artworkYear: string;
    artworkMediums: string[];
    artworkStyles: string[];
    artworkDimensions: string;
    artworkGalleryLink: string;
    imageUrl: string;
    artistImageUrl: string;
    artistId: string; // This links to an artist
    artistTitle: string;
    artistFirstname: string;
    artistLastname: string;
    galleryTitle: string;
    galleryAddress: string;
    galleryLink: string;
    galleryLat: number;
    galleryLon: number;
    countryId: string;
    countryTitle: string;
}

export interface Gallery {
    galleryId: string;
    galleryTitle: string;
    galleryAddress: string;
    galleryLink: string;
    galleryLat: number;
    galleryLon: number;
    countryId: string;
    countryTitle: string;
}

export interface Country {
    countryId: string;
    countryTitle: string;
}

export const iconPaths = {
    artist: [
        'M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0',
        'M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2'
    ],
    gallery: [
        'M5 3h1a1 1 0 0 1 1 1v2h3v-2a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2h3v-2a1 1 0 0 1 1 -1h1a1 1 0 0 1 1 1v4.394a2 2 0 0 1 -.336 1.11l-1.328 1.992a2 2 0 0 0 -.336 1.11v7.394a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1v-7.394a2 2 0 0 0 -.336 -1.11l-1.328 -1.992a2 2 0 0 1 -.336 -1.11v-4.394a1 1 0 0 1 1 -1z',
        'M10 21v-5a2 2 0 1 1 4 0v5'
    ],
    map: [
        'M3 7l6 -3l6 3l6 -3v13l-6 3l-6 -3l-6 3v-13',
        'M9 4v13',
        'M15 7v13'
    ],
    home: [
        'M5 12l-2 0l9 -9l9 9l-2 0',
        'M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7',
        'M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6'
    ],
    close: [
        'M18 6l-12 12',
        'M6 6l12 12'
    ],
    style: [
        'M12 21a9 9 0 0 1 0 -18c4.97 0 9 3.582 9 8c0 1.06 -.474 2.078 -1.318 2.828c-.844 .75 -1.989 1.172 -3.182 1.172h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25',
        'M8.5 10.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
        'M12.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
        'M16.5 10.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
    ],
    settings: [
        'M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z',
        'M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0',
    ],
    artwork: [
        'M15 8h.01',
        'M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z',
        'M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5',
        'M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3',
    ]
}
