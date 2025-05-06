// Importation des hooks et fonctions de react-router-dom
import { useParams, useNavigate, Link } from 'react-router-dom';
// Importation des hooks React
import { useEffect, useState } from 'react';
// Importation du composant d'en-tête
import Header from './Header';

function ShowFullStructure() {
  // Récupération de l'ID de l’émission depuis l’URL
  const { id } = useParams();
  // Hook pour la navigation
  const navigate = useNavigate();

  // États pour stocker les données de l’émission, des saisons, des épisodes et des erreurs
  const [show, setShow] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [episodesMap, setEpisodesMap] = useState({});
  const [error, setError] = useState(null);

  // Chargement des données dès que le composant est monté ou que l'ID change
  useEffect(() => {
    // Récupération des infos principales de l’émission
    fetch(`https://api.tvmaze.com/shows/${id}`)
      .then(res => res.json())
      .then(data => setShow(data))
      .catch(() => setError("Erreur lors du chargement des données."));

    // Récupération des saisons
    fetch(`https://api.tvmaze.com/shows/${id}/seasons`)
      .then(res => res.json())
      .then(data => {
        setSeasons(data);
        // Pour chaque saison, on récupère les épisodes
        data.forEach(season => {
          fetch(`https://api.tvmaze.com/seasons/${season.id}/episodes`)
            .then(res => res.json())
            .then(episodes => {
              setEpisodesMap(prev => ({
                ...prev,
                [season.id]: episodes
              }));
            });
        });
      })
      .catch(() => setError("Erreur lors du chargement des saisons."));
  }, [id]);

  // En cas d’erreur, on affiche le message
  if (error) {
    return <p style={{ padding: '2rem', color: 'red' }}>{error}</p>;
  }

  // Si les données ne sont pas encore chargées
  if (!show) {
    return <p style={{ padding: '2rem' }}>Loading...</p>;
  }

  return (
    <>

      {/* En-tête avec barre de recherche */}
      <Header onSearch={(q) => navigate(`/?q=${encodeURIComponent(q)}`)} />

      <div style={{ fontFamily: 'Arial, sans-serif', padding: '2rem', backgroundColor: '#fff5f5' }}>
        {/* Bouton de retour à la page précédente */}
        <button
          onClick={() => navigate(`/show/${id}`)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#6c757d',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '1.5rem'
          }}
        >
          ⬅ Retour
        </button>

        {/* Titre de l’émission */}
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {show.name}
        </h1>

        {/* Liens d’ancrage rapides pour accéder à chaque saison */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {seasons.map((s) => (
            <a
              key={s.id}
              href={`#season-${s.id}`}
              style={{
                padding: '0.5rem 1rem',
                margin: '0.25rem',
                backgroundColor: '#007bff',
                color: '#fff',
                borderRadius: '6px',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              {s.number ? `S${String(s.number).padStart(2, '0')}` : 'Specials'}
            </a>
          ))}
        </div>

        {/* Affichage des saisons et de leurs épisodes */}
        {seasons.map(season => (
          <div
            key={season.id}
            id={`season-${season.id}`}
            style={{
              backgroundColor: '#fff',
              padding: '1.5rem',
              marginBottom: '2rem',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}
          >
            {/* Titre de la saison avec année */}
            <h2 style={{ marginTop: 0 }}>
              Season {season.number || 'Specials'}{' '}
              <small style={{ fontWeight: 'normal', color: '#777' }}>
                ({season.premiereDate?.slice(0, 4)})
              </small>
            </h2>

            {/* Image et résumé de la saison */}
            <div style={{
              display: 'flex',
              gap: '1.5rem',
              flexWrap: 'wrap',
              alignItems: 'flex-start'
            }}>
              {season.image && (
                <img
                  src={season.image.medium}
                  alt={`Season ${season.number}`}
                  style={{
                    width: '150px',
                    height: '220px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    flexShrink: 0
                  }}
                />
              )}
              <div style={{ flex: 1, minWidth: '250px' }}>
                <p>
                  {season.summary
                    ? <span dangerouslySetInnerHTML={{ __html: season.summary }} />
                    : 'No summary available.'}
                </p>
              </div>
            </div>

            {/* Tableau des épisodes de la saison */}
            {episodesMap[season.id]?.length > 0 ? (
              <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f1f1' }}>
                    <th style={thStyle}>#</th>
                    <th style={thStyle}>Title</th>
                    <th style={thStyle}>Airdate</th>
                    <th style={thStyle}>Runtime</th>
                  </tr>
                </thead>
                <tbody>
                  {episodesMap[season.id].map(ep => (
                    <tr key={ep.id}>
                      <td style={tdStyle}>{ep.number}</td>
                      <td style={tdStyle}>
                        <Link to={`/episode/${ep.id}`} style={{ color: '#007bff', textDecoration: 'underline' }}>
                          {ep.name}
                        </Link>
                      </td>
                      <td style={tdStyle}>{ep.airdate}</td>
                      <td style={tdStyle}>{ep.runtime} min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ marginTop: '1rem' }}>Chargement des épisodes...</p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

// Style pour les en-têtes de colonnes dans le tableau
const thStyle = {
  padding: '0.5rem',
  borderBottom: '1px solid #ccc',
  textAlign: 'left'
};

// Style pour les cellules du tableau
const tdStyle = {
  padding: '0.5rem',
  borderBottom: '1px solid #eee'
};

export default ShowFullStructure;
