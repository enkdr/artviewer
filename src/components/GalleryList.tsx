import { useEffect, useRef, useState } from 'react';
import { Artwork, Gallery } from '../types';
import { getArtworksByGalleryId } from '../db';
import { Icon } from './Icons';
import { ArtworkList } from './ArtworkList';
import { useMap } from '../context/MapContext';

interface GalleryListProps {
    GalleryData: Gallery[];
    initialGalleryId: string | null;
    onArtistSelect: (artistId: string) => void;
}

export const GalleryList: React.FC<GalleryListProps> = ({ GalleryData: data, initialGalleryId, onArtistSelect }) => {

    const { showGalleryOnMapById } = useMap()

    const [searchTerm, setSearchTerm] = useState<string>("");
    const galleryListRef = useRef<HTMLDivElement>(null);
    const artworkListRef = useRef<HTMLDivElement>(null);
    const [selectedGalleryId, setSelectedGalleryId] = useState<string | null>(initialGalleryId);

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
                const data = await getArtworksByGalleryId(selectedGalleryId);
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
                <div className={`list ${selectedGalleryId ? "" : "full-height"}`} ref={galleryListRef}>
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
                        filteredGalleries
                            .sort((a, b) => a.galleryTitle.localeCompare(b.galleryTitle))
                            .map((gallery: Gallery) => (
                                <div
                                    key={gallery.galleryId}
                                    className="list-item"
                                    onClick={() => {
                                        handleGalleryClick(gallery.galleryId);
                                        showGalleryOnMapById(gallery.galleryId);
                                    }}
                                >
                                    <div className="list-image">
                                        <Icon icon="gallery" className='list-svg' />
                                    </div>
                                    <p className="list-title">
                                        {gallery.galleryTitle}
                                    </p>
                                    {/* {selectedGalleryId === gallery.galleryId && (
                                        <div className="close-icon-right">
                                            <Icon
                                                icon="close"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedGalleryId(null);
                                                }}
                                            />
                                        </div>
                                    )} */}

                                </div>
                            ))
                    )}
                </div>
            )}
            {selectedGalleryId && (
                <ArtworkList artworks={artworks} ref={artworkListRef} onArtistSelect={onArtistSelect} />
            )}
        </div>
    );
};
