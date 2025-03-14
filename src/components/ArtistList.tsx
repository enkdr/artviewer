import { useEffect, useRef, useState } from 'react';
import { Artist, Artwork } from '../types';
import { defaultProfileImage, Icon } from './Icons';
import { getArtworksByArtistId } from '../db';
import { ArtworkList } from './ArtworkList';
import { useMap } from '../context/MapContext';

interface ArtistListProps {
    ArtistsData: Artist[];
    onGallerySelect: (galleryId: string) => void;
    initialArtistId: string | null;
}

export const ArtistList: React.FC<ArtistListProps> = ({ ArtistsData: data, onGallerySelect, initialArtistId }) => {
    const [searchTerm, setSearchTerm] = useState<string>("");

    const artistListRef = useRef<HTMLDivElement>(null);
    const artworkListRef = useRef<HTMLDivElement>(null);

    // initialArtistId is passed in from App.tsx which is passed in from Gallery
    // when 'show more from artist' is clicked
    const [selectedArtistId, setSelectedArtistId] = useState<string | null>(initialArtistId);
    const [artworks, setArtworks] = useState<Artwork[]>([]);

    const { showArtworkLocations, clearMapMarkers } = useMap()

    const filteredArtists = selectedArtistId
        ? data.filter((artist) => artist.artistId === selectedArtistId)
        : data.filter((artist) => artist.artistTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    useEffect(() => {
        if (artistListRef.current) {
            artistListRef.current.scrollTop = 0;
        }
    }, [searchTerm]);

    function updateMap(works: Artwork[]) {
        clearMapMarkers()
        showArtworkLocations(works)
    }

    useEffect(() => {
        if (selectedArtistId) {
            const fetchArtworks = async () => {
                const data = await getArtworksByArtistId(selectedArtistId);
                setArtworks(data);
                updateMap(data)
            };
            fetchArtworks();
        }
    }, [selectedArtistId]);

    useEffect(() => {
        if (artworkListRef.current) {
            artworkListRef.current.scrollTop = 0;
        }
    }, [artworks]);

    const handleArtistClick = (artistId: string) => {
        setSelectedArtistId(artistId);
        setSearchTerm("");
    };

    return (
        <div>

            <div className={`list ${selectedArtistId ? "" : "full-height"}`} ref={artistListRef}>
                <input
                    type="text"
                    placeholder="Search artists"
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => {
                        setSelectedArtistId(null);
                        setArtworks([]);
                    }}
                />
                {filteredArtists.length === 0 ? (
                    <p>No artist data found.</p>
                ) : (
                    filteredArtists
                        .sort((a, b) => a.artistTitle.localeCompare(b.artistTitle))
                        .map((artist) => (
                            <div
                                key={artist.artistId}
                                className="list-item"
                                onClick={() => handleArtistClick(artist.artistId)}
                            >
                                <div className="list-image">
                                    {artist.artistImageUrl && artist.artistImageUrl !== "" ? (
                                        <img loading="lazy" src={artist.artistImageUrl} alt={artist.artistTitle} />
                                    ) : (
                                        defaultProfileImage
                                    )}
                                </div>

                                <p className="list-title">
                                    {artist.artistTitle}
                                </p>

                                {selectedArtistId === artist.artistId && (
                                    <div className="close-icon-right">
                                        <Icon
                                            icon="close"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedArtistId(null);
                                                setArtworks([]);
                                                clearMapMarkers();
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                        ))
                )}
            </div>

            {selectedArtistId && (
                <ArtworkList artworks={artworks} ref={artworkListRef} onGallerySelect={onGallerySelect} />
            )}

        </div>
    );
};
