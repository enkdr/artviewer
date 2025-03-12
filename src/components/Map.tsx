// src/components/Map.tsx
import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import { Map as OLMap } from 'ol';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { useMap } from '../context/MapContext';
import { fromLonLat } from 'ol/proj';

const Map: React.FC = () => {

    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<OLMap | null>(null); // Use a ref to store the OLMap instance
    const { locations, gallery } = useMap();

    // Initialize map only once
    useEffect(() => {
        if (mapRef.current && !mapInstance.current) {
            mapInstance.current = new OLMap({
                target: mapRef.current,
                layers: [
                    new TileLayer({
                        source: new OSM(),
                    }),
                ],
                view: new View({
                    center: [0, 0],
                    zoom: 4,
                }),
            });
        }
    }, []);

    // Update the map center and zoom when locations change
    useEffect(() => {
        if (Array.isArray(locations) && locations.length > 0 && mapInstance.current) {
            const [first] = locations;
            const view = mapInstance.current.getView();
            view.animate({
                center: fromLonLat([first.lon, first.lat]),
                zoom: 6,
            });
        }
    }, [locations]);

    useEffect(() => {
        if (gallery && mapInstance.current) {
            const view = mapInstance.current.getView();
            view.animate({
                center: fromLonLat([gallery.galleryLon, gallery.galleryLat]),
                zoom: 6,
            });
        }
    }, [gallery]);

    return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
};

export default Map;
