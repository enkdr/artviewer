// TODO sync/update
import { openDB, IDBPDatabase } from 'idb';
import { Artist, Artwork, Country, EntityMeta, Gallery } from './types';

const DB_NAME = 'ArtviewerDB';
const DB_VERSION = 1;

// this is setting up and requesting data from the API for IndexedDB
const fetchEntityData: EntityMeta<Artist | Artwork | Gallery | Country>[] = [
    {
        key: 'artists',
        keyPath: 'artistId',
        url: 'https://artsearcher.app/api/artists',
        transform: (data) => Object.values(data as Record<string, Artist>).map((artist) => ({
            ...artist,
            artistImageUrl: artist.artistImageUrl ? `https://artsearcher.app${artist.artistImageUrl}` : "",
        })),
    },
    {
        key: 'artworks',
        keyPath: 'artworkId',
        url: 'https://artsearcher.app/api/artworks_all',
        transform: (data) => Object.values(data as Record<string, Artwork>).map((artwork) => ({
            ...artwork,
            imageUrl: artwork.imageUrl ? `https://artsearcher.app${artwork.imageUrl}` : "",
            artistImageUrl: artwork.artistImageUrl ? `https://artsearcher.app${artwork.artistImageUrl}` : "",
            artworkYear: parseInt(artwork.artworkYear),
        })),
    },
    {
        key: 'galleries',
        keyPath: 'galleryId',
        url: 'https://artsearcher.app/api/galleries',
        transform: (data) => Object.values(data as Record<string, Gallery>).map((gallery) => ({
            ...gallery,
        })),
    },
    {
        key: 'countries',
        keyPath: 'countryId',
        url: 'https://artsearcher.app/api/countries',
        transform: (data) => Object.values(data as Record<string, Country>),
    },
];

export async function initDB(): Promise<IDBPDatabase> {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            fetchEntityData.map((config) => {
                let store;

                if (!db.objectStoreNames.contains(config.key)) {
                    store = db.createObjectStore(config.key, { keyPath: config.keyPath });

                    // Add index based on keyPath (e.g., 'artistId', 'artworkId', 'galleryId')
                    store.createIndex(config.keyPath, config.keyPath, { unique: true });
                } else {
                    // Optional: open existing store to add index if not present (during upgrades)
                    store = db.transaction(config.key, 'versionchange').objectStore(config.key);

                    if (!Array.from(store.indexNames).includes(config.keyPath)) {
                        store.createIndex(config.keyPath, config.keyPath, { unique: true });
                    }
                }
            });
        }
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


export function fetchAndStoreEntities(): Promise<void[]> {
    return Promise.all(fetchEntityData.map(config => fetchAndStoreData<Artist | Artwork | Gallery | Country>(config.key, config.url, config.transform)));
}

// these are fired from App.tsx and pull data from IndexedDB

export async function getAllArtists(): Promise<Artist[]> {
    const db = await initDB();
    return db.getAll('artists');
}

export async function getAllGalleries(): Promise<Gallery[]> {
    const db = await initDB();
    return db.getAll('galleries');
}

export async function getArtworksByArtistId(artistId: string): Promise<Artwork[]> {
    const db = await initDB();
    const allArtworks = await db.getAll('artworks');
    return allArtworks.filter(artwork => artwork.artistId === artistId);
}

export async function getArtworksByGalleryId(galleryId: string): Promise<Artwork[]> {
    const db = await initDB();
    const allArtworks = await db.getAll('artworks');
    return allArtworks.filter(artwork => artwork.galleryId === galleryId);
}

export async function getGalleryByGalleryId(galleryId: string): Promise<Gallery | undefined> {
    const db = await initDB();
    const tx = db.transaction('galleries', 'readonly');
    const store = tx.objectStore('galleries');
    const index = store.index('galleryId'); // index
    const gallery = await index.get(galleryId);
    await tx.done;
    return gallery;
}
