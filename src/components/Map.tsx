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
    const artworksLayerRef = useRef<VectorLayer<VectorSource> | null>(null);

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
        else if (mapInstance.current && galleryLayerRef.current) {
            // Clear gallery layer if gallery is null
            mapInstance.current.removeLayer(galleryLayerRef.current);
            galleryLayerRef.current = null;
        }
    }, [gallery]);

    useEffect(() => {
        if (artworks && artworks.length > 0 && mapInstance.current) {
            const map = mapInstance.current;

            // Remove previous artworks layer if it exists
            if (artworksLayerRef.current) {
                map.removeLayer(artworksLayerRef.current);
            }

            // Create features for each artwork
            const artworkFeatures = artworks.map((art) =>
                new Feature({
                    geometry: new Point(fromLonLat([art.galleryLon, art.galleryLat])),
                })
            );

            // Define style for artworks
            const artworksStyle = new Style({
                image: new CircleStyle({
                    radius: 6,
                    fill: new Fill({ color: '#ff6666' }),
                    stroke: new Stroke({ color: '#8b0000', width: 2 }),
                }),
            });

            // Create vector layer
            const artworksLayer = new VectorLayer({
                source: new VectorSource({
                    features: artworkFeatures,
                }),
                style: artworksStyle,
            });

            // Add layer to map
            map.addLayer(artworksLayer);
            artworksLayerRef.current = artworksLayer;

            // Calculate extent and fit view
            const source = artworksLayer.getSource();
            const extent = source?.getExtent();
            if (extent) {
                map.getView().fit(extent, { padding: [50, 50, 50, 50], maxZoom: 8 });
            }
        } else if (mapInstance.current && artworksLayerRef.current) {
            // Clear artworks layer if artworks is null
            mapInstance.current.removeLayer(artworksLayerRef.current);
            artworksLayerRef.current = null;
        }
    }, [artworks]);


    return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
};

export default Map;
