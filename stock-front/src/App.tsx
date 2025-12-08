// stock-front/src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
//import theme from "./theme"; 
import { Box, Typography } from '@mui/material';

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