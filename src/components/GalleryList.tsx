import { Gallery } from '../types';

interface GalleryListProps {
    GalleryData: Gallery[];
}

export const GalleryList: React.FC<GalleryListProps> = ({ GalleryData: data }) => {
    return (
        <div className="gallery-list">
            {data.length === 0 && <p>No gallery data found.</p>}
            {data.map((gallery) => (
                <p key={gallery.galleryId}>{gallery.galleryTitle}</p>
            ))}
        </div>
    );
};
