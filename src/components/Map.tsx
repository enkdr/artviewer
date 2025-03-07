// src/components/Map.tsx
import React, { useEffect, useRef } from 'react'
import 'ol/ol.css';
import { Map as OLMap } from 'ol';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

const Map: React.FC = () => {
    const mapRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (mapRef.current) {
            const map = new OLMap({
                target: mapRef.current,
                layers: [
                    new TileLayer({
                        source: new OSM()
                    })
                ],
                view: new View({
                    center: [0, 0],
                    zoom: 2
                })
            });

            return () => map.setTarget(undefined);
        }
    }, []);

    return (
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    );
};

export default Map;
