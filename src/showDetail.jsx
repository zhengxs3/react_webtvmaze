// Importation des hooks React et des outils de navigation
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Importation des composants internes
import Header from './Header';
import ImageWithFallback from './ImageWithFallback';

function ShowDetail() {
  // Récupération de l’ID depuis les paramètres de l’URL
  const { id } = useParams();
  // Hook pour naviguer entre les pages
  const navigate = useNavigate();

  // États pour stocker les données de l’émission, du cast et de l’équipe
  const [show, setShow] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);

  // Chargement des données au montage du composant ou lorsque l'ID change
  useEffect(() => {
    // Requête pour les infos de l’émission
    fetch(`https://api.tvmaze.com/shows/${id}`)
      .then(res => res.json())
      .then(data => setShow(data));

    // Requête pour le casting (acteurs)
    fetch(`https://api.tvmaze.com/shows/${id}/cast`)
      .then(res => res.json())
      .then(data => setCast(data));

    // Requête pour l’équipe technique (réalisateurs, producteurs, etc.)
    fetch(`https://api.tvmaze.com/shows/${id}/crew`)
      .then(res => res.json())
      .then(data => setCrew(data));
  }, [id]);

  // Affichage d’un message pendant le chargement
  if (!show) return <p style={{ padding: '2rem' }}>Chargement...</p>;

  return (
    <>
      {/* En-tête avec barre de recherche qui redirige vers la page d’accueil avec la requête */}
      <Header onSearch={(q) => navigate(`/?q=${encodeURIComponent(q)}`)} />

      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Section principale avec infos de l’émission */}
        <div style={{
          backgroundColor: '#EBBFF9',
          padding: '2rem 1.5rem'
        }}>

          {/* Bouton retour à la page précédente */}
          <button
            onClick={() => navigate(-1)}
            style={{
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

          {/* Titre de l’émission */}
          <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>{show.name}</h1>

          <div style={{
            display: 'flex',
            gap: '2rem',
            flexWrap: 'wrap'
          }}>
            {/* Image de l’émission avec fallback si absente */}
            <ImageWithFallback
              src={show.image?.medium}
              alt={show.name}
              style={{
                width: '220px',
                height: '320px',
                objectFit: 'cover',
                borderRadius: '10px',
                flexShrink: 0,
                flexGrow: 0
              }}
            />

            {/* Description et infos de l’émission */}
            <div style={{ flex: 1, minWidth: '250px' }}>
              {/* Résumé en HTML brut */}
              <div
                style={{ marginBottom: '1rem', fontSize: '0.95rem', lineHeight: '1.5' }}
                dangerouslySetInnerHTML={{ __html: show.summary || 'Pas de résumé' }}
              />
              <p><strong>Langue:</strong> {show.language}</p>
              <p><strong>Genres:</strong> {show.genres.join(', ')}</p>
              <p><strong>Note:</strong> {show.rating.average || '-'}</p>
              <p><strong>Statut:</strong> {show.status}</p>

              {/* Bouton vers la structure complète de l’émission */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <Link to={`/shows/${id}/full`}>
                  <button style={buttonStyle('#007bff')}>Voir tous les épisodes</button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Section cast (acteurs) */}
        {cast.length > 0 && (
          <div style={{ backgroundColor: '#BFE5F9', padding: '1.5rem', borderRadius: '0', margin: '0' }}>
            <h2 style={sectionTitleStyle}>Cast</h2>
            <div style={cardGridStyle}>
              {cast.map((item, idx) => (
                <Link to={`/person/${item.person.id}`} key={idx} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={cardStyle}>
                    <ImageWithFallback
                      src={item.person.image?.medium}
                      alt={item.person.name}
                      style={cardImageStyle}
                    />
                    <p style={cardNameStyle}>{item.person.name}</p>
                    <p style={cardRoleStyle}>as {item.character.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Section équipe technique (crew) */}
        {crew.length > 0 && (
          <div style={{ backgroundColor: '#f0f4f8', padding: '1.5rem', borderRadius: '0', margin: '0' }}>
            <h2 style={sectionTitleStyle}>Crew</h2>
            <div style={cardGridStyle}>
              {crew.map((item, idx) => (
                <Link to={`/person/${item.person.id}`} key={idx} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={cardStyle}>
                    <ImageWithFallback
                      src={item.person.image?.medium}
                      alt={item.person.name}
                      style={cardImageStyle}
                    />
                    <p style={cardNameStyle}>{item.person.name}</p>
                    <p style={cardRoleStyle}>{item.type}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Style de base pour les boutons
const buttonStyle = (color) => ({
  padding: '0.5rem 1rem',
  backgroundColor: color,
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '0.9rem',
  cursor: 'pointer'
});

// Style des titres de section (cast et crew)
const sectionTitleStyle = {
  marginTop: '0',
  marginBottom: '1rem',
  fontSize: '1.5rem',
  borderBottom: '2px solid #eee',
  paddingBottom: '0.5rem'
};

// Grille pour l’affichage des cartes (acteurs ou membres de l’équipe)
const cardGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '1rem'
};

// Style d’une carte individuelle
const cardStyle = {
  backgroundColor: '#ffffff',
  padding: '1rem',
  borderRadius: '8px',
  boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
  textAlign: 'center'
};

// Style pour les images dans les cartes
const cardImageStyle = {
  width: '100px',
  height: '120px',
  objectFit: 'cover',
  borderRadius: '6px',
  marginBottom: '0.5rem'
};

// Style pour les noms dans les cartes
const cardNameStyle = { margin: '0', fontWeight: 'bold' };

// Style pour les rôles ou fonctions dans les cartes
const cardRoleStyle = { margin: 0, fontSize: '0.9rem', color: '#555' };

export default ShowDetail;
