import { useEffect, useRef, useState } from 'react';
import { Artist, Artwork, Gallery } from '../types';
import { defaultProfileImage } from './Icons';
import { getArtworksByArtist } from '../db';

interface ArtistListProps {
    ArtistsData: Artist[];
}

export const ArtistList: React.FC<ArtistListProps> = ({ ArtistsData: data }) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const artistListRef = useRef<HTMLDivElement>(null);
    const artworkListRef = useRef<HTMLDivElement>(null); // Ref for the artwork list
    const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
    const [artworks, setArtworks] = useState<Artwork[]>([]);

    const filteredArtists = selectedArtistId
        ? data.filter((artist) => artist.artistId === selectedArtistId) // Show only selected artist
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
            artworkListRef.current.scrollTop = 0; // Scroll top when artworks change
        }
    }, [artworks]); // This effect runs whenever artworks change

    const handleArtistClick = (artistId: string) => {
        setSelectedArtistId(artistId);
        setSearchTerm(""); // Clear search input when an artist is selected
    };

    return (
        <div>
            <div className={`artist-list ${selectedArtistId ? "collapsed" : "full-height"}`} ref={artistListRef}>
                <input
                    type="text"
                    placeholder="Search artists"
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => {
                        setSelectedArtistId(null); // Reset selected artist
                        setArtworks([]); // Clear artworks
                    }}
                />
                {filteredArtists.length === 0 ? (
                    <p>No artist data found.</p>
                ) : (
                    filteredArtists.map((artist) => (
                        <div
                            key={artist.artistId}
                            className="artist-item"
                            onClick={() => handleArtistClick(artist.artistId)} // Add click handler
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
                <div className="artwork-list" ref={artworkListRef}> {/* Added ref here */}
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

interface GalleryListProps {
    GalleryData: Gallery[];
}

export const GalleryList: React.FC<GalleryListProps> = ({ GalleryData: data }) => {
    return (
        <div className="gallery-list">
            {data.length === 0 && <p>No gallery data found.</p>}
            {data.map((gallery) => (
                <p key={gallery.galleryId}>{gallery.galleryTitle}</p>
            ))}
        </div>
    );
};
