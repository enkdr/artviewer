import { Artwork } from "../types";
import { useEscapeKey } from "../hooks/useEscapeKey";

interface ArtworkModalProps {
    artwork: Artwork;
    onClose: () => void;
}

export const ArtworkModal = ({ artwork, onClose }: ArtworkModalProps) => {
    useEscapeKey(onClose);
    return (
        <div
            className="modal-overlay"
            onClick={onClose}
        >
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <button className="modal-close" onClick={onClose}>✕</button>
                <img
                    src={artwork.imageUrl}
                    alt={artwork.artworkTitle}
                    className="modal-image"
                />
                <h2 className="modal-bold">{artwork.artworkTitle}</h2>
                <p className="modal-normal">{artwork.artistFirstname} {artwork.artistLastname}</p>
                <p className="modal-normal">{artwork.artworkMediums?.join(', ')} {artwork.artworkYear}</p>
                <p className="modal-normal">{artwork.galleryTitle}</p>
            </div>
        </div>
    );
};
