import { openDB, IDBPDatabase } from 'idb';
import { Artist, Artwork } from './types';

const DB_NAME = 'ArtviewerDB';
const DB_VERSION = 1;

export async function initDB(): Promise<IDBPDatabase> {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('artists')) {
                db.createObjectStore('artists', { keyPath: 'artistId' });
            }
            if (!db.objectStoreNames.contains('artworks')) {
                db.createObjectStore('artworks', { keyPath: 'artworkId' });
            }
        },
    });
}

export async function fetchAndStoreArtists(): Promise<void> {
    try {

        const response = await fetch('https://artsearcher.app/api/artists');
        const data = await response.json();
        const artists: Artist[] = Object.values(data);

        const db = await initDB();
        const tx = db.transaction('artists', 'readwrite');
        const store = tx.objectStore('artists');

        for (const artist of artists) {
            await store.put(artist);
        }

        await tx.done;
        console.log('Artists stored');
    } catch (error) {
        console.error('Error fetching artists:', error);
    }
}

export async function fetchAndStoreArtworks() {
    try {
        const response = await fetch('https://artsearcher.app/api/artworks_all');
        const data = await response.json();
        const artworks: Artwork[] = Object.values(data);

        const db = await initDB();
        const tx = db.transaction('artworks', 'readwrite');
        const store = tx.objectStore('artworks');

        for (const artwork of artworks) {
            await store.put(artwork);
        }

        await tx.done;
        console.log('Artworks saved to IndexedDB');
    } catch (error) {
        console.error('Error fetching artworks:', error);
    }
}

export async function getAllArtists(): Promise<Artist[]> {
    const db = await initDB();
    return db.getAll('artists');
}

export async function getArtworksByArtist(artistId: string): Promise<Artwork[]> {
    const db = await initDB();
    const allArtworks = await db.getAll('artworks');
    return allArtworks.filter(artwork => artwork.artistId === artistId);
}
