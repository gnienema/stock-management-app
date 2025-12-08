// stock-front/src/App.tsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, Box, Typography } from '@mui/material'; 
// Ligne 19 : VÉRIFIEZ L'EXISTENCE DU FICHIER theme.ts dans src/
//import theme from "./theme"; 

// Layout
import MainLayout from './components/MainLayout'; 

// Importation des Pages 
import DashboardPage from './pages/DashboardPage';
import ProduitsPage from './pages/ProduitsPage';
import ClientsPage from './pages/ClientsPage';
import FournisseursPage from './pages/FournisseursPage';
import EmplacementsPage from './pages/EmplacementsPage'; 
import CommandesPage from './pages/CommandesPage'; 


function App() {
  return (
    // ON RETIRE ThemeProvider
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<MainLayout />}>
            
            <Route index element={<DashboardPage />} /> 
            <Route path="produits" element={<ProduitsPage />} />
            <Route path="clients" element={<ClientsPage />} /> 
            <Route path="fournisseurs" element={<FournisseursPage />} />
            <Route path="emplacements" element={<EmplacementsPage />} /> 
            <Route path="commandes" element={<CommandesPage />} /> 
            
            {/* Si vous avez une route 404, vérifiez qu'elle est bien fermée */}
            <Route 
              path="*" 
              element={
                <Box sx={{ p: 3 }}>
                  <Typography variant="h4">404 - Page non trouvée</Typography>
                </Box>
              }
            />
          </Route>
        </Routes>
    </BrowserRouter>
  );
}export default App;