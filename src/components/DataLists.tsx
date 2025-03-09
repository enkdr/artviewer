import { Artist, Gallery } from '../types'

interface ArtistListProps {
    ArtistsData: Artist[];
}

interface GalleryListProps {
    GalleryData: Gallery[];
}

export const ArtistList: React.FC<ArtistListProps> = ({ ArtistsData: data }) => {

    return (
        <div>
            {data.length === 0 && <p>No artist data found.</p>}
            {data.map((artist) => (
                <p key={artist.artistId}>
                    {artist.artistTitle}
                </p>
            ))}
        </div>
    )
}


export const GalleryList: React.FC<GalleryListProps> = ({ GalleryData: data }) => {

    return (
        <div>
            {data.length === 0 && <p>No gallery data found.</p>}
            {data.map((gallery) => (
                <p key={gallery.galleryId}>
                    {gallery.galleryTitle}
                </p>
            ))}
        </div>
    )
}