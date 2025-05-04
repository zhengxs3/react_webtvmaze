import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import noImg from './assets/noimg-text.png';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [genreOptions, setGenreOptions] = useState([]);
  const [genre, setGenre] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    let allData = [];
    let page = 0;
    let keepLoading = true;

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

    const formatted = allData.map((show) => ({ show }));
    setResults(formatted);

    const allGenres = new Set();
    allData.forEach((show) => show.genres.forEach((g) => allGenres.add(g)));
    setGenreOptions(['All', ...Array.from(allGenres)]);
  };

  const search = async () => {
    const response = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
    const data = await response.json();

    const allGenres = new Set();
    data.forEach(item => item.show.genres.forEach(g => allGenres.add(g)));
    setGenreOptions(['All', ...Array.from(allGenres)]);

    setResults(data);
    setGenre('All');
  };

  const filteredResults = genre === 'All'
    ? results
    : results.filter(item => item.show.genres.includes(genre));

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>📺 Rechercher une série</h1>

      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <input
          type="text"
          placeholder="Nom de la série"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ marginRight: '1rem', padding: '0.5rem', fontSize: '1rem' }}
        />
        <button
          onClick={search}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#90caf9',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          🔍 Rechercher
        </button>
      </div>

      {/* 分类按钮 */}
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

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
        {filteredResults.map((item) => {
          const show = item.show;
          const imageUrl = show.image ? show.image.medium : noImg;
          const rating = show.rating?.average || '暂无';

          return (
            <div
              key={show.id}
              onClick={() => navigate(`/show/${show.id}`)}
              style={{
                width: '180px',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                backgroundColor: '#f0f0f0',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <img src={imageUrl} alt={show.name} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
              <div style={{ background: '#c4e5fa', padding: '0.5rem' }}>
                <h3 style={{ fontSize: '1rem', margin: '0 0 0.5rem', fontWeight: 'bold' }}>{show.name}</h3>
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
