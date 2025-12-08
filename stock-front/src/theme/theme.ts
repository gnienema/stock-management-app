// stock-front/src/theme.ts

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  // --- Couleurs de la Palette ---
  palette: {
    // Couleur primaire (utilisée pour les boutons principaux, la barre de navigation, etc.)
    primary: {
      main: '#3f51b5', // Bleu foncé standard (parfait pour le branding)
    },
    // Couleur secondaire (utilisée pour les actions flottantes ou l'accentuation)
    secondary: {
      main: '#f50057', // Rose/Magenta
    },
    // Optionnel: Définir les couleurs pour les alertes (Erreur, Succès, Avertissement, Info)
    error: {
      main: '#d32f2f',
    },
    success: {
        main: '#4caf50',
    }
  },

  // --- Typographie ---
  typography: {
    // Utilisation d'une police standard et sans empattement
    fontFamily: 'Roboto, Arial, sans-serif',
    // Taille de police de base
    fontSize: 14, 
    h4: {
        fontWeight: 600, // Les titres H4 seront plus gras
    }
  },

  // --- Composants (Personnalisation globale des éléments Material-UI) ---
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Garde la casse normale pour les boutons (plus moderne)
        },
      },
    },
  },
});

export default theme;