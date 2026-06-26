import { openDB, IDBPDatabase } from 'idb';
import { Artist, Artwork, Country, EntityMeta, Gallery, Style } from './types';

const DB_NAME = 'ArtviewerDB';
const DB_VERSION = 2;

const BASE_URL = 'https://artsearcher.app';

const artworkTransform = (data: unknown): Artwork[] => {
    const items = Array.isArray(data) ? data : Object.values(data as Record<string, Artwork>);
    return (items as Artwork[]).map((artwork) => ({
        ...artwork,
        imageUrl: artwork.imageUrl ? `${BASE_URL}${artwork.imageUrl}` : "",
        artistImageUrl: artwork.artistImageUrl ? `${BASE_URL}${artwork.artistImageUrl}` : "",
        artworkYear: parseInt(artwork.artworkYear as unknown as string) as unknown as string,
    }));
};

// this is setting up and requesting data from the API for IndexedDB
const fetchEntityData: EntityMeta<Artist | Artwork | Gallery | Country | Style>[] = [
    {
        key: 'artists',
        keyPath: 'artistId',
        url: `${BASE_URL}/api/artists`,
        transform: (data) => Object.values(data as Record<string, Artist>).map((artist) => ({
            ...artist,
            artistImageUrl: artist.artistImageUrl ? `${BASE_URL}${artist.artistImageUrl}` : "",
        })),
    },
    {
        key: 'artworks',
        keyPath: 'artworkId',
        url: `${BASE_URL}/api/artworks_all`,
        transform: artworkTransform,
    },
    {
        key: 'galleries',
        keyPath: 'galleryId',
        url: `${BASE_URL}/api/galleries`,
        transform: (data) => Object.values(data as Record<string, Gallery>),
    },
    {
        key: 'countries',
        keyPath: 'countryId',
        url: `${BASE_URL}/api/countries`,
        transform: (data) => Object.values(data as Record<string, Country>),
    },
    {
        key: 'styles',
        keyPath: 'styleId',
        url: `${BASE_URL}/api/styles`,
        transform: (data) => Array.isArray(data) ? data as Style[] : Object.values(data as Record<string, Style>),
    },
];

export async function initDB(): Promise<IDBPDatabase> {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db, oldVersion) {
            for (const config of fetchEntityData) {
                if (!db.objectStoreNames.contains(config.key)) {
                    const store = db.createObjectStore(config.key, { keyPath: config.keyPath });
                    store.createIndex(config.keyPath, config.keyPath, { unique: true });
                }
            }
            if (oldVersion < 2) {
                // Force artworks refetch: schema changed (artworkStyles/artworkMediums now arrays)
                localStorage.removeItem('artviewer_last_fetch_artworks');
            }
        }
    });
}


const TTL_MS = 24 * 60 * 60 * 1000;

export async function fetchAndStoreData<T>(
    dataType: string,
    apiUrl: string,
    transformData: (data: Record<string, T>) => T[]
): Promise<void> {
    try {
        const db = await initDB();

        const existingData = await db.getAll(dataType);
        const lastFetch = localStorage.getItem(`artviewer_last_fetch_${dataType}`);
        const isStale = !lastFetch || Date.now() - parseInt(lastFetch) > TTL_MS;

        if (existingData.length > 0 && !isStale) {
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
        localStorage.setItem(`artviewer_last_fetch_${dataType}`, Date.now().toString());
    } catch (error) {
        console.error(`Error fetching ${dataType}:`, error);
    }
}


export function fetchAndStoreEntities(): Promise<void[]> {
    return Promise.all(fetchEntityData.map(config => fetchAndStoreData<Artist | Artwork | Gallery | Country | Style>(config.key, config.url, config.transform)));
}

// these are fired from App.tsx and pull data from IndexedDB

export async function getArtworkCounts(): Promise<{ byArtist: Map<string, number>; byGallery: Map<string, number>; byStyle: Map<string, number> }> {
    const db = await initDB();
    const allArtworks = await db.getAll('artworks');
    const byArtist = new Map<string, number>();
    const byGallery = new Map<string, number>();
    const byStyle = new Map<string, number>();
    for (const artwork of allArtworks) {
        byArtist.set(artwork.artistId, (byArtist.get(artwork.artistId) ?? 0) + 1);
        byGallery.set(artwork.galleryId, (byGallery.get(artwork.galleryId) ?? 0) + 1);
        for (const style of (artwork.artworkStyles ?? [])) {
            byStyle.set(style, (byStyle.get(style) ?? 0) + 1);
        }
    }
    return { byArtist, byGallery, byStyle };
}

export async function fetchArtworksByStyleId(styleId: string): Promise<Artwork[]> {
    const response = await fetch(`${BASE_URL}/api/style_artworks/${styleId}`);
    const data = await response.json();
    if (!Array.isArray(data)) return [];
    return artworkTransform(data);
}

export async function getAllArtists(): Promise<Artist[]> {
    const db = await initDB();
    return db.getAll('artists');
}

export async function getAllGalleries(): Promise<Gallery[]> {
    const db = await initDB();
    return db.getAll('galleries');
}

export async function getAllStyles(): Promise<Style[]> {
    const db = await initDB();
    return db.getAll('styles');
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
