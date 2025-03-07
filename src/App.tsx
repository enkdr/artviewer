import { useState, useEffect, useMemo } from 'react'
import './App.css'
import Map from './components/Map'
import { fetchAndStoreArtists, fetchAndStoreArtworks, fetchAndStoreGalleries, getAllArtists, getArtworksByArtist } from './db'
import { Artist, Artwork } from './types'
import { Loading } from './components/Loading'


function App() {

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // initialise IndexedDB and fetch data OR pull from existing data
  useEffect(() => {
    const init = async () => {
      try {
        await fetchAndStoreArtists();
        await fetchAndStoreArtworks();
        await fetchAndStoreGalleries();
        const artistData = await getAllArtists();
        setArtists(artistData);
      } catch (error) {
        setError("Error fetching artists from IndexedDB");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);


  const [artworks, setArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    const fetchArtworks = async () => {
      const data = await getArtworksByArtist('8m63wys32ywhe11');
      setArtworks(data);
    };
    fetchArtworks();
  }, []);


  console.log(" :: artworks :: ", artworks)

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
                <option value="">Select an artist</option>
                {artists.map((artist) => (
                  <option key={artist.artistId} value={artist.artistId}>
                    {artist.artistTitle}
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
