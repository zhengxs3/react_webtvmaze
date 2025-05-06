// Importation des hooks nécessaires pour la navigation et la récupération de paramètres
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Importation des composants internes
import Header from './Header';
import ImageWithFallback from './ImageWithFallback';

function EpisodeDetail() {
  // Récupération de l'ID de l'épisode depuis l'URL
  const { episodeId } = useParams();
  const navigate = useNavigate();

  // État pour stocker les données de l'épisode
  const [episode, setEpisode] = useState(null);

  // Chargement des données de l’épisode lors du montage ou quand l’ID change
  useEffect(() => {
    fetch(`https://api.tvmaze.com/episodes/${episodeId}`)
      .then(res => res.json())
      .then(data => setEpisode(data))
      .catch(err => console.error('Failed to fetch episode:', err)); // En cas d'erreur dans la requête
  }, [episodeId]);

  // Si l’épisode n’est pas encore chargé, on affiche un message de chargement
  if (!episode) {
    return (
      <>
        <Header onSearch={(q) => navigate(`/?q=${encodeURIComponent(q)}`)} />
        <div style={{ textAlign: 'center', marginTop: '3rem', fontSize: '1.5rem' }}>Loading...</div>
      </>
    );
  }

  return (
    <>
      {/* Barre de recherche */}
      <Header onSearch={(q) => navigate(`/?q=${encodeURIComponent(q)}`)} />

      {/* Contenu principal */}
      <div style={{ padding: '2rem', backgroundColor: '#fff5f5', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
        {/* Bouton retour */}
        <button
          onClick={() => navigate(-1)}
          style={{
            marginBottom: '1.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          ← Retour
        </button>

        {/* Titre de l’épisode */}
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{episode.name}</h1>

        {/* Contenu de l’épisode : image + infos */}
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Image de l’épisode avec fallback */}
          <ImageWithFallback
            src={episode.image?.medium}
            alt={episode.name}
            style={{
              width: '300px',
              height: '180px',
              objectFit: 'cover',
              borderRadius: '10px',
              flexShrink: 0
            }}
          />

          {/* Détails textuels de l’épisode */}
          <div style={{ flex: 1, minWidth: '250px' }}>
            <p><strong>Saison:</strong> {episode.season}</p>
            <p><strong>Épisode:</strong> {episode.number}</p>
            <p><strong>Date de diffusion:</strong> {episode.airdate}</p>
            <p><strong>Durée:</strong> {episode.runtime} minutes</p>

            {/* Résumé de l’épisode ou message alternatif */}
            <p style={{ marginTop: '1rem', color: '#444' }}>
              {episode.summary ? (
                <span dangerouslySetInnerHTML={{ __html: episode.summary }} />
              ) : (
                'No summary available.'
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default EpisodeDetail;
