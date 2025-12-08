import { useEffect, useState } from 'react';
import { 
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Chip, Alert, Snackbar, IconButton, Tooltip, Select, MenuItem, InputLabel, FormControl, Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import InventoryIcon from '@mui/icons-material/Inventory';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';
import { formatPrice } from '../utils/format';

interface Fournisseur { id: number; nom: string; }
interface Produit { 
  id: number; 
  libelle: string; 
  reference: string; 
  pu: number; 
  seuilMinStock: number; 
  qte: number; 
  description?: string;
}

export default function ProduitsPage() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  
  // États ÉDITION / CRÉATION
  const [openCreate, setOpenCreate] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  
  const [formCreate, setFormCreate] = useState({
    libelle: '', reference: '', pu: '', seuilMinStock: '', description: ''
  });

 
  // États RAVITAILLEMENT
  const [openStock, setOpenStock] = useState(false);
  const [selectedProduitForStock, setSelectedProduitForStock] = useState<Produit | null>(null);

  const [stockForm, setStockForm] = useState({ // Nouveau state pour les données du lot
    qteStock: '',
    selectedFournisseurId: '' as number | '',
    referenceLot: '',
    prixAchat: '',
    datePeremption: '' // Format YYYY-MM-DD
  });
  // ...
  
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // --- CHARGEMENT DES DONNÉES ---
  const fetchProduits = () => {
    api.get('/produit').then(res => setProduits(res.data)).catch(console.error);
  };
  
  const fetchFournisseurs = () => {
    api.get('/fournisseur').then(res => setFournisseurs(res.data)).catch(console.error);
  };

  useEffect(() => {
    fetchProduits();
    fetchFournisseurs();
  }, []);

  // --- GESTION OUVERTURE MODALE (Création vs Modification) ---
  const handleOpenCreate = () => {
    setEditMode(false);
    setSelectedProductId(null);
    setFormCreate({ libelle: '', reference: '', pu: '', seuilMinStock: '', description: '' });
    setOpenCreate(true);
  };

  const handleOpenEdit = (produit: Produit) => {
    setEditMode(true);
    setSelectedProductId(produit.id);
    setFormCreate({
      libelle: produit.libelle,
      reference: produit.reference,
      pu: produit.pu.toString(),
      seuilMinStock: produit.seuilMinStock.toString(),
      description: produit.description || ''
    });
    setOpenCreate(true);
  };

  // --- ACTION SUPPRIMER ---
  const handleDelete = (id: number) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      api.delete(`/produit/${id}`)
        .then(() => {
          setNotification({ message: 'Produit supprimé.', type: 'success' });
          fetchProduits();
        })
        .catch(() => setNotification({ message: "Impossible de supprimer (utilisé dans des commandes ?).", type: 'error' }));
    }
  };

  // --- SOUMISSION DU FORMULAIRE PRODUIT ---
  const handleSubmitProduct = () => {
    const payload = {
      ...formCreate,
      pu: parseFloat(formCreate.pu),
      seuilMinStock: parseInt(formCreate.seuilMinStock)
    };

    const request = editMode && selectedProductId
      ? api.patch(`/produit/${selectedProductId}`, payload)
      : api.post('/produit', payload);

    request
      .then(() => {
        setNotification({ message: `Produit ${editMode ? 'modifié' : 'ajouté'} !`, type: 'success' });
        setOpenCreate(false);
        fetchProduits();
        if (!editMode) setFormCreate({ libelle: '', reference: '', pu: '', seuilMinStock: '', description: '' });
      })
      .catch(() => setNotification({ message: "Erreur lors de l'enregistrement.", type: 'error' }));
  };

  // --- GESTION STOCK (Ravitaillement) ---
  const openRestockDialog = (produit: Produit) => {
    setSelectedProduitForStock(produit);
    setStockForm({
      qteStock: '',
      selectedFournisseurId: '',
      referenceLot: '',
      prixAchat: '',
      datePeremption: ''
    }); // Réinitialisation du formulaire du lot
    setOpenStock(true);
  };
  // ...

 // stock-front/src/pages/ProduitsPage.tsx

// ...
const handleRestock = () => {
    
    const { qteStock, selectedFournisseurId, referenceLot, prixAchat, datePeremption } = stockForm;
    
    // ...

    const qte = parseInt(qteStock);
    const prix = parseFloat(prixAchat);

    // Si datePeremption est '', il devient undefined. Si c'est une date valide, ça reste.
    const dlc = datePeremption || undefined; 
    
    // Si la DLC est fournie mais vide ou mal formatée, l'API la validera si le champ est vide (undefined)
    const finalDLC = (dlc && dlc.trim() !== '') ? dlc : undefined;


    api.post(`/stock/${selectedProduitForStock.id}/ravitailler`, { 
        qte: qte, 
        idFournisseur: Number(selectedFournisseurId),
        referenceLot: referenceLot,
        prixAchat: prix,
        datePeremption: finalDLC // <== On envoie soit la date YYYY-MM-DD, soit undefined
    })

    // ...
      .then(() => {
        setNotification({ message: `Lot ${referenceLot} ajouté !`, type: 'success' });
        setOpenStock(false);
        fetchProduits();
      })
      .catch(err => {
        console.error(err);
        setNotification({ message: "Erreur ravitaillement: " + err.response?.data?.message, type: 'error' });
      });
  };
  // ...
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Catalogue Produits</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          Nouveau Produit
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#eee' }}>
            <TableRow>
              <TableCell>Référence</TableCell>
              <TableCell>Libellé</TableCell>
              <TableCell align="right">Prix</TableCell>
              <TableCell align="center">Stock</TableCell>
              <TableCell align="center">Seuil</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {produits.map((p) => (
              <TableRow key={p.id} hover>
                <TableCell>{p.reference}</TableCell>
                <TableCell>
                    <Box>
                        <Typography variant="body2" fontWeight="bold">{p.libelle}</Typography>
                        <Typography variant="caption" color="text.secondary">{p.description}</Typography>
                    </Box>
                </TableCell>
                <TableCell align="right">{formatPrice(p.pu)}</TableCell>
                <TableCell align="center">
                  <Chip label={p.qte} color={p.qte <= p.seuilMinStock ? "error" : "success"} variant="outlined" size="small"/>
                </TableCell>
                <TableCell align="center">
                  <Chip label={p.seuilMinStock} color="warning" size="small" variant="filled" />
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Tooltip title="Ravitailler">
                        <IconButton color="success" onClick={() => openRestockDialog(p)} size="small">
                            <InventoryIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Modifier">
                        <IconButton color="primary" onClick={() => handleOpenEdit(p)} size="small">
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                        <IconButton color="error" onClick={() => handleDelete(p.id)} size="small">
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* MODAL CRÉATION / ÉDITION PRODUIT */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>{editMode ? "Modifier le produit" : "Nouveau Produit"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: 400 }}>
            <TextField label="Libellé" value={formCreate.libelle} onChange={(e) => setFormCreate({...formCreate, libelle: e.target.value})} fullWidth />
            {/* La référence est désactivée en mode édition pour éviter de casser les liens, ou vous pouvez la laisser libre */}
            <TextField label="Référence (Laisser vide pour auto)" value={formCreate.reference} onChange={(e) => setFormCreate({...formCreate, reference: e.target.value})} fullWidth />
            <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField label="Prix" type="number" value={formCreate.pu} onChange={(e) => setFormCreate({...formCreate, pu: e.target.value})} fullWidth />
                <TextField label="Seuil Alerte" type="number" value={formCreate.seuilMinStock} onChange={(e) => setFormCreate({...formCreate, seuilMinStock: e.target.value})} fullWidth />
            </Box>
            <TextField label="Description" value={formCreate.description} onChange={(e) => setFormCreate({...formCreate, description: e.target.value})} fullWidth multiline rows={2}/>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Annuler</Button>
          <Button onClick={handleSubmitProduct} variant="contained">{editMode ? "Modifier" : "Créer"}</Button>
        </DialogActions>
      </Dialog>


      {/* MODAL RAVITAILLEMENT (MISE À JOUR LOTS) */}
  <Dialog open={openStock} onClose={() => setOpenStock(false)}>
    <DialogTitle>Réception de Lot : {selectedProduitForStock?.libelle}</DialogTitle>
    <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: 400 }}>

            <FormControl fullWidth>
                <InputLabel>Fournisseur *</InputLabel>
                <Select 
                  value={stockForm.selectedFournisseurId} 
                  label="Fournisseur *" 
                  onChange={(e) => setStockForm({...stockForm, selectedFournisseurId: Number(e.target.value)})}
                >
                    <MenuItem value="" disabled>Sélectionnez un fournisseur</MenuItem>
                    {fournisseurs.map(f => <MenuItem key={f.id} value={f.id}>{f.nom}</MenuItem>)}
                </Select>
            </FormControl>

            <TextField label="Référence Lot *" value={stockForm.referenceLot} onChange={(e) => setStockForm({...stockForm, referenceLot: e.target.value})} fullWidth />

            <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField label="Quantité Reçue *" type="number" value={stockForm.qteStock} onChange={(e) => setStockForm({...stockForm, qteStock: e.target.value})} fullWidth />
                <TextField label="Prix d'Achat Unitaire *" type="number" value={stockForm.prixAchat} onChange={(e) => setStockForm({...stockForm, prixAchat: e.target.value})} fullWidth />
            </Box>

            <TextField 
                label="Date de Péremption (DLC)" 
                type="date" 
                value={stockForm.datePeremption} 
                onChange={(e) => setStockForm({...stockForm, datePeremption: e.target.value})} 
                fullWidth 
                InputLabelProps={{ shrink: true }}
            />

        </Box>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setOpenStock(false)}>Annuler</Button>
      <Button onClick={handleRestock} variant="contained" color="success">Ajouter Lot</Button>
    </DialogActions>
  </Dialog>

      <Snackbar open={!!notification} autoHideDuration={6000} onClose={() => setNotification(null)}>
        <Alert severity={notification?.type} onClose={() => setNotification(null)}>{notification?.message}</Alert>
      </Snackbar>
    </Box>
  );
}