import { forwardRef } from 'react';
import { Artwork } from "../types";

interface ArtworkListProps {
    artworks: Artwork[];
}

export const ArtworkList = forwardRef<HTMLDivElement, ArtworkListProps>(({ artworks }, ref) => {
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
                            <a
                                href={artwork.artworkGalleryLink || artwork.galleryLink}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {artwork.galleryTitle}
                            </a>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
});
