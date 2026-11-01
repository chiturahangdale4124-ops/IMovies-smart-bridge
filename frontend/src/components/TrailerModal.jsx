import React from 'react';
import { Modal } from 'react-bootstrap';

export const TrailerModal = ({ show, onHide, trailerUrl, movieTitle }) => {
  // Convert standard youtube link into embed URL
  const getEmbedUrl = (url) => {
    if (!url) return '';
    try {
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
      if (url.includes('youtube.com/embed/')) {
        return url;
      }
    } catch (e) {
      console.error('Error parsing trailer URL:', e);
    }
    return url;
  };

  const embedUrl = getEmbedUrl(trailerUrl);

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      contentClassName="modal-content"
    >
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title className="fs-5 text-white fw-bold d-flex align-items-center gap-2">
          <i className="bi bi-play-circle-fill text-danger"></i>
          {movieTitle || 'Movie Trailer'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0 bg-black">
        {embedUrl ? (
          <div className="ratio ratio-16x9">
            <iframe
              src={embedUrl}
              title={`${movieTitle} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="p-5 text-center text-secondary">
            <i className="bi bi-film fs-1 d-block mb-3"></i>
            <p>Trailer is not available for this movie yet.</p>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};
