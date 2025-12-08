import { useEffect, useState } from 'react';
import { 
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Alert, Snackbar, IconButton, Tooltip, Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';

interface Fournisseur {
  id: number;
  nom: string;
  contactEmail: string;
  telephone: string;
  adresse: string;
}

export default function FournisseursPage() {
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  
  // États d'interface
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Formulaire
  const [formData, setFormData] = useState({
    nom: '',
    contactEmail: '',
    telephone: '',
    adresse: ''
  });

  // --- CHARGEMENT ---
  const fetchFournisseurs = () => {
    api.get('/fournisseur')
      .then(res => setFournisseurs(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchFournisseurs();
  }, []);

  // --- OUVERTURE MODALE (Création) ---
  const handleOpenCreate = () => {
    setEditMode(false);
    setSelectedId(null);
    setFormData({ nom: '', contactEmail: '', telephone: '', adresse: '' });
    setOpen(true);
  };

  // --- OUVERTURE MODALE (Modification) ---
  const handleOpenEdit = (fournisseur: Fournisseur) => {
    setEditMode(true);
    setSelectedId(fournisseur.id);
    setFormData({
      nom: fournisseur.nom,
      contactEmail: fournisseur.contactEmail,
      telephone: fournisseur.telephone || '',
      adresse: fournisseur.adresse || ''
    });
    setOpen(true);
  };

  // --- ACTION SUPPRIMER ---
  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce fournisseur ?")) {
      api.delete(`/fournisseur/${id}`)
        .then(() => {
          setNotification({ message: 'Fournisseur supprimé.', type: 'success' });
          fetchFournisseurs();
        })
        .catch(err => {
          console.error(err);
          setNotification({ message: "Impossible de supprimer (utilisé dans le stock ?).", type: 'error' });
        });
    }
  };

  // --- SOUMISSION ---
  const handleSubmit = () => {
    const request = editMode && selectedId
      ? api.patch(`/fournisseur/${selectedId}`, formData)
      : api.post('/fournisseur', formData);

    request
      .then(() => {
        setNotification({ 
            message: `Fournisseur ${editMode ? 'modifié' : 'créé'} avec succès !`, 
            type: 'success' 
        });
        setOpen(false); 
        fetchFournisseurs(); 
        if (!editMode) setFormData({ nom: '', contactEmail: '', telephone: '', adresse: '' });
      })
      .catch(err => {
        console.error("ERREUR API:", err);
        let errorMsg = "Erreur lors de l'opération.";
        if (err.response && err.response.data) {
            const msg = err.response.data.message;
            errorMsg = Array.isArray(msg) ? msg.join(', ') : msg;
        }
        setNotification({ message: errorMsg, type: 'error' });
      });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Gestion des Fournisseurs</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          Nouveau Fournisseur
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#eee' }}>
            <TableRow>
              <TableCell>Société</TableCell>
              <TableCell>Email Contact</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Adresse</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fournisseurs.map((f) => (
              <TableRow key={f.id} hover>
                <TableCell sx={{ fontWeight: 'bold' }}>{f.nom}</TableCell>
                <TableCell>{f.contactEmail}</TableCell>
                <TableCell>{f.telephone}</TableCell>
                <TableCell>{f.adresse}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Tooltip title="Modifier">
                        <IconButton color="primary" onClick={() => handleOpenEdit(f)} size="small">
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                        <IconButton color="error" onClick={() => handleDelete(f.id)} size="small">
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {fournisseurs.length === 0 && (
                <TableRow><TableCell colSpan={5} align="center">Aucun fournisseur enregistré.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* MODAL CRÉATION / ÉDITION */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editMode ? "Modifier le Fournisseur" : "Nouveau Partenaire"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: 400 }}>
            <TextField 
              label="Nom de la Société" 
              value={formData.nom} 
              onChange={(e) => setFormData({...formData, nom: e.target.value})} 
              fullWidth 
            />
            <TextField 
              label="Email Contact" 
              type="email" 
              value={formData.contactEmail} 
              onChange={(e) => setFormData({...formData, contactEmail: e.target.value})} 
              fullWidth 
            />
            <TextField 
              label="Téléphone" 
              value={formData.telephone} 
              onChange={(e) => setFormData({...formData, telephone: e.target.value})} 
              fullWidth 
            />
             <TextField 
              label="Adresse" 
              value={formData.adresse} 
              onChange={(e) => setFormData({...formData, adresse: e.target.value})} 
              fullWidth 
              multiline rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? "Modifier" : "Enregistrer"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!notification} autoHideDuration={6000} onClose={() => setNotification(null)}>
        <Alert severity={notification?.type} onClose={() => setNotification(null)}>{notification?.message}</Alert>
      </Snackbar>
    </Box>
  );
}