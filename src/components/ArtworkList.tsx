import { forwardRef } from 'react';
import { Artwork } from "../types";

interface ArtworkListProps {
    artworks: Artwork[];
    onGallerySelect?: (galleryId: string) => void;
}

export const ArtworkList = forwardRef<HTMLDivElement, ArtworkListProps>(({ artworks, onGallerySelect }, ref) => {
    return (
        <div className="artwork-list" ref={ref}>
            {artworks.length === 0 ? (
                <p>No artworks found for this artist.</p>
            ) : (
                artworks.map((artwork) => (
                    <div key={artwork.artworkId} className="artwork-card">
                        <div className="artwork-image-container">
                            <img
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
                            <p>
                                <a className='link'
                                    href={artwork.artworkGalleryLink || artwork.galleryLink}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {artwork.galleryTitle}
                                </a>
                            </p>
                            {onGallerySelect && (
                                <p
                                    className='more-from-gallery link'
                                    onClick={() => onGallerySelect(artwork.galleryId)}
                                >
                                    More from this gallery
                                </p>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
});
