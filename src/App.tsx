import { useState, useEffect } from 'react'
import './App.css'
import Map from './components/Map'
import { getAllArtists, getAllGalleries, fetchAndStoreEntities } from './db'
import { Artist, Gallery } from './types'
import { Loading } from './components/Loading'
import { ArtistList } from './components/ArtistList'
import { GalleryList } from './components/GalleryList'
import { Icon } from './components/Icons'
import { Home } from './components/Home'
import { MapProvider } from './context/MapContext'

function App() {

  // initialise IndexedDB and fetch data OR pull from existing data
  useEffect(() => {
    const init = async () => {
      try {

        await fetchAndStoreEntities();

        // custom calls from UI to get from indexedDB
        const artistData = await getAllArtists();
        const gallerytData = await getAllGalleries();

        setArtists(artistData);
        setGalleries(gallerytData);

      } catch (error) {
        setError("Error fetching artists from IndexedDB");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [artists, setArtists] = useState<Artist[]>([])
  const [galleries, setGalleries] = useState<Gallery[]>([])

  const [entityDisplay, setEntityDisplay] = useState<string | null>('home')

  // from ArtistsList -> ArtworkList -> 'more from gallery' link 
  const [selectedGalleryId, setSelectedGalleryId] = useState<string | null>(null);
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);

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
    <MapProvider>
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
            {/* <li>
              <Icon icon="map" />
            </li> */}
          </ul>
        </div>
        <div className="inner-container">
          {loading && <Loading message="Loading..." />}

          <div className="left-section">
            {!loading && !error && (
              <>
                {entityDisplay === 'artist' && (
                  // pass in onGallerySelect for 'more from gallery' link
                  <ArtistList ArtistsData={artists} onGallerySelect={onGallerySelect} initialArtistId={selectedArtistId} />
                )}
                {entityDisplay === 'gallery' && (
                  // pass in galleryId for 'more from gallery' link 
                  <GalleryList GalleryData={galleries} initialGalleryId={selectedGalleryId} onArtistSelect={onArtistSelect} />
                )}
                {entityDisplay === 'home' && <Home onClick={() => setEntityDisplay('artist')} />}
              </>
            )}
          </div>

          <div className="right-section">
            <div className="map-placeholder">
              <Map />
            </div>
          </div>
        </div>
      </div >
    </MapProvider>
  )
}

export default App
