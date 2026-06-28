interface HomeProps {
    onNavigate: (section: string) => void;
    artistCount: number;
    galleryCount: number;
    styleCount: number;
    artworkCount?: number;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, artistCount, galleryCount, styleCount, artworkCount = 0 }) => {
    const sections = [
        { key: 'artwork', label: 'Artworks', count: artworkCount },
        { key: 'artist', label: 'Artists', count: artistCount },
        { key: 'gallery', label: 'Galleries', count: galleryCount },
        { key: 'style', label: 'Styles', count: styleCount },
    ];

    return (
        <div className="home-container">
            <div className="home-hero">
                <p className="home-eyebrow">Art Discovery</p>
                <h1 className="home-title">ArtViewer</h1>
                <p className="home-subtitle">
                    Explore galleries and artists from around the world, mapped and curated in one place.
                </p>
            </div>

            {artworkCount > 0 && (
                <div className="home-stats">
                    <div className="home-stat">
                        <span className="home-stat-number">{artworkCount.toLocaleString()}</span>
                        <span className="home-stat-label">Artworks</span>
                    </div>
                    <div className="home-stat-divider" />
                    <div className="home-stat">
                        <span className="home-stat-number">{artistCount.toLocaleString()}</span>
                        <span className="home-stat-label">Artists</span>
                    </div>
                    <div className="home-stat-divider" />
                    <div className="home-stat">
                        <span className="home-stat-number">{galleryCount.toLocaleString()}</span>
                        <span className="home-stat-label">Galleries</span>
                    </div>
                </div>
            )}

            <div className="home-nav">
                {sections.map(({ key, label, count }) => (
                    <button key={key} className="home-nav-item" onClick={() => onNavigate(key)}>
                        <span className="home-nav-label">{label}</span>
                        {count > 0 && <span className="home-nav-count">{count.toLocaleString()}</span>}
                        <span className="home-nav-arrow">›</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
