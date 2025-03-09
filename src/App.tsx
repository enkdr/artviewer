import { useState, useEffect } from 'react'
import './App.css'
import Map from './components/Map'
import { getAllArtists, getAllGalleries, getArtworksByArtist, fetchAndStoreEntities } from './db'
import { Artist, Artwork, Gallery } from './types'
import { Loading } from './components/Loading'
import { ArtistList, GalleryList } from './components/DataLists'
import { Icon } from './components/Icons'

function App() {

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [artists, setArtists] = useState<Artist[]>([])
  const [galleries, setGalleries] = useState<Gallery[]>([])

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

  return (
    <>
      <div className="outer-container">
        <div className="sidebar">
          <ul>
            <li>
              <Icon icon="home" />
            </li>
            <li>
              <Icon icon="artist" />
            </li>
            <li>
              <Icon icon="gallery" />
            </li>
            <li>
              <Icon icon="map" />
            </li>
          </ul>
        </div>
        <div className="inner-container">
          {loading && <Loading message="Loading..." />}
          <div className="left-section">

            {!loading && !error && (
              <ArtistList ArtistsData={artists} />
            )}

          </div>
          <div className="right-section">
            <div className="map-placeholder">
              <Map />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
