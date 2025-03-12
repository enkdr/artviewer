import React, { createContext, useContext, useState } from 'react';
import { Location, Gallery } from "../types";
import { getGalleryByGalleryId } from '../db';

type MapContextType = {
    locations: Location[] | null;
    gallery: Gallery | null;
    updateLocations: (loc: Location[] | Location) => void;
    showGalleryOnMapById: (id: string) => void;
}

const MapContext = createContext<MapContextType | null>(null);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const showGalleryOnMapById = async (id: string) => {
        const gallery = await getGalleryByGalleryId(id);
        if (gallery) {
            setGallery(gallery);
        } else {
            console.warn("Gallery not found");
        }
    };

    const [locations, setLocations] = useState<Location[] | null>(null);
    const [gallery, setGallery] = useState<Gallery | null>(null);

    const updateLocations = (loc: Location[] | Location) => {
        setLocations(Array.isArray(loc) ? loc : [loc]);
    }


    return (
        <MapContext.Provider value={{ locations, gallery, updateLocations, showGalleryOnMapById }}>
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