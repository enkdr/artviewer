import { useEffect, useRef, useState } from 'react';
import { Artist, Artwork } from '../types';
import { defaultProfileImage, Icon } from './Icons';
import { getArtworksByArtist } from '../db';
import { ArtworkList } from './ArtworkList';

interface ArtistListProps {
    ArtistsData: Artist[];
    onGallerySelect: (galleryId: string) => void;
    initialArtistId: string | null;
}

export const ArtistList: React.FC<ArtistListProps> = ({ ArtistsData: data, onGallerySelect, initialArtistId }) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const artistListRef = useRef<HTMLDivElement>(null);
    const artworkListRef = useRef<HTMLDivElement>(null);
    // const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
    const [selectedArtistId, setSelectedArtistId] = useState<string | null>(initialArtistId);
    const [artworks, setArtworks] = useState<Artwork[]>([]);

    const filteredArtists = selectedArtistId
        ? data.filter((artist) => artist.artistId === selectedArtistId)
        : data.filter((artist) => artist.artistTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    useEffect(() => {
        if (artistListRef.current) {
            artistListRef.current.scrollTop = 0;
        }
    }, [searchTerm]);

    useEffect(() => {
        if (selectedArtistId) {
            const fetchArtworks = async () => {
                const data = await getArtworksByArtist(selectedArtistId);
                setArtworks(data);
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
            <div className={`artist-list ${selectedArtistId ? "" : "full-height"}`} ref={artistListRef}>
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
                    filteredArtists.map((artist) => (
                        <div
                            key={artist.artistId}
                            className="artist-item"
                            onClick={() => handleArtistClick(artist.artistId)}
                        >
                            <div className="artist-image">
                                {artist.artistImageUrl && artist.artistImageUrl !== "" ? (
                                    <img loading="lazy" src={artist.artistImageUrl} alt={artist.artistTitle} />
                                ) : (
                                    defaultProfileImage
                                )}
                            </div>
                            <p className="artist-title">
                                {artist.artistTitle}
                            </p>

                            {selectedArtistId === artist.artistId && (
                                <div className="close-icon-right">
                                    <Icon
                                        icon="close"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedArtistId(null);
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
