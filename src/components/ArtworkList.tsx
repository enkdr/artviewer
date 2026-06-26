import { forwardRef, useCallback, useState } from 'react';
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
        const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
        const handleImageLoad = useCallback((url: string) => {
            setLoadedImages(prev => new Set(prev).add(url));
        }, []);

        return (
            <div className="artwork-list" ref={ref}>
                {artworks.length === 0 ? (
                    <p className='no-artworks-message'>No {onGallerySelect ? 'artworks' : 'gallery artworks'} found</p>
                ) : (
                    artworks.map((artwork) => (
                        <div key={artwork.artworkId} className="artwork-card">
                            <div
                                className="artwork-image-container"
                                onClick={() => setSelectedArtwork(artwork)}
                            >
                                {!loadedImages.has(artwork.imageUrl) && (
                                    <div className="artwork-image-skeleton" />
                                )}
                                <img
                                    aria-hidden="true"
                                    src={artwork.imageUrl}
                                    className="artwork-image-blur"
                                />
                                <img
                                    loading="lazy"
                                    src={artwork.imageUrl}
                                    alt={artwork.artworkTitle}
                                    className="artwork-image"
                                    onLoad={() => handleImageLoad(artwork.imageUrl)}
                                />
                            </div>
                            <div className="artwork-info">
                                <h3 className="artwork-title">{artwork.artworkTitle}</h3>
                                <h4>{artwork.artistFirstname} {artwork.artistLastname}</h4>
                                <p className="artwork-year">{artwork.artworkYear}</p>
                                <p className="artwork-medium">{artwork.artworkMediums?.join(', ')}</p>
                                <p className="artwork-style">{artwork.artworkStyles?.join(', ')}</p>
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
