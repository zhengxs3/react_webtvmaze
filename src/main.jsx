// Importation des composants nécessaires depuis la bibliothèque react-router-dom
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Importation de la méthode createRoot pour rendre l'application React dans le DOM
import { createRoot } from 'react-dom/client';

// Importation des différents composants de l'application
import App from './App'; // Composant principal de la page d'accueil
import ShowDetail from './ShowDetail'; // Composant affichant les détails d'une émission spécifique
import People from './People'; // Composant listant les personnes (acteurs, réalisateurs, etc.)
import PersonDetail from './PersonDetail'; // Composant affichant les détails d'une personne spécifique
import ShowFullStructure from './ShowFullStructure'; // Composant montrant la structure complète d'une émission (saisons, épisodes)
import EpisodeDetail from './EpisodeDetail'; // Composant affichant les détails d'un épisode

// Rendu de l'application principale dans l'élément HTML avec l'id "root"
createRoot(document.getElementById('root')).render(
  <BrowserRouter> {/* Configuration du routeur pour gérer les différentes routes de l'application */}
    <Routes>
      {/* Route vers la page d'accueil */}
      <Route path="/" element={<App />} />
      
      {/* Route vers les détails d'une émission spécifique (via son ID) */}
      <Route path="/show/:id" element={<ShowDetail />} />

      {/* Route vers la structure complète d'une émission (saisons et épisodes) */}
      <Route path="/shows/:id/full" element={<ShowFullStructure />} />

      {/* Route vers les détails d'un épisode spécifique (via son ID) */}
      <Route path="/episode/:episodeId" element={<EpisodeDetail />} />
      
      {/* Route vers la liste des personnes */}
      <Route path="/people" element={<People />} />

      {/* Route vers les détails d'une personne spécifique (via son ID) */}
      <Route path="/person/:personId" element={<PersonDetail />} />
    </Routes>
  </BrowserRouter>
);
