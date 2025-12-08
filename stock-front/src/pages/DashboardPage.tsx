import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper, Alert, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WarningIcon from '@mui/icons-material/Warning';
import  api  from '../services/api'; // Chemin correct après les corrections précédentes

// 1. Interface pour les données reçues du Backend
interface StatsData {
  stockValue: number;
  clientCount: number;
  orderCount: number;
  lowStockCount: number;
  // Note: On suppose que le Backend renvoie aussi une liste de produits en seuil bas pour l'affichage
  lowStockProducts?: Array<{ id: number, libelle: string, qte: number, seuilMinStock: number }>; 
}

// 2. Interface pour les cartes d'affichage
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center', bgcolor: color, color: 'white' }}>
    <Box sx={{ mr: 2 }}>{icon}</Box>
    <Box>
      <Typography variant="h4">{value}</Typography>
      <Typography variant="subtitle1">{title}</Typography>
    </Box>
  </Paper>
);

const DashboardPage: React.FC = () => {
  // Changement de nom en statsData pour éviter le conflit 'data'
  const [statsData, setStatsData] = useState<StatsData | null>(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.get('/stats/dashboard')
      .then(res => {
        console.log("Données reçues du Backend (Stats OK):", res.data); 
        setStatsData(res.data);
      })
      .catch(err => {
        console.error("Erreur Backend Stats:", err);
        // Afficher le message d'erreur pour aider au diagnostic final si besoin
        setError("Erreur de chargement des données. Le Backend a renvoyé un code: " + (err.response?.status || 'Inconnu'));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 3. Gestion du Rendu Conditionnel
  if (loading) {
    return (
      <Box sx={{ p: 3 }}><Typography variant="h5">Chargement du Tableau de Bord...</Typography></Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography>Vérifiez le terminal du Backend pour l'erreur SQL (QueryFailedError).</Typography>
      </Box>
    );
  }
  
  // Cette vérification est redondante si !loading, mais assure que statsData n'est pas null
  if (!statsData) { 
    return (
        <Box sx={{ p: 3 }}><Typography>Aucune donnée disponible pour le Tableau de Bord.</Typography></Box>
    );
  }

  // 4. Rendu Principal (Utilisation de statsData)
  const lowStockProducts = statsData.lowStockProducts || []; // Sécurisation de la liste

  const statCards: StatCardProps[] = [
    {
      title: 'Valeur Totale du Stock',
      value: `${statsData.stockValue ? statsData.stockValue.toFixed(2) : 0} FCFA`,
      icon: <MonetizationOnIcon sx={{ fontSize: 40 }} />,
      color: '#4caf50', // Vert
    },
    {
      title: 'Clients Actifs',
      value: statsData.clientCount,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#2196f3', // Bleu
    },
    {
      title: 'Commandes En Cours',
      value: statsData.orderCount,
      icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
      color: '#ff9800', // Orange
    },
    {
      title: 'Articles en Stock Bas',
      value: statsData.lowStockCount,
      icon: <WarningIcon sx={{ fontSize: 40 }} />,
      color: statsData.lowStockCount > 0 ? '#f44336' : '#9e9e9e', // Rouge si > 0
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tableau de Bord
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>
      
      {/* Liste des produits sous Seuil Minimum */}
      <Typography variant="h5" gutterBottom sx={{ mt: 2, color: '#f44336' }}>
        ⚠️ Alertes Stock Bas ({statsData.lowStockCount})
      </Typography>
      
      <Paper sx={{ p: 2 }}>
        {lowStockProducts.length === 0 ? (
          <Typography>Aucune alerte de stock bas. Tout est en ordre !</Typography>
        ) : (
          <List>
            {/* C'est ici que l'erreur .map précédente était : maintenant c'est statsData?.lowStockProducts?.map */}
            {lowStockProducts.map((produit) => ( 
              <ListItem key={produit.id}>
                <ListItemIcon><WarningIcon color="error" /></ListItemIcon>
                <ListItemText
                  primary={produit.libelle}
                  secondary={`Stock actuel: ${produit.qte} / Seuil Min: ${produit.seuilMinStock}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default DashboardPage;