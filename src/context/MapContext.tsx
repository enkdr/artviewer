import React, { createContext, useContext, useState } from 'react';
import { Gallery, Artwork } from "../types";
import { getGalleryByGalleryId } from '../db';

type MapContextType = {
    artworks: Artwork[] | null;
    gallery: Gallery | null;
    showArtworkLocations: (artworks: Artwork[]) => void;
    showGalleryOnMapById: (id: string) => void;
    // clearMapMarkers: () => void;
}

const MapContext = createContext<MapContextType | null>(null);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [artworks, setArtworks] = useState<Artwork[] | null>(null);
    const [gallery, setGallery] = useState<Gallery | null>(null);

    const showArtworkLocations = (artworks: Artwork[]) => {
        setArtworks(artworks);
    }

    const showGalleryOnMapById = async (id: string) => {
        const gallery = await getGalleryByGalleryId(id);
        if (gallery) {
            setGallery(gallery);
        } else {
            console.warn("Gallery not found");
        }
    };

    // const clearMapMarkers = () => {
    //     setArtworks(null);
    //     setGallery(null);
    // };

    return (
        <MapContext.Provider value={{ artworks, gallery, showArtworkLocations, showGalleryOnMapById }}>
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