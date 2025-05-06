// Importation des hooks et fonctions de navigation
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
// Composants internes
import Header from './Header';
import ImageWithFallback from './ImageWithFallback';

function PersonDetail() {
  // Récupération de l'ID de la personne depuis l'URL
  const { personId } = useParams();
  const navigate = useNavigate();

  // États pour stocker les données de la personne et ses crédits
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState([]);

  // Chargement des données de la personne et de ses crédits (acteur + équipe)
  useEffect(() => {
    // Récupération des infos de base
    fetch(`https://api.tvmaze.com/people/${personId}`)
      .then(res => res.json())
      .then(data => setPerson(data));

    // Récupération des crédits d’acteur et de membre d’équipe (embed=show pour inclure l’émission)
    Promise.all([
      fetch(`https://api.tvmaze.com/people/${personId}/castcredits?embed=show`).then(res => res.json()),
      fetch(`https://api.tvmaze.com/people/${personId}/crewcredits?embed=show`).then(res => res.json())
    ]).then(([castData, crewData]) => {
      const allCredits = [...castData, ...crewData];

      // Filtrage des émissions pour éviter les doublons
      const uniqueShows = {};
      const filtered = allCredits.filter(item => {
        const id = item._embedded?.show?.id;
        if (id && !uniqueShows[id]) {
          uniqueShows[id] = true;
          return true;
        }
        return false;
      });

      setCredits(filtered);
    });
  }, [personId]);

  // Affichage d’un message pendant le chargement
  if (!person) return <p style={{ padding: '2rem' }}>Chargement...</p>;

  return (
    <>
      {/* Barre de recherche */}
      <Header onSearch={(q) => navigate(`/?q=${encodeURIComponent(q)}`)} />

      <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '960px', margin: '0 auto' }}>
        {/* Bouton retour */}
        <button
          onClick={() => navigate(-1)}
          style={{
            marginBottom: '1.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          ← Retour
        </button>

        {/* Nom de la personne */}
        <h1 style={{ fontSize: '2.2rem', marginBottom: '1.5rem' }}>{person.name}</h1>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Image de la personne */}
          <ImageWithFallback
            src={person.image?.medium}
            alt={person.name}
            style={{
              width: '200px',
              height: '260px',
              objectFit: 'cover',
              borderRadius: '10px',
              flexShrink: 0
            }}
          />

          {/* Infos personnelles */}
          <div style={{ flex: 1, minWidth: '250px' }}>
            <p><strong>Genre:</strong> {person.gender || 'Inconnu'}</p>
            <p><strong>Naissance:</strong> {person.birthday || 'Inconnue'}</p>
            <p><strong>Pays:</strong> {person.country?.name || 'Inconnu'}</p>

            {/* Biographie si disponible */}
            {person.summary ? (
              <div
                style={{
                  marginTop: '1rem',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  color: '#333'
                }}
                dangerouslySetInnerHTML={{ __html: person.summary }}
              />
            ) : (
              <p style={{ marginTop: '1rem', color: '#888' }}>
                Nous n'avons pas de biographie pour {person.name}.
              </p>
            )}
          </div>
        </div>

        {/* Section "Connu pour" */}
        <h2 style={{
          marginTop: '3rem',
          marginBottom: '1rem',
          fontSize: '1.5rem',
          borderBottom: '2px solid #eee',
          paddingBottom: '0.5rem'
        }}>
          Connu pour
        </h2>

        {/* Grille des émissions associées */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem'
          }}
        >
          {credits.map((credit, idx) => {
            const show = credit._embedded?.show;
            if (!show) return null;

            return (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                }}
                onClick={() => navigate(`/show/${show.id}`)} // Redirige vers la page de l’émission
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <img
                  src={show.image?.medium}
                  alt={show.name}
                  style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                />
                <div style={{ padding: '0.5rem', fontWeight: 'bold' }}>{show.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default PersonDetail;
