import { forwardRef, useState } from 'react';
import { Artwork } from "../types";
import { useMap } from '../context/MapContext';
import { ArtworkModal } from './ArtworkModal';

interface ArtworkListProps {
    artworks: Artwork[];
    onGallerySelect?: (galleryId: string) => void;
    onArtistSelect?: (artistId: string) => void;
}

export const ArtworkList = forwardRef<HTMLDivElement, ArtworkListProps>(
    ({ artworks, onGallerySelect, onArtistSelect }, ref) => {

        const { showGalleryOnMapById } = useMap();

        const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

        return (
            <div className="artwork-list" ref={ref}>
                {artworks.length === 0 ? (
                    <p className='no-artworks-message'>No {onGallerySelect ? 'artworks' : 'gallery artworks'} found</p>
                ) : (
                    artworks.map((artwork) => (
                        <div key={artwork.artworkId} className="artwork-card">
                            <div
                                className="artwork-image-container"
                                onClick={() => setSelectedArtwork(artwork)} // Open modal on image click
                            >
                                <img
                                    loading="lazy"
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
                                <p
                                    className='link'
                                    onClick={() => showGalleryOnMapById(artwork.galleryId)}
                                >
                                    {artwork.galleryTitle}
                                </p>
                                {onGallerySelect && (
                                    <p
                                        className='link'
                                        onFocus={() => onGallerySelect(artwork.galleryId)}
                                        onClick={() => {
                                            onGallerySelect(artwork.galleryId);
                                            showGalleryOnMapById(artwork.galleryId);
                                        }}
                                    >
                                        More from {artwork.galleryTitle}
                                    </p>
                                )}
                                {onArtistSelect && (
                                    <p
                                        className='link'
                                        onClick={() => {
                                            onArtistSelect(artwork.artistId);
                                        }}
                                    >
                                        More works by {artwork.artistTitle}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))
                )}

                {/* Fullscreen Modal */}
                {selectedArtwork && (
                    <ArtworkModal artwork={selectedArtwork} onClose={() => setSelectedArtwork(null)} />
                )}
            </div>
        );
    });
