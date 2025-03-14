import { Artwork } from "../types";

interface ArtworkModalProps {
    artwork: Artwork;
    onClose: () => void;
}

export const ArtworkModal = ({ artwork, onClose }: ArtworkModalProps) => {
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
                <p className="modal-normal">{artwork.artworkMedium} {artwork.artworkYear}</p>
                <p className="modal-normal">{artwork.galleryTitle}</p>
            </div>
        </div>
    );
};
