import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import ImageWithFallback from './ImageWithFallback';

function People() {
  const [people, setPeople] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://api.tvmaze.com/people?page=0') // 只加载第一页
      .then(res => res.json())
      .then(data => setPeople(data))
      .catch(err => console.error('Failed to fetch people:', err));
  }, []);

  return (
    <>
      <Header onSearch={(q) => navigate(`/?q=${encodeURIComponent(q)}`)} />

      <div style={{ padding: '2rem',backgroundColor: '#fff5f5', fontFamily: 'Arial, sans-serif' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>🧑‍🎤 Tous les acteurs</h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem'
          }}
        >
          {people.map(person => (
            <div
              key={person.id}
              onClick={() => navigate(`/person/${person.id}`)}
              style={{
                backgroundColor: '#fff',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center',
                boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
                cursor: 'pointer'
              }}
            >
              <ImageWithFallback
                src={person.image?.medium}
                alt={person.name}
                style={{
                  width: '100px',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  marginBottom: '0.5rem'
                }}
              />
              <p style={{ fontWeight: 'bold', margin: 0 }}>{person.name}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default People;
