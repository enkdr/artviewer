import { forwardRef } from 'react';
import { Artwork } from "../types";
import { useMap } from '../context/MapContext';

interface ArtworkListProps {
    artworks: Artwork[];
    onGallerySelect?: (galleryId: string) => void;
    onArtistSelect?: (artistId: string) => void;
}

export const ArtworkList = forwardRef<HTMLDivElement, ArtworkListProps>(({ artworks, onGallerySelect, onArtistSelect }, ref) => {

    const { showGalleryOnMapById } = useMap()

    return (
        <div className="artwork-list" ref={ref}>
            {artworks.length === 0 ? (
                <p className='no-artworks-message'>No {onGallerySelect ? 'artworks' : 'gallery artworks'} found</p>
            ) : (
                artworks.map((artwork) => (
                    <div key={artwork.artworkId} className="artwork-card">
                        <div className="artwork-image-container">
                            <img loading="lazy"
                                src={artwork.imageUrl}
                                alt={artwork.artworkTitle}
                                className="artwork-image"
                            />
                        </div>
                        <div className="artwork-info">
                            <h3 className="artwork-title">{artwork.artworkTitle}</h3>
                            <h4>{artwork.artistFirstname} {artwork.artistLastname}</h4>
                            <p className="artwork-year">{artwork.artworkYear}</p>
                            <p className="artwork-medium">{artwork.artworkMedium}</p>
                            <p className="artwork-style">{artwork.artworkStyle}</p>
                            <p className="artwork-dimensions">{artwork.artworkDimensions}</p>
                            <p className='link' onClick={() => showGalleryOnMapById(artwork.galleryId)}>
                                {artwork.galleryTitle}
                            </p>
                            {onGallerySelect && (
                                <p
                                    className='more-from-gallery link'
                                    onClick={() => {
                                        onGallerySelect(artwork.galleryId);
                                        showGalleryOnMapById(artwork.galleryId);
                                    }}
                                >
                                    More from this gallery
                                </p>
                            )}
                            {onArtistSelect && (
                                <p
                                    className='more-from-gallery link'
                                    onClick={() => {
                                        onArtistSelect(artwork.artistId);
                                    }}
                                >
                                    More from this Artist
                                </p>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
});
