import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();

  const navStyle = (path) => ({
    marginRight: '1rem',
    padding: '0.5rem 1rem',
    textDecoration: 'none',
    borderRadius: '5px',
    backgroundColor: location.pathname === path ? '#1976d2' : '#f0f0f0',
    color: location.pathname === path ? 'white' : 'black',
    fontWeight: location.pathname === path ? 'bold' : 'normal'
  });

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      padding: '1rem',
      marginBottom: '2rem',
      borderBottom: '1px solid #ccc'
    }}>
      <Link to="/" style={navStyle('/')}>🎬 影片</Link>
      <Link to="/people" style={navStyle('/people')}>🧑‍🎤 演员</Link>
    </div>
  );
}

export default Header;
