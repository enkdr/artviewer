import { useEffect, useRef, useState } from 'react';
import { Artwork, Style } from '../types';
import { fetchArtworksByStyleId } from '../db';
import { ArtworkList } from './ArtworkList';
import { Icon } from './Icons';
import { useMap } from '../context/MapContext';

interface StyleListProps {
    styles: Style[];
    artworkCounts?: Map<string, number>;
    onGallerySelect: (galleryId: string) => void;
    onArtistSelect: (artistId: string) => void;
}

export const StyleList: React.FC<StyleListProps> = ({ styles, artworkCounts, onGallerySelect, onArtistSelect }) => {
    const { showArtworkLocations, clearMapMarkers } = useMap();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState(false);

    const listRef = useRef<HTMLDivElement>(null);
    const artworkListRef = useRef<HTMLDivElement>(null);
    const savedScrollRef = useRef(0);

    const filtered = selectedStyle
        ? styles.filter(s => s.styleId === selectedStyle.styleId)
        : styles.filter(s => s.styleTitle.toLowerCase().includes(searchTerm.toLowerCase()));

    useEffect(() => {
        if (listRef.current) listRef.current.scrollTop = 0;
    }, [searchTerm]);

    useEffect(() => {
        if (artworkListRef.current) artworkListRef.current.scrollTop = 0;
    }, [artworks]);

    useEffect(() => {
        if (selectedStyle) {
            savedScrollRef.current = listRef.current?.scrollTop ?? 0;
            setLoading(true);
            fetchArtworksByStyleId(selectedStyle.styleId).then(data => {
                setArtworks(data);
                showArtworkLocations(data);
                setLoading(false);
            });
        } else {
            requestAnimationFrame(() => {
                if (listRef.current) listRef.current.scrollTop = savedScrollRef.current;
            });
        }
    }, [selectedStyle]);

    const handleSelect = (style: Style) => {
        setSelectedStyle(style);
        setSearchTerm('');
    };

    return (
        <div>
            <div className={`list ${selectedStyle ? '' : 'full-height'}`} ref={listRef}>
                {selectedStyle ? (
                    <div className="selected-gallery-info">
                        <div className="selected-gallery-info-header">
                            <h4 className="selected-gallery-title">{selectedStyle.styleTitle}</h4>
                            <div className="selected-gallery-close-icon">
                                <Icon icon="close" onClick={() => {
                                    setSelectedStyle(null);
                                    setArtworks([]);
                                    clearMapMarkers();
                                }} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="search-wrapper">
                            <input
                                type="text"
                                placeholder="Search styles"
                                className="search-input"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                onFocus={() => {
                                    setSelectedStyle(null);
                                    setArtworks([]);
                                    clearMapMarkers();
                                }}
                            />
                        </div>
                        {filtered.length === 0 ? (
                            <p>No styles found.</p>
                        ) : (
                            filtered.map(style => (
                                <div key={style.styleId} className="list-item" onClick={() => handleSelect(style)}>
                                    <div className="list-image">
                                        <Icon icon="style" className="list-svg" />
                                    </div>
                                    <p className="list-title">{style.styleTitle}</p>
                                    {artworkCounts?.has(style.styleTitle) && (
                                        <span className="list-count">{artworkCounts.get(style.styleTitle)}</span>
                                    )}
                                </div>
                            ))
                        )}
                    </>
                )}
            </div>
            {selectedStyle && (
                <ArtworkList
                    artworks={loading ? [] : artworks}
                    ref={artworkListRef}
                    onGallerySelect={onGallerySelect}
                    onArtistSelect={onArtistSelect}
                />
            )}
        </div>
    );
};
