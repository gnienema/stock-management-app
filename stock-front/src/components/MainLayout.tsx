import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider, ListItem, 
  ListItemButton, ListItemIcon, ListItemText, IconButton, Avatar, Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 260;

// Configuration du menu
const menuItems = [
  { text: 'Clients', icon: <PeopleIcon />, path: '/' },
  { text: 'Produits & Stock', icon: <InventoryIcon />, path: '/produits' },
  { text: 'Fournisseurs', icon: <LocalShippingIcon />, path: '/fournisseurs' },
  { text: 'Caisse / Commandes', icon: <ShoppingCartIcon />, path: '/commandes' },
];

// AJOUT DU "export default" ICI
export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0F172A', color: 'white' }}>
      {/* LOGO AREA */}
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
        <InventoryIcon sx={{ fontSize: 32, mr: 1, color: '#6366F1' }} />
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
          STOCK APP
        </Typography>
      </Toolbar>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />

      {/* MENU ITEMS */}
      <List sx={{ flexGrow: 1, px: 2, mt: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton 
                onClick={() => navigate(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: '#6366F1',
                    color: 'white',
                    '&:hover': { bgcolor: '#4F46E5' },
                    '& .MuiListItemIcon-root': { color: 'white' }
                  },
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                }}
              >
                <ListItemIcon sx={{ color: isActive ? 'white' : '#94A3B8', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      
      {/* FOOTER DRAWER */}
      <Box sx={{ p: 2 }}>
         <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: '#6366F1', fontSize: 14 }}>AD</Avatar>
            <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Admin User</Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>admin@stock.com</Typography>
            </Box>
            <Tooltip title="Déconnexion">
                <IconButton size="small" sx={{ ml: 'auto', color: '#94A3B8' }}><LogoutIcon fontSize="small"/></IconButton>
            </Tooltip>
         </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* HEADER MOBILE UNIQUEMENT */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: '1px solid #E2E8F0'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div">
            {menuItems.find(i => i.path === location.pathname)?.text || 'Application'}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* SIDEBAR (Responsive) */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* CONTENU PRINCIPAL */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'hidden'
        }}
      >
        <Toolbar /> 
        <Outlet /> 
      </Box>
    </Box>
  );
}