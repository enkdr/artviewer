// src/components/Map.tsx
import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import { Map as OLMap } from 'ol';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { useMap } from '../context/MapContext';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Circle as CircleStyle, Fill, Stroke } from 'ol/style';

const Map: React.FC = () => {

    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<OLMap | null>(null); // Use a ref to store the OLMap instance
    const { gallery, artworks } = useMap();

    const galleryLayerRef = useRef<VectorLayer<VectorSource> | null>(null);

    console.log(" :: Map :: artworks :: ", artworks)

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

    useEffect(() => {
        if (gallery && mapInstance.current) {
            const view = mapInstance.current.getView();
            view.animate({
                center: fromLonLat([gallery.galleryLon, gallery.galleryLat]),
                zoom: 6,
            });

            // Remove previous gallery layer if exists
            if (galleryLayerRef.current) {
                mapInstance.current.removeLayer(galleryLayerRef.current);
            }

            // Create feature for gallery
            const galleryFeature = new Feature({
                geometry: new Point(fromLonLat([gallery.galleryLon, gallery.galleryLat])),
            });


            const galleryStyle = new Style({
                image: new CircleStyle({
                    radius: 8,
                    fill: new Fill({ color: '#809fff' }),
                    stroke: new Stroke({ color: '#03123c', width: 2 }),
                }),
            });

            // Create layer and add to map
            const galleryLayer = new VectorLayer({
                source: new VectorSource({
                    features: [galleryFeature],
                }),
                style: galleryStyle,
            });

            mapInstance.current.addLayer(galleryLayer);
            galleryLayerRef.current = galleryLayer;
        }
    }, [gallery]);


    return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
};

export default Map;
