// Importation des hooks nécessaires à la navigation et à la récupération d'URL
import { useLocation, useNavigate } from 'react-router-dom';
// Importation du hook d'état
import { useState } from 'react';
// Importation du fichier CSS associé au composant
import './Header.css'; 

function Header({ onSearch }) {
  // Récupère l'emplacement actuel (chemin d'URL)
  const location = useLocation();
  const navigate = useNavigate();

  // État local pour stocker la requête saisie
  const [query, setQuery] = useState('');

  // Fonction déclenchée lors du clic sur le bouton de recherche
  const handleSearch = () => {
    if (onSearch) {
      onSearch(query); // Appelle la fonction passée en prop avec la requête
    }
  };

  // Style dynamique des liens de navigation (met en surbrillance le lien actif)
  const navStyle = (path) => ({
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    backgroundColor: location.pathname === path ? '#1976d2' : '#f0f0f0',
    color: location.pathname === path ? 'white' : 'black',
    fontWeight: location.pathname === path ? 'bold' : 'normal',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none'
  });

  return (
    <div className="header-container">
      {/* Barre de recherche */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Nom de la série" // Texte d’exemple affiché dans le champ
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Met à jour la requête à chaque frappe
        />
        <button onClick={handleSearch}>🔍 Rechercher</button>
      </div>

      {/* Liens de navigation */}
      <div className="nav-links">
        <span style={navStyle('/')} onClick={() => navigate('/')}>🎬 Movies</span>
        <span style={navStyle('/people')} onClick={() => navigate('/people')}>🧑‍🎤 Actors</span>
      </div>
    </div>
  );
}

export default Header;
