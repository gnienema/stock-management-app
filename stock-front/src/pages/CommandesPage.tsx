import { useEffect, useState } from 'react';
import { 
  Paper, Typography, Box, Button, TextField, MenuItem, Select, InputLabel, FormControl, 
  Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Alert, Snackbar, Card, CardContent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import api from '../services/api';
import RecuTemplate from '../components/RecuTemplate'; // Assurez-vous que ce fichier existe

// Types
interface Client { id: number; nom: string; prenoms: string; }
interface Produit { id: number; libelle: string; pu: number; reference: string; }
interface LignePanier { produit: Produit; qte: number; totalLigne: number; }

export default function CommandesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);

  // Formulaire
  const [selectedClientId, setSelectedClientId] = useState<number | ''>('');
  const [selectedProduitId, setSelectedProduitId] = useState<number | ''>('');
  const [qte, setQte] = useState<number>(1);
  const [panier, setPanier] = useState<LignePanier[]>([]);
  
  // États pour le Reçu / Ticket
  const [showRecu, setShowRecu] = useState(false);
  const [lastOrderData, setLastOrderData] = useState<{client: string, panier: LignePanier[], total: number} | null>(null);

  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    api.get('/client').then(res => setClients(res.data)).catch(console.error);
    api.get('/produit').then(res => setProduits(res.data)).catch(console.error);
  }, []);

  const addToCart = () => {
    if (!selectedProduitId || qte < 1) return;
    const produit = produits.find(p => p.id === selectedProduitId);
    if (!produit) return;

    const existingIndex = panier.findIndex(item => item.produit.id === selectedProduitId);
    
    if (existingIndex >= 0) {
      const newPanier = [...panier];
      newPanier[existingIndex].qte += Number(qte);
      newPanier[existingIndex].totalLigne = newPanier[existingIndex].qte * produit.pu;
      setPanier(newPanier);
    } else {
      setPanier([...panier, {
        produit,
        qte: Number(qte),
        totalLigne: Number(qte) * produit.pu
      }]);
    }
  };

  const removeFromCart = (index: number) => {
    const newPanier = [...panier];
    newPanier.splice(index, 1);
    setPanier(newPanier);
  };

  const submitOrder = () => {
    if (!selectedClientId || panier.length === 0) {
      setNotification({ message: "Veuillez sélectionner un client et des produits.", type: 'error' });
      return;
    }

    const payload = {
      idClient: selectedClientId,
      lignes: panier.map(item => ({
        idProduit: item.produit.id,
        qte: item.qte
      }))
    };

    api.post('/commande', payload)
      .then(() => {
        setNotification({ message: 'Commande validée !', type: 'success' });
        
        // Préparation des données pour le ticket
        const clientObj = clients.find(c => c.id === selectedClientId);
        const clientName = clientObj ? `${clientObj.nom} ${clientObj.prenoms}` : 'Client';
        const total = panier.reduce((acc, item) => acc + item.totalLigne, 0);

        setLastOrderData({
            client: clientName,
            panier: [...panier],
            total: total
        });
        
        setShowRecu(true); // Affiche le ticket

        // Reset partiel (on garde le panier en mémoire pour le ticket, on le videra à la fermeture)
        setSelectedClientId('');
        setQte(1);
        setSelectedProduitId('');
      })
      .catch(err => {
        console.error(err);
        const msg = err.response?.data?.message || "Erreur commande";
        setNotification({ message: msg, type: 'error' });
      });
  };

  const handleCloseRecu = () => {
    setShowRecu(false);
    setPanier([]); // On vide le panier seulement après avoir imprimé/fermé
    setLastOrderData(null);
  };

  const totalGeneral = panier.reduce((acc, item) => acc + item.totalLigne, 0);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Nouvelle Commande</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6">1. Sélectionner le Client</Typography>
              <FormControl fullWidth>
                <InputLabel id="client-select-label">Client</InputLabel>
                <Select
                  labelId="client-select-label"
                  value={selectedClientId}
                  label="Client"
                  onChange={(e) => setSelectedClientId(Number(e.target.value))}
                >
                  {/* AJOUTEZ CETTE LIGNE : Option vide par défaut */}
                  <MenuItem value="" disabled>Sélectionnez un client</MenuItem>
                  
                  {clients.map(c => (
                    <MenuItem key={c.id} value={c.id}>{c.nom} {c.prenoms}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="h6" sx={{ mt: 2 }}>2. Ajouter des Produits</Typography>
             <FormControl fullWidth>
                <InputLabel id="produit-select-label">Produit</InputLabel>
                <Select
                  labelId="produit-select-label"
                  value={selectedProduitId}
                  label="Produit"
                  onChange={(e) => setSelectedProduitId(Number(e.target.value))}
                >
                  {/* AJOUTEZ CETTE LIGNE : Option vide par défaut */}
                  <MenuItem value="" disabled>Sélectionnez un produit</MenuItem>

                  {produits.map(p => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.libelle} ({p.pu} FCFA)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField label="Quantité" type="number" value={qte} onChange={(e) => setQte(Number(e.target.value))} InputProps={{ inputProps: { min: 1 } }} />
              <Button variant="outlined" startIcon={<ShoppingCartIcon />} onClick={addToCart}>Ajouter</Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Panier</Typography>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell>Produit</TableCell>
                    <TableCell align="right">PU</TableCell>
                    <TableCell align="center">Qté</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {panier.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.produit.libelle}</TableCell>
                      <TableCell align="right">{item.produit.pu}</TableCell>
                      <TableCell align="center">{item.qte}</TableCell>
                      <TableCell align="right"><strong>{item.totalLigne}</strong></TableCell>
                      <TableCell align="center">
                        <IconButton color="error" size="small" onClick={() => removeFromCart(index)}><DeleteIcon /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5">Total : {totalGeneral} FCFA</Typography>
              <Button variant="contained" color="success" size="large" onClick={submitOrder} disabled={panier.length === 0}>
                Valider & Imprimer
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* COMPOSANT REÇU (S'affiche par dessus) */}
      {showRecu && lastOrderData && (
        <RecuTemplate 
          clientName={lastOrderData.client}
          panier={lastOrderData.panier}
          total={lastOrderData.total}
          date={new Date().toLocaleDateString()}
          onClose={handleCloseRecu}
        />
      )}

      <Snackbar open={!!notification} autoHideDuration={6000} onClose={() => setNotification(null)}>
        <Alert severity={notification?.type} onClose={() => setNotification(null)}>{notification?.message}</Alert>
      </Snackbar>
    </Box>
  );
}