import { useEffect, useRef, useState } from 'react';
import { Artwork, Gallery } from '../types';
import { defaultProfileImage, Icon } from './Icons';
import { getArtworksByGallery } from '../db';

interface GalleryListProps {
    GalleryData: Gallery[];
}

export const GalleryList: React.FC<GalleryListProps> = ({ GalleryData: data }) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const galleryListRef = useRef<HTMLDivElement>(null);
    const artworkListRef = useRef<HTMLDivElement>(null);
    const [selectedGalleryId, setSelectedGalleryId] = useState<string | null>(null);
    const [artworks, setArtworks] = useState<Artwork[]>([]);

    const filteredGalleries = selectedGalleryId
        ? data.filter((gallery) => gallery.galleryId === selectedGalleryId)
        : data.filter((gallery) => gallery.galleryTitle.toLowerCase().includes(searchTerm.toLowerCase()));

    useEffect(() => {
        if (galleryListRef.current) {
            galleryListRef.current.scrollTop = 0;
        }
    }, [searchTerm]);

    useEffect(() => {
        if (selectedGalleryId) {
            const fetchArtworks = async () => {
                const data = await getArtworksByGallery(selectedGalleryId);
                setArtworks(data);
            };
            fetchArtworks();
        }
    }, [selectedGalleryId]);

    useEffect(() => {
        if (artworkListRef.current) {
            artworkListRef.current.scrollTop = 0;
        }
    }, [artworks]);

    const handleGalleryClick = (galleryId: string) => {
        setSelectedGalleryId(galleryId);
        setSearchTerm("");
    };

    const selectedGallery = data.find(gallery => gallery.galleryId === selectedGalleryId);

    return (
        <div>

            {selectedGalleryId && selectedGallery ? (
                <div className="selected-gallery-info">
                    <div className="close-icon-right"><Icon icon="close" onClick={() => setSelectedGalleryId(null)} /> </div>
                    <h4><a href={selectedGallery.galleryLink} target="_blank" rel="noreferrer">{selectedGallery.galleryTitle}</a></h4>
                    <p>{selectedGallery.galleryAddress}</p>
                    <p>{selectedGallery.countryTitle}</p>
                </div>
            ) : (

                <div className={`gallery-list ${selectedGalleryId ? "" : "full-height"}`} ref={galleryListRef}>
                    <input
                        type="text"
                        placeholder="Search galleries"
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => {
                            setSelectedGalleryId(null);
                            setArtworks([]);
                        }}
                    />
                    {filteredGalleries.length === 0 ? (
                        <p>No gallery data found.</p>
                    ) : (
                        filteredGalleries.map((gallery) => (
                            <div
                                key={gallery.galleryId}
                                className="gallery-item"
                                onClick={() => handleGalleryClick(gallery.galleryId)}
                            >
                                <p className="gallery-title">{gallery.galleryTitle}</p>
                            </div>
                        ))
                    )}
                </div>
            )}


            {selectedGalleryId && (
                <div className="artwork-list" ref={artworkListRef}>
                    {artworks.length === 0 ? (
                        <p>No artworks found for this gallery.</p>
                    ) : (
                        artworks.map((artwork) => (
                            <div key={artwork.artworkId} className="artwork-card">
                                <div className="artwork-image-container">
                                    <img
                                        src={artwork.imageUrl || defaultProfileImage}
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
            )}
        </div>
    );
};
