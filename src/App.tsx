import { useState, useEffect } from 'react'
import './App.css'
import Map from './components/Map'
import { getAllArtists, getAllGalleries, getArtworksByArtist, fetchAndStoreEntities } from './db'
import { Artist, Artwork, Gallery } from './types'
import { Loading } from './components/Loading'
import { ArtistList, GalleryList } from './components/DataLists'

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


  // const [artworks, setArtworks] = useState<Artwork[]>([]);

  // useEffect(() => {
  //   const fetchArtworks = async () => {
  //     const data = await getArtworksByArtist('8m63wys32ywhe11');
  //     setArtworks(data);
  //   };
  //   fetchArtworks();
  // }, []);

  return (
    <>
      <div className="outer-container">
        <ul className="sidebar">
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="32" height="32" stroke-width="1" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor">
              <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
              <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
            </svg>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="32" height="32" stroke-width="1">
              <path d="M5 3h1a1 1 0 0 1 1 1v2h3v-2a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2h3v-2a1 1 0 0 1 1 -1h1a1 1 0 0 1 1 1v4.394a2 2 0 0 1 -.336 1.11l-1.328 1.992a2 2 0 0 0 -.336 1.11v7.394a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1v-7.394a2 2 0 0 0 -.336 -1.11l-1.328 -1.992a2 2 0 0 1 -.336 -1.11v-4.394a1 1 0 0 1 1 -1z"></path>
              <path d="M10 21v-5a2 2 0 1 1 4 0v5"></path>
            </svg>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="32" height="32" stroke-width="1">
              <path d="M3 7l6 -3l6 3l6 -3v13l-6 3l-6 -3l-6 3v-13"></path>
              <path d="M9 4v13"></path>
              <path d="M15 7v13"></path>
            </svg>
          </li>
        </ul>
        <div className="inner-container">
          {loading && <Loading message="Loading..." />}
          <div className="left-section">
            <div className="column column-1">
              {!loading && !error && (
                // 
                <ArtistList ArtistsData={artists} />
              )}
              {!loading && !error && (
                <GalleryList GalleryData={galleries} />
              )}
            </div>
            <div className="column column-2">Column 2</div>
          </div>
          <div className="map-section">
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
