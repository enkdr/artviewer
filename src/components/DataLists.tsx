import { Artist, Gallery } from '../types'

interface ArtistListProps {
    ArtistsData: Artist[];
}

interface GalleryListProps {
    GalleryData: Gallery[];
}


const defaultProfileImage = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="48" height="48" stroke-width="0.75">
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
        <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
        <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855"></path>
    </svg>
);

export const ArtistList: React.FC<ArtistListProps> = ({ ArtistsData: data }) => {

    return (
        <div className='artist-list'>
            {data.length === 0 && <p>No artist data found.</p>}
            {data.map((artist) => (
                <div key={artist.artistId} className='artist-item'>
                    <div className='artist-image'>
                        {artist.artistImageUrl && artist.artistImageUrl !== "" ? (
                            <img src={artist.artistImageUrl} alt={artist.artistTitle} />
                        ) : (
                            defaultProfileImage
                        )}
                    </div>
                    <p>{artist.artistTitle}</p>
                </div>
            ))}
        </div>
    )
}


export const GalleryList: React.FC<GalleryListProps> = ({ GalleryData: data }) => {

    return (
        <div className='gallery-list'>
            {data.length === 0 && <p>No gallery data found.</p>}
            {data.map((gallery) => (
                <p key={gallery.galleryId}>
                    {gallery.galleryTitle}
                </p>
            ))}
        </div>
    )
}