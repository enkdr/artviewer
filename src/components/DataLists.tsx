import { useEffect, useRef, useState } from 'react';
import { Artist, Gallery } from '../types'
import { defaultProfileImage } from './Icons'

interface ArtistListProps {
    ArtistsData: Artist[];
}

export const ArtistList: React.FC<ArtistListProps> = ({ ArtistsData: data }) => {

    const [searchTerm, setSearchTerm] = useState<string>("");
    const artistListRef = useRef<HTMLDivElement>(null);

    const filteredArtists = data.filter((artist) => {
        return artist.artistTitle.toLowerCase().includes(searchTerm.toLowerCase());
    });

    useEffect(() => {
        if (artistListRef.current) {
            artistListRef.current.scrollTop = 0;
        }
    }, [searchTerm]);

    return (
        <div className='artist-list' ref={artistListRef}>
            <input
                type="text"
                placeholder="Search artists"
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredArtists.length === 0 ? (
                <p>No artist data found.</p>
            ) : (
                filteredArtists.map((artist) => (
                    <div key={artist.artistId} className='artist-item'>
                        <div className='artist-image'>
                            {artist.artistImageUrl && artist.artistImageUrl !== "" ? (
                                <img src={artist.artistImageUrl} alt={artist.artistTitle} />
                            ) : (
                                <img src={defaultProfileImage} alt="Default profile" />
                            )}
                        </div>
                        <p className='artist-title'>{artist.artistTitle}</p>
                    </div>
                ))
            )}
        </div>
    );
}


interface GalleryListProps {
    GalleryData: Gallery[];
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