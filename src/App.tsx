import { useState, useEffect, useRef } from 'react'
import './App.css'
import Map from './components/Map'
import { fetchAndStoreArtists, fetchAndStoreArtworks, getAllArtists } from './db'
import { Artist } from './types'



function App() {

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const selectRef = useRef<HTMLSelectElement>(null)

  // initialise IndexedDB and fetch data 
  // TODO sync/update
  useEffect(() => {
    const init = async () => {
      try {
        await fetchAndStoreArtists();
        await fetchAndStoreArtworks();
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


  console.log(artists)

  return (
    <>
      <div className="container">
        <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>{sidebarOpen ? "×" : "☰"}</button>
        <div className={`sidebar ${sidebarOpen ? "open" : ""}`} id="sidebar">
          <h2>ArtViewer</h2>

          <input className="search-input" type="text" placeholder="Search Bar" />

          <div>
            {loading && <p>Loading...</p>}
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
