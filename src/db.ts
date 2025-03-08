// TODO sync/update
import { openDB, IDBPDatabase } from 'idb';
import { Artist, Artwork, FetchConfig, Gallery } from './types';

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
            if (!db.objectStoreNames.contains('galleries')) {
                db.createObjectStore('galleries', { keyPath: 'galleryId' });
            }
        },
    });
}

export async function fetchAndStoreData<T>(
    dataType: string,
    apiUrl: string,
    transformData: (data: Record<string, T>) => T[]
): Promise<void> {
    try {
        const db = await initDB();

        const existingData = await db.getAll(dataType);
        if (existingData.length > 0) {
            console.log(`${dataType} already stored`);
            return;
        }

        const response = await fetch(apiUrl);
        const rawData = await response.json();

        if (typeof rawData !== "object" || rawData === null) {
            throw new Error(`Invalid data format for ${dataType}`);
        }

        const transformedData = transformData(rawData as Record<string, T>);

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


const fetchConfigs: FetchConfig<Artist | Artwork | Gallery>[] = [
    {
        key: 'artists',
        keyPath: 'artistId',
        url: 'https://artsearcher.app/api/artists',
        transform: (data) => Object.values(data as Record<string, Artist>),
    },
    {
        key: 'artworks',
        keyPath: 'artworkId',
        url: 'https://artsearcher.app/api/artworks_all',
        transform: (data) => Object.values(data as Record<string, Artwork>),
    },
    {
        key: 'galleries',
        keyPath: 'galleryId',
        url: 'https://artsearcher.app/api/galleries',
        transform: (data) => Object.values(data as Record<string, Gallery>),
    },
];

export function fetchAndStoreEntities(): Promise<void[]> {
    return Promise.all(fetchConfigs.map(config => fetchAndStoreData<Artist | Artwork | Gallery>(config.key, config.url, config.transform)));
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

// get from indexedDB

export async function getAllArtists(): Promise<Artist[]> {
    const db = await initDB();
    return db.getAll('artists');
}

export async function getAllGalleries(): Promise<Gallery[]> {
    const db = await initDB();
    return db.getAll('galleries');
}

export async function getArtworksByArtist(artistId: string): Promise<Artwork[]> {
    const db = await initDB();
    const allArtworks = await db.getAll('artworks');
    return allArtworks.filter(artwork => artwork.artistId === artistId);
}
