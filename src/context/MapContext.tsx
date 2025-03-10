import React, { createContext, useContext, useState } from 'react';
import { Location } from "../types";

type MapContextType = {
    locations: Location[] | null;
    updateLocations: (loc: Location[] | Location) => void;
    showGalleryOnMap: (lat: number, lon: number) => void;
}

const MapContext = createContext<MapContextType | null>(null);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [locations, setLocations] = useState<Location[] | null>(null);

    const updateLocations = (loc: Location[] | Location) => {
        setLocations(Array.isArray(loc) ? loc : [loc]);
    }

    const showGalleryOnMap = (lat: number, lon: number) => {
        setLocations([{ lat, lon }]); // Update the map location with the selected gallery's lat/lon
    };

    return (
        <MapContext.Provider value={{ locations, updateLocations, showGalleryOnMap }}>
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