import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function ShowDetail() {
  const { id } = useParams();
  const [show, setShow] = useState(null);

  useEffect(() => {
    fetch(`https://api.tvmaze.com/shows/${id}`)
      .then(res => res.json())
      .then(data => setShow(data));
  }, [id]);

  if (!show) return <p style={{ padding: '2rem' }}>Chargement...</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '1rem' }}>← Retour</Link>
      <h1>{show.name}</h1>
      {show.image && <img src={show.image.original} alt={show.name} style={{ maxWidth: '100%' }} />}
      <div dangerouslySetInnerHTML={{ __html: show.summary || 'Pas de résumé' }} />
      <p><strong>Langue :</strong> {show.language}</p>
      <p><strong>Genres :</strong> {show.genres.join(', ')}</p>
      <p><strong>Note :</strong> {show.rating.average || '暂无'}</p>
    </div>
  );
}

export default ShowDetail;
