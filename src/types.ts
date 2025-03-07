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