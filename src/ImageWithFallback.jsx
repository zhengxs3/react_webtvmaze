// Importation de React
import React from 'react';
// Importation de l'image par défaut à afficher en cas d'erreur de chargement
import noImage from './assets/noimg-text.png';

// Composant qui affiche une image avec une alternative (fallback) si l'image est indisponible
function ImageWithFallback({ src, alt, style, ...props }) {
  // Si aucune source n’est fournie, on utilise l’image par défaut
  const validSrc = src || noImage;

  return (
    <img
      src={validSrc} // Source de l’image (ou fallback si src est null)
      alt={alt} // Texte alternatif pour l’accessibilité
      style={style} // Styles CSS passés en props
      // Gestion d'erreur : si l'image ne se charge pas, on affiche l'image par défaut
      onError={(e) => {
        e.target.onerror = null; // Empêcher une boucle infinie si noImage échoue aussi
        e.target.src = noImage;  // Définir l’image de secours
      }}
      {...props} // Propagation des autres props éventuelles
    />
  );
}

// Exportation du composant pour pouvoir l'utiliser ailleurs dans l'application
export default ImageWithFallback;
