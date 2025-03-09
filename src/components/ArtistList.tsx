import { useEffect, useRef, useState } from 'react';
import { Artist, Artwork } from '../types';
import { defaultProfileImage } from './Icons';
import { getArtworksByArtist } from '../db';

interface ArtistListProps {
    ArtistsData: Artist[];
}

export const ArtistList: React.FC<ArtistListProps> = ({ ArtistsData: data }) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const artistListRef = useRef<HTMLDivElement>(null);
    const artworkListRef = useRef<HTMLDivElement>(null);
    const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
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
                                    <img src={artist.artistImageUrl} alt={artist.artistTitle} />
                                ) : (
                                    <img src={defaultProfileImage} alt="Default profile" />
                                )}
                            </div>
                            <p className="artist-title">{artist.artistTitle}</p>
                        </div>
                    ))
                )}
            </div>

            {selectedArtistId && (
                <div className="artwork-list" ref={artworkListRef}>
                    {artworks.length === 0 ? (
                        <p>No artworks found for this artist.</p>
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
