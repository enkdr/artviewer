type EntityType = 'artists' | 'artworks' | 'galleries' | 'countries';

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

export interface Artwork {
    artworkId: string;
    galleryId: string;
    artworkTitle: string;
    artworkYear: string;
    artworkMedium: string;
    artworkStyle: string;
    artworkDimensions: string;
    imageUrl: string;
    artistId: string; // This links to an artist
    galleryTitle: string;
    galleryAddress: string;
    galleryLink: string;
    galleryLat: string;
    galleryLon: string;
    countryId: string;
    countryTitle: string;
}

export interface Gallery {
    galleryId: string;
    galleryTitle: string;
    galleryAddress: string;
    galleryLink: string;
    galleryLat: string;
    galleryLon: string;
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
    ]
}
