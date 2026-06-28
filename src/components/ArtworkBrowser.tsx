import { useEffect, useRef, useState } from 'react';
import { Artwork } from '../types';
import { getAllArtworks } from '../db';
import { ArtworkList } from './ArtworkList';
import { useMap } from '../context/MapContext';

interface ArtworkBrowserProps {
    onGallerySelect: (galleryId: string) => void;
    onArtistSelect: (artistId: string) => void;
}

export const ArtworkBrowser: React.FC<ArtworkBrowserProps> = ({ onGallerySelect, onArtistSelect }) => {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const listRef = useRef<HTMLDivElement>(null);
    const { clearMapMarkers } = useMap();

    useEffect(() => {
        getAllArtworks().then(setArtworks);
    }, []);

    useEffect(() => {
        if (listRef.current) listRef.current.scrollTop = 0;
    }, [searchTerm]);

    const filtered = searchTerm
        ? artworks.filter(a =>
            a.artworkTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.artistTitle.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : artworks;

    return (
        <div>
            <div style={{ padding: '0 1rem' }}>
                <div className="search-wrapper">
                    <input
                        type="text"
                        placeholder="Search artworks"
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => clearMapMarkers()}
                    />
                </div>
            </div>
            <ArtworkList
                ref={listRef}
                className="full-height"
                artworks={filtered}
                onGallerySelect={onGallerySelect}
                onArtistSelect={onArtistSelect}
            />
        </div>
    );
};
