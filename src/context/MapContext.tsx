import React, { createContext, useContext, useState } from 'react';
import { Gallery, Artwork } from "../types";
import { getGalleryByGalleryId } from '../db';

type MapContextType = {
    artworks: Artwork[] | null;
    gallery: Gallery | null;
    viewResetCount: number;
    showArtworkLocations: (artworks: Artwork[]) => void;
    showGalleryOnMapById: (id: string) => void;
    clearMapMarkers: () => void;
}

const MapContext = createContext<MapContextType | null>(null);

export const MapProvider: React.FC<{ children: React.ReactNode; onGallerySelected?: (gallery: Gallery) => void }> = ({ children, onGallerySelected }) => {

    const [artworks, setArtworks] = useState<Artwork[] | null>(null);
    const [gallery, setGallery] = useState<Gallery | null>(null);
    const [viewResetCount, setViewResetCount] = useState(0);

    const showArtworkLocations = (artworks: Artwork[]) => {
        setArtworks(artworks);
    }

    const showGalleryOnMapById = async (id: string) => {
        const gallery = await getGalleryByGalleryId(id);
        if (gallery) {
            setGallery(gallery);
            onGallerySelected?.(gallery);
        } else {
            console.warn("Gallery not found");
        }
    };

    const clearMapMarkers = () => {
        setArtworks(null);
        setGallery(null);
        setViewResetCount(c => c + 1);
    };

    return (
        <MapContext.Provider value={{ artworks, gallery, viewResetCount, showArtworkLocations, showGalleryOnMapById, clearMapMarkers }}>
            {children}
        </MapContext.Provider>
    );
}

export const useMap = () => {
    const context = useContext(MapContext);
    if (context === null) {
        throw new Error('useMap must be used within a MapProvider');
    }
    return context;
}