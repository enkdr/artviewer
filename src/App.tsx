import { useState, useEffect } from 'react'
import './App.css'
import Map from './components/Map'
import { getAllArtists, getAllGalleries, getArtworksByArtist, fetchAndStoreEntities } from './db'
import { Artist, Artwork } from './types'
import { Loading } from './components/Loading'


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
      <div className="container">
        <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>{sidebarOpen ? "×" : "☰"}</button>
        <div className={`sidebar ${sidebarOpen ? "open" : ""}`} id="sidebar">

          <h2>ArtViewer</h2>

          <input className="search-input" type="text" placeholder="Search" />

          <div>
            {loading && <Loading message='Loading artists' />}

            {error && <p>{error}</p>}

            {artists.length === 0 && !loading && !error ? (
              <p>No artists found.</p>) : (
              <select className='artist-select'>
                <option value="">Select an Artist</option>
                {artists.map((artist) => (
                  <option key={artist.artistId} value={artist.artistId}>
                    {artist.artistTitle}
                  </option>
                ))}
              </select>
            )}


            {galleries.length === 0 && !loading && !error ? (
              <p>No artists found.</p>) : (
              <select className='artist-select'>
                <option value="">Select a Gallery</option>
                {galleries.map((gallery) => (
                  <option key={gallery.galleryId} value={gallery.galleryId}>
                    {gallery.galleryTitle}
                  </option>
                ))}
              </select>
            )}

          </div>

        </div>
        <div className="map-container">
          <Map />
        </div>
      </div>
    </>
  )
}

export default App
