// TODO sync/update
import { openDB, IDBPDatabase } from 'idb';
import { Artist, Artwork, EntityMeta, Gallery } from './types';

const DB_NAME = 'ArtviewerDB';
const DB_VERSION = 1;

const fetchEntityData: EntityMeta<Artist | Artwork | Gallery>[] = [
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

export async function initDB(): Promise<IDBPDatabase> {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            fetchEntityData.map((config) => {
                if (!db.objectStoreNames.contains(config.key)) {
                    db.createObjectStore(config.key, { keyPath: config.keyPath });
                }
            });
        }
    })
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


export function fetchAndStoreEntities(): Promise<void[]> {
    return Promise.all(fetchEntityData.map(config => fetchAndStoreData<Artist | Artwork | Gallery>(config.key, config.url, config.transform)));
}

// these are kind of custom calls from the UI

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
