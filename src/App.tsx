import { useState, useEffect } from 'react'
import './App.css'
import Map from './components/Map'
import { fetchAndStoreArtists, fetchAndStoreArtworks, getAllArtists } from './db'
import { Artist } from './types'



function App() {

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // initialise IndexedDB and fetch data 
  // TODO sync/update
  useEffect(() => {
    fetchAndStoreArtists();
    fetchAndStoreArtworks();
  }, [])

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const artistData = await getAllArtists();
        setArtists(artistData);
        setLoading(false);
      } catch (error) {
        setError("Error fetching artists from IndexedDB");
        setLoading(false);
      }
    }
    fetchArtists();
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

            <ul>
              {artists.length === 0 && !loading && !error && <p>No artists found.</p>}
              {artists.map((artist) => (
                <li key={artist.artistId}>
                  <h2>{artist.artistTitle}</h2>
                </li>
              ))}
            </ul>
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
