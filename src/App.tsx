import { useState, useEffect } from 'react'
import './App.css'
import ArtMap from './components/Map'
import { getAllArtists, getAllGalleries, getAllStyles, fetchAndStoreEntities, getArtworkCounts } from './db'
import { Artist, Gallery, Style } from './types'
import { Loading } from './components/Loading'
import { ArtistList } from './components/ArtistList'
import { GalleryList } from './components/GalleryList'
import { StyleList } from './components/StyleList'
import { Icon } from './components/Icons'
import { Home } from './components/Home'
import { MapProvider } from './context/MapContext'
import { GalleryMapPopup } from './components/GalleryMapPopup'

function App() {

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [artists, setArtists] = useState<Artist[]>([])
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [styles, setStyles] = useState<Style[]>([])
  const [artworkCounts, setArtworkCounts] = useState<{ byArtist: Map<string, number>; byGallery: Map<string, number>; byStyle: Map<string, number> }>({
    byArtist: new Map(),
    byGallery: new Map(),
    byStyle: new Map(),
  });

  useEffect(() => {
    const init = async () => {
      try {
        await fetchAndStoreEntities();
        const [artistData, galleryData, styleData, counts] = await Promise.all([
          getAllArtists(),
          getAllGalleries(),
          getAllStyles(),
          getArtworkCounts(),
        ]);
        setArtists(artistData);
        setGalleries(galleryData);
        setStyles(styleData.sort((a, b) => a.styleTitle.localeCompare(b.styleTitle)));
        setArtworkCounts(counts);
      } catch (error) {
        setError("Error fetching data from IndexedDB");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const [entityDisplay, setEntityDisplay] = useState<string | null>('home')
  const [selectedGalleryId, setSelectedGalleryId] = useState<string | null>(null);
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  const [mapPopupGallery, setMapPopupGallery] = useState<Gallery | null>(null);
  const [popupFading, setPopupFading] = useState(false);

  const handleGalleryPinClick = (galleryId: string) => {
    const found = galleries.find(g => g.galleryId === galleryId);
    setPopupFading(false);
    setMapPopupGallery(found ?? null);
    onGallerySelect(galleryId);
  };

  const handleMapMoveStart = () => {
    if (mapPopupGallery) setPopupFading(true);
  };

  const handleEmptyMapClick = () => {
    if (mapPopupGallery) setPopupFading(true);
  };

  const onGallerySelect = (galleryId: string) => {
    setSelectedGalleryId(galleryId);
    setEntityDisplay('gallery');
  };

  const onArtistSelect = (artistId: string) => {
    setSelectedArtistId(artistId);
    setEntityDisplay('artist');
  };

  const handleSetEntityDisplay = (display: string | null) => {
    setEntityDisplay(display);
    setSelectedGalleryId(null);
    setSelectedArtistId(null);
  };

  return (
    <MapProvider onGallerySelected={(g) => setMapPopupGallery(g)}>
      <div className="outer-container">
        <div className="sidebar">
          <ul>
            <li onClick={() => handleSetEntityDisplay('home')} className={entityDisplay === 'home' ? 'active' : ''}>
              <Icon icon="home" />
            </li>
            <li onClick={() => handleSetEntityDisplay('artist')} className={entityDisplay === 'artist' ? 'active' : ''}>
              <Icon icon="artist" />
            </li>
            <li onClick={() => handleSetEntityDisplay('gallery')} className={entityDisplay === 'gallery' ? 'active' : ''}>
              <Icon icon="gallery" />
            </li>
            <li onClick={() => handleSetEntityDisplay('style')} className={entityDisplay === 'style' ? 'active' : ''}>
              <Icon icon="style" />
            </li>
          </ul>
        </div>

        <div className="mobile-message">
          <p>This app is best viewed on a desktop device.</p>
          <p>For mobile please check out <a href="https://artsearcher.app">Artsearcher.app</a></p>
        </div>

        <div className="inner-container">
          {loading && <Loading message="Loading..." />}

          <div className="left-section">
            {!loading && !error && (
              <div key={entityDisplay} className="view-fade">
                {entityDisplay === 'artist' && (
                  <ArtistList
                    ArtistsData={artists}
                    onGallerySelect={onGallerySelect}
                    initialArtistId={selectedArtistId}
                    artworkCounts={artworkCounts.byArtist}
                  />
                )}
                {entityDisplay === 'gallery' && (
                  <GalleryList
                    GalleryData={galleries}
                    initialGalleryId={selectedGalleryId}
                    onArtistSelect={onArtistSelect}
                    artworkCounts={artworkCounts.byGallery}
                  />
                )}
                {entityDisplay === 'style' && (
                  <StyleList
                    styles={styles}
                    artworkCounts={artworkCounts.byStyle}
                    onGallerySelect={onGallerySelect}
                    onArtistSelect={onArtistSelect}
                  />
                )}
                {entityDisplay === 'home' && (
                  <Home
                    onNavigate={setEntityDisplay}
                    artistCount={artists.length}
                    galleryCount={galleries.length}
                    styleCount={styles.length}
                    artworkCount={Array.from(artworkCounts.byGallery.values()).reduce((a, b) => a + b, 0)}
                  />
                )}
              </div>
            )}
          </div>

          <div className="right-section">
            <div className="map-placeholder" style={{ position: 'relative' }}>
              <ArtMap
                galleries={galleries}
                onGalleryPinClick={handleGalleryPinClick}
                onMoveStart={handleMapMoveStart}
                onEmptyClick={handleEmptyMapClick}
              />
              {mapPopupGallery && (
                <GalleryMapPopup
                  gallery={mapPopupGallery}
                  fading={popupFading}
                  onClose={() => setMapPopupGallery(null)}
                  onFadeEnd={() => { setMapPopupGallery(null); setPopupFading(false); }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </MapProvider>
  )
}

export default App
