import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Paper, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';
import { Emplacement } from './emplacement.entity';

// Interface Frontend
interface Emplacement {
  id: number;
  nom: string;
  description: string;
}

const EmplacementsPage: React.FC = () => {
  const [emplacements, setEmplacements] = useState<Emplacement[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEmplacement, setCurrentEmplacement] = useState<Partial<Emplacement>>({ nom: '', description: '' });
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | null } | null>(null);

  const fetchEmplacements = () => {
    setLoading(true);
    api.get('/emplacement')
      .then(response => {
        setEmplacements(response.data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des emplacements:", error);
        setNotification({ message: "Erreur de chargement des emplacements.", type: 'error' });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEmplacements();
  }, []);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentEmplacement({ nom: '', description: '' });
    setOpenDialog(true);
  };

  const handleOpenEdit = (emplacement: Emplacement) => {
    setIsEditing(true);
    setCurrentEmplacement(emplacement);
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (!currentEmplacement.nom) {
      setNotification({ message: "Le nom de l'emplacement est obligatoire.", type: 'error' });
      return;
    }

    const payload = {
        nom: currentEmplacement.nom,
        description: currentEmplacement.description || null
    };

    if (isEditing && currentEmplacement.id) {
      // Modification
      api.patch(`/emplacement/${currentEmplacement.id}`, payload)
        .then(() => {
          setNotification({ message: "Emplacement modifié avec succès !", type: 'success' });
          setOpenDialog(false);
          fetchEmplacements();
        })
        .catch(error => {
          console.error("Erreur modification emplacement:", error);
          setNotification({ message: "Erreur lors de la modification.", type: 'error' });
        });
    } else {
      // Création
      api.post('/emplacement', payload)
        .then(() => {
          setNotification({ message: "Emplacement créé avec succès !", type: 'success' });
          setOpenDialog(false);
          fetchEmplacements();
        })
        .catch(error => {
          console.error("Erreur création emplacement:", error);
          setNotification({ message: "Erreur lors de la création. Le nom existe peut-être déjà.", type: 'error' });
        });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet emplacement ? Attention si du stock y est associé.")) {
      api.delete(`/emplacement/${id}`)
        .then(() => {
          setNotification({ message: "Emplacement supprimé.", type: 'success' });
          fetchEmplacements();
        })
        .catch(error => {
          console.error("Erreur suppression emplacement:", error);
          // Le RESTRICT SQL empêche la suppression si du stock existe.
          setNotification({ message: "Erreur: Impossible de supprimer cet emplacement (stock associé).", type: 'error' });
        });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        📍 Gestion des Emplacements / Multi-Entrepôts
      </Typography>
      
      {notification && (
        <Alert severity={notification.type || 'info'} sx={{ mb: 2 }} onClose={() => setNotification(null)}>
          {notification.message}
        </Alert>
      )}

      <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate} sx={{ mb: 3 }}>
        Ajouter un Emplacement
      </Button>

      {loading ? (
        <Typography>Chargement...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nom / Code *</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {emplacements.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{e.id}</TableCell>
                  <TableCell>{e.nom}</TableCell>
                  <TableCell>{e.description}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenEdit(e)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(e.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog Création/Modification */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{isEditing ? 'Modifier' : 'Créer'} un Emplacement</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 300, pt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Nom / Code de l'Emplacement"
              type="text"
              fullWidth
              variant="outlined"
              value={currentEmplacement.nom}
              onChange={(e) => setCurrentEmplacement({ ...currentEmplacement, nom: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Description (Optionnel)"
              type="text"
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              value={currentEmplacement.description}
              onChange={(e) => setCurrentEmplacement({ ...currentEmplacement, description: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            {isEditing ? 'Sauvegarder' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmplacementsPage;