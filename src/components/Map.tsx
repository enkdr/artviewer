import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import { Map as OLMap } from 'ol';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { useMap } from '../context/MapContext';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Cluster from 'ol/source/Cluster';
import Feature, { FeatureLike } from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Circle as CircleStyle, Fill, Stroke, Text } from 'ol/style';
import { createEmpty, extend as extendExtent } from 'ol/extent';
import { Gallery } from '../types';

interface MapProps {
    galleries?: Gallery[];
    onGalleryPinClick?: (galleryId: string) => void;
    onMoveStart?: () => void;
    onEmptyClick?: () => void;
}

const PIN_COLOR = '#56b8f1';
const PIN_COLOR_SELECTED = '#d9fbff';
const PIN_STROKE = '#03123c';

const Map: React.FC<MapProps> = ({ galleries, onGalleryPinClick, onMoveStart, onEmptyClick }) => {

    const mapRef = useRef<HTMLDivElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<OLMap | null>(null);
    const onGalleryPinClickRef = useRef(onGalleryPinClick);
    const onMoveStartRef = useRef(onMoveStart);
    const onEmptyClickRef = useRef(onEmptyClick);
    const highlightedGalleryIdRef = useRef<string | null>(null);
    const { gallery, artworks, viewResetCount } = useMap();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allGalleriesLayerRef = useRef<VectorLayer<any> | null>(null);
    const artworksLayerRef = useRef<VectorLayer<VectorSource> | null>(null);

    useEffect(() => { onGalleryPinClickRef.current = onGalleryPinClick; }, [onGalleryPinClick]);
    useEffect(() => { onMoveStartRef.current = onMoveStart; }, [onMoveStart]);
    useEffect(() => { onEmptyClickRef.current = onEmptyClick; }, [onEmptyClick]);

    const clusterStyle = (feature: FeatureLike) => {
        const members: Feature[] = feature.get('features');
        const count = members.length;

        if (count === 1) {
            const galleryId = members[0].get('galleryId');
            const isSelected = galleryId === highlightedGalleryIdRef.current;
            return new Style({
                image: new CircleStyle({
                    radius: isSelected ? 10 : 7,
                    fill: new Fill({ color: isSelected ? PIN_COLOR_SELECTED : PIN_COLOR }),
                    stroke: new Stroke({ color: PIN_STROKE, width: isSelected ? 1.5 : 0.5 }),
                }),
            });
        }

        const radius = Math.min(7 + Math.sqrt(count) * 2, 20);
        return new Style({
            image: new CircleStyle({
                radius,
                fill: new Fill({ color: PIN_COLOR }),
                stroke: new Stroke({ color: PIN_STROKE, width: 0.5 }),
            }),
            text: new Text({
                text: count.toString(),
                fill: new Fill({ color: PIN_STROKE }),
                font: `bold ${Math.round(radius * 0.9)}px sans-serif`,
            }),
        });
    };

    // Initialize map only once
    useEffect(() => {
        if (mapRef.current && !mapInstance.current) {
            const map = new OLMap({
                target: mapRef.current,
                layers: [new TileLayer({
                    source: new XYZ({
                        url: 'https://{a-d}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
                        attributions: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
                    }),
                })],
                view: new View({ center: [0, 0], zoom: 2 }),
            });

            map.on('click', (event) => {
                const hits: FeatureLike[] = [];
                map.forEachFeatureAtPixel(event.pixel, (_feature, layer) => {
                    if (layer === allGalleriesLayerRef.current) hits.push(_feature);
                });

                if (hits.length === 0) {
                    onEmptyClickRef.current?.();
                    return;
                }

                // prefer cluster over single pin when both are at pixel
                const target = hits.find(f => (f.get('features') as Feature[]).length > 1) ?? hits[0];
                const members: Feature[] = target.get('features');

                if (members.length === 1) {
                    const galleryId = members[0].get('galleryId');
                    if (galleryId) {
                        highlightedGalleryIdRef.current = galleryId;
                        allGalleriesLayerRef.current?.changed();
                        onGalleryPinClickRef.current?.(galleryId);
                        const coord = (members[0].getGeometry() as Point).getCoordinates();
                        map.getView().animate({ center: coord, zoom: 12, duration: 400 });
                    }
                } else {
                    const extent = members.reduce((ext, f) => {
                        const coord = (f.getGeometry() as Point).getCoordinates();
                        return extendExtent(ext, [coord[0], coord[1], coord[0], coord[1]]);
                    }, createEmpty());
                    map.getView().fit(extent, { duration: 400, maxZoom: 19, padding: [100, 100, 100, 100] });
                }
            });

            map.on('movestart', () => {
                onMoveStartRef.current?.();
                if (tooltipRef.current) tooltipRef.current.style.display = 'none';
            });

            map.on('pointermove', (event) => {
                let tooltipText = '';
                map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
                    if (layer !== allGalleriesLayerRef.current) return;
                    const members = feature.get('features') as Feature[];
                    tooltipText = members.length === 1
                        ? members[0].get('galleryTitle')
                        : `${members.length} galleries`;
                    return true;
                });

                const el = tooltipRef.current;
                if (el) {
                    if (tooltipText) {
                        el.textContent = tooltipText;
                        el.style.display = 'block';
                        el.style.left = `${event.pixel[0]}px`;
                        el.style.top = `${event.pixel[1]}px`;
                    } else {
                        el.style.display = 'none';
                    }
                }
                (map.getTargetElement() as HTMLElement).style.cursor = tooltipText ? 'pointer' : '';
            });

            mapInstance.current = map;
        }
    }, []);

    // Render all gallery pins with clustering
    useEffect(() => {
        if (!mapInstance.current || !galleries || galleries.length === 0) return;

        if (allGalleriesLayerRef.current) {
            mapInstance.current.removeLayer(allGalleriesLayerRef.current);
        }

        const features = galleries.map(g => {
            const f = new Feature({ geometry: new Point(fromLonLat([g.galleryLon, g.galleryLat])) });
            f.set('galleryId', g.galleryId);
            f.set('galleryTitle', g.galleryTitle);
            return f;
        });

        const clusterSource = new Cluster({
            distance: 40,
            source: new VectorSource({ features }),
        });

        const layer = new VectorLayer({
            source: clusterSource,
            style: clusterStyle,
            zIndex: 2,
        });

        mapInstance.current.addLayer(layer);
        allGalleriesLayerRef.current = layer;
    }, [galleries]);

    // Zoom out to world view on clear
    useEffect(() => {
        if (viewResetCount === 0) return;
        mapInstance.current?.getView().animate({ center: [0, 0], zoom: 2, duration: 600 });
    }, [viewResetCount]);

    // Zoom to + highlight gallery selected from sidebar
    useEffect(() => {
        highlightedGalleryIdRef.current = gallery?.galleryId ?? null;
        allGalleriesLayerRef.current?.changed();

        if (gallery && mapInstance.current) {
            mapInstance.current.getView().animate({
                center: fromLonLat([gallery.galleryLon, gallery.galleryLat]),
                zoom: 12,
                duration: 400,
            });
        }
    }, [gallery]);

    useEffect(() => {
        if (artworks && artworks.length > 0 && mapInstance.current) {
            const map = mapInstance.current;

            if (artworksLayerRef.current) {
                map.removeLayer(artworksLayerRef.current);
            }

            const artworkFeatures = artworks.map((art) =>
                new Feature({ geometry: new Point(fromLonLat([art.galleryLon, art.galleryLat])) })
            );

            const artworksLayer = new VectorLayer({
                source: new VectorSource({ features: artworkFeatures }),
                style: new Style({
                    image: new CircleStyle({
                        radius: 6,
                        fill: new Fill({ color: '#f5924e' }),
                        stroke: new Stroke({ color: '#c4621a', width: 0.5 }),
                    }),
                }),
                zIndex: 3,
            });

            map.addLayer(artworksLayer);
            artworksLayerRef.current = artworksLayer;

            const source = artworksLayer.getSource();
            const extent = source?.getExtent();
            if (extent) {
                map.getView().fit(extent, { padding: [50, 50, 50, 50], maxZoom: 8, duration: 400 });
            }
        } else if (mapInstance.current && artworksLayerRef.current) {
            mapInstance.current.removeLayer(artworksLayerRef.current);
            artworksLayerRef.current = null;
        }
    }, [artworks]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
            <div ref={tooltipRef} className="map-tooltip" style={{ display: 'none' }} />
        </div>
    );
};

export default Map;
