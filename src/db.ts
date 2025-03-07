// TODO sync/update
import { openDB, IDBPDatabase } from 'idb';
import { Artist, Artwork, Gallery } from './types';

const DB_NAME = 'ArtviewerDB';
const DB_VERSION = 3;

export async function initDB(): Promise<IDBPDatabase> {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('artists')) {
                db.createObjectStore('artists', { keyPath: 'artistId' });
            }
            if (!db.objectStoreNames.contains('artworks')) {
                db.createObjectStore('artworks', { keyPath: 'artworkId' });
            }
            if (!db.objectStoreNames.contains('galleries')) {
                db.createObjectStore('galleries', { keyPath: 'galleryId' });
            }
        },
    });
}

export async function fetchAndStoreData<T>(dataType: string, apiUrl: string, transformData: (data: any) => T[]): Promise<void> {
    try {
        const db = await initDB();

        // check if data already exists in 
        const existingData = await db.getAll(dataType);
        if (existingData.length > 0) {
            console.log(`${dataType} already stored`);
            return;
        }

        // fetch new data
        const response = await fetch(apiUrl);
        const data = await response.json();
        const transformedData = transformData(data);

        // store data in IndexedDB
        const tx = db.transaction(dataType, 'readwrite');
        const store = tx.objectStore(dataType);

        for (const item of transformedData) {
            await store.put(item);
        }

        await tx.done;
        console.log(`${dataType} stored successfully`);
    } catch (error) {
        console.error(`Error fetching ${dataType}:`, error);
    }
}

export function fetchAndStoreArtists(): Promise<void> {
    return fetchAndStoreData<Artist>(
        'artists',
        'https://artsearcher.app/api/artists',
        (data) => Object.values(data) as Artist[]
    );
}

export function fetchAndStoreArtworks(): Promise<void> {
    return fetchAndStoreData<Artwork>(
        'artworks',
        'https://artsearcher.app/api/artworks_all',
        (data) => Object.values(data) as Artwork[]
    );
}

export function fetchAndStoreGalleries(): Promise<void> {
    return fetchAndStoreData<Gallery>(
        'galleries',
        'https://artsearcher.app/api/galleries',
        (data) => Object.values(data) as Gallery[]
    );
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
