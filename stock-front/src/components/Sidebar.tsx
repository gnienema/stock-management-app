import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocationOnIcon from '@mui/icons-material/LocationOn'; // Importation de l'icône Emplacements
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; 

const drawerWidth = 240;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Définition de tous les éléments de menu avec les chemins (path) corrects
  const menuItems = [
    { text: 'Tableau de Bord', icon: <DashboardIcon />, path: '/' },
    { text: 'Produits', icon: <CategoryIcon />, path: '/produits' },
    { text: 'Commandes', icon: <ShoppingCartIcon />, path: '/commandes' },
    { text: 'Clients', icon: <PeopleIcon />, path: '/clients' },
    { text: 'Fournisseurs', icon: <LocalShippingIcon />, path: '/fournisseurs' },
    { text: 'Emplacements', icon: <LocationOnIcon />, path: '/emplacements' }, // <== LIGNE CRITIQUE POUR L'EMPLACEMENT
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          STOCK APP
        </Typography>
      </Toolbar>
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                onClick={() => handleNavigate(item.path)}
                selected={location.pathname === item.path || (item.path === '/' && location.pathname === '/')}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;