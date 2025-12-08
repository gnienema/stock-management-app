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

interface Client {
  id: number;
  nom: string;
  prenoms: string;
  email: string;
  telephone: string;
  adresse: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const [formData, setFormData] = useState({
    nom: '',
    prenoms: '',
    email: '',
    telephone: '',
    adresse: ''
  });

  const fetchClients = () => {
    api.get('/client')
      .then(res => setClients(res.data))
      .catch(err => console.error("Erreur chargement:", err));
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleOpenCreate = () => {
    setEditMode(false);
    setSelectedId(null);
    setFormData({ nom: '', prenoms: '', email: '', telephone: '', adresse: '' });
    setOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setEditMode(true);
    setSelectedId(client.id);
    setFormData({
      nom: client.nom,
      prenoms: client.prenoms,
      email: client.email,
      telephone: client.telephone || '',
      adresse: client.adresse || ''
    });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Supprimer ce client ?")) {
      api.delete(`/client/${id}`)
        .then(() => {
          setNotification({ message: 'Client supprimé.', type: 'success' });
          fetchClients();
        })
        .catch(() => setNotification({ message: "Impossible de supprimer (lié à des commandes).", type: 'error' }));
    }
  };

  const handleSubmit = () => {
    const request = editMode && selectedId
      ? api.patch(`/client/${selectedId}`, formData)
      : api.post('/client', formData);

    request
      .then(() => {
        setNotification({ message: `Client ${editMode ? 'modifié' : 'créé'} !`, type: 'success' });
        setOpen(false);
        fetchClients();
        if (!editMode) setFormData({ nom: '', prenoms: '', email: '', telephone: '', adresse: '' });
      })
      .catch(err => {
        const msg = err.response?.data?.message || "Erreur opération.";
        const displayMsg = Array.isArray(msg) ? msg.join(', ') : msg;
        setNotification({ message: displayMsg, type: 'error' });
      });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Gestion des Clients</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          Nouveau Client
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#eee' }}>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Prénoms</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((c) => (
              <TableRow key={c.id} hover>
                <TableCell>{c.nom}</TableCell>
                <TableCell>{c.prenoms}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.telephone}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Tooltip title="Modifier">
                      <IconButton color="primary" onClick={() => handleOpenEdit(c)} size="small">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton color="error" onClick={() => handleDelete(c.id)} size="small">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {clients.length === 0 && (
                <TableRow><TableCell colSpan={5} align="center">Aucun client trouvé.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editMode ? "Modifier le client" : "Nouveau Client"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: 400 }}>
            <TextField label="Nom" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} fullWidth />
            <TextField label="Prénoms" value={formData.prenoms} onChange={(e) => setFormData({...formData, prenoms: e.target.value})} fullWidth />
            <TextField label="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} fullWidth />
            <TextField label="Téléphone" value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})} fullWidth />
             <TextField label="Adresse" value={formData.adresse} onChange={(e) => setFormData({...formData, adresse: e.target.value})} fullWidth multiline rows={2}/>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained">{editMode ? "Modifier" : "Enregistrer"}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!notification} autoHideDuration={6000} onClose={() => setNotification(null)}>
        <Alert severity={notification?.type || 'info'} onClose={() => setNotification(null)}>{notification?.message}</Alert>
      </Snackbar>
    </Box>
  );
}