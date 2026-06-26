import { Gallery } from '../types';
import { useEscapeKey } from '../hooks/useEscapeKey';

interface GalleryMapPopupProps {
    gallery: Gallery;
    fading?: boolean;
    onClose: () => void;
    onFadeEnd?: () => void;
}

export const GalleryMapPopup = ({ gallery, fading, onClose, onFadeEnd }: GalleryMapPopupProps) => {
    useEscapeKey(onClose);
    return (
        <div
            className={`gallery-pin-popup${fading ? ' gallery-pin-popup--fading' : ''}`}
            onAnimationEnd={fading ? onFadeEnd : undefined}
        >
            <button className="gallery-pin-popup-close" onClick={onClose} aria-label="Close">✕</button>
            <div className="gallery-pin-popup-eyebrow">{gallery.countryTitle}</div>
            <h3 className="gallery-pin-popup-title">{gallery.galleryTitle}</h3>
            {gallery.galleryAddress && (
                <p className="gallery-pin-popup-address">{gallery.galleryAddress}</p>
            )}
            {gallery.galleryLink && (
                <div className="gallery-pin-popup-actions">
                    <a
                        href={gallery.galleryLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gallery-pin-popup-link"
                    >
                        Website ↗
                    </a>
                </div>
            )}
        </div>
    );
};
