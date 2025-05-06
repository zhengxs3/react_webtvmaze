// Importation des hooks React nécessaires
import { useEffect, useState } from 'react';
// Importation des outils de navigation fournis par react-router-dom
import { useNavigate, useSearchParams } from 'react-router-dom';
// Importation de l'image par défaut pour les émissions sans image
import noImg from './assets/noimg-text.png';
// Importation du composant Header
import Header from './Header';

function App() {
  // État pour la requête de recherche
  const [query, setQuery] = useState('');
  // État pour les résultats de recherche ou la liste initiale d’émissions
  const [results, setResults] = useState([]);
  // État pour stocker les genres disponibles
  const [genreOptions, setGenreOptions] = useState([]);
  // État pour le genre actuellement sélectionné
  const [genre, setGenre] = useState('All');

  // Hook pour naviguer entre les pages
  const navigate = useNavigate();
  // Hook pour accéder aux paramètres de l’URL
  const [searchParams] = useSearchParams();

  // Effet déclenché au chargement ou lors du changement de paramètres d’URL
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      // Si une requête est dans l’URL, on l’utilise pour rechercher
      setQuery(q);
      searchByQuery(q);
    } else {
      // Sinon, on charge les données par défaut
      loadInitialData();
    }
  }, [searchParams]);

  // Fonction pour charger les données de plusieurs pages d’émissions
  const loadInitialData = async () => {
    let allData = [];
    let page = 0;
    let keepLoading = true;

    // On charge jusqu’à 6 pages tant qu’il y a des résultats
    while (keepLoading && page < 6) {
      const response = await fetch(`https://api.tvmaze.com/shows?page=${page}`);
      const data = await response.json();
      if (data.length === 0) {
        keepLoading = false;
      } else {
        allData = [...allData, ...data];
        page++;
      }
    }

    // On reformate les données pour correspondre au format attendu
    const formatted = allData.map((show) => ({ show }));
    setResults(formatted);

    // On extrait les genres uniques
    const allGenres = new Set();
    allData.forEach((show) => show.genres.forEach((g) => allGenres.add(g)));
    setGenreOptions(['All', ...Array.from(allGenres)]);
  };

  // Fonction pour rechercher des émissions à partir d'une requête
  const searchByQuery = async (q) => {
    const response = await fetch(`https://api.tvmaze.com/search/shows?q=${q}`);
    const data = await response.json();

    // Récupération de tous les genres présents dans les résultats
    const allGenres = new Set();
    data.forEach(item => item.show.genres.forEach(g => allGenres.add(g)));
    setGenreOptions(['All', ...Array.from(allGenres)]);

    setResults(data);
    setGenre('All'); // Réinitialiser le filtre de genre
  };

  // Filtrage des résultats en fonction du genre sélectionné
  const filteredResults = genre === 'All'
    ? results
    : results.filter(item => item.show.genres.includes(genre));

  return (
    <div>
      {/* Composant d'en-tête avec barre de recherche */}
      <Header onSearch={(q) => {
        setQuery(q);
        navigate(`/?q=${encodeURIComponent(q)}`); // Mettre à jour l'URL avec la recherche
      }} />

      {/* Titre principal */}
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        📺 Rechercher une série
      </h1>

      {/* Filtres de genres sous forme de boutons */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0.5rem',
        marginBottom: '2rem'
      }}>
        {genreOptions.map((g) => (
          <button
            key={g}
            onClick={() => setGenre(g)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              border: '1px solid #ccc',
              backgroundColor: genre === g ? '#1976d2' : '#f0f0f0',
              color: genre === g ? 'white' : 'black',
              fontWeight: genre === g ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Affichage des résultats sous forme de cartes */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
        {filteredResults.map((item) => {
          const show = item.show;
          const imageUrl = show.image ? show.image.medium : noImg;
          const rating = show.rating?.average || '-';

          return (
            <div
              key={show.id}
              onClick={() => navigate(`/show/${show.id}`)} // Redirection vers la page de détails de l’émission
              style={{
                width: '180px',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                backgroundColor: '#c4e5fa',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <img src={imageUrl} alt={show.name} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
              <div style={{ padding: '0.5rem' }}>
                <h3 style={{ fontSize: '1rem', margin: '0 0 0.5rem', fontWeight: 'bold'}}>{show.name}</h3>
                <p style={{ margin: 0 }}>⭐ {rating}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
