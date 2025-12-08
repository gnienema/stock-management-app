import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Divider, Button } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { formatPrice, formatDate } from '../utils/format';

// On définit les props (données) que la facture attend
interface FactureProps {
  commande: any; // Idéalement, typrez ceci avec l'interface Commande complète
  onClose: () => void;
}

export default function FactureTemplate({ commande, onClose }: FactureProps) {
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <Box sx={{ p: 4, bgcolor: 'white', minHeight: '100vh' }}>
      {/* BOUTONS (Cachés à l'impression grâce au CSS @media print) */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, '@media print': { display: 'none' } }}>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}>Imprimer / PDF</Button>
        <Button variant="outlined" onClick={onClose}>Fermer</Button>
      </Box>

      {/* EN-TÊTE */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary">MON ENTREPRISE</Typography>
          <Typography variant="body2">Abidjan, Côte d'Ivoire</Typography>
          <Typography variant="body2">Tél: +225 07 00 00 00</Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="h5">FACTURE N° {commande.id}</Typography>
          <Typography variant="body2">Date : {formatDate(new Date().toISOString())}</Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* INFO CLIENT */}
      <Box sx={{ mb: 4, p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">FACTURÉ À :</Typography>
        <Typography variant="h6">{commande.nom_client} {commande.prenom_client}</Typography>
      </Box>

      {/* LIGNES DE COMMANDE (À récupérer via une API si pas stocké dans l'objet commande) */}
      {/* Pour cet exemple, on affiche le total global car nous n'avons pas fetché les lignes dans le findAll précédent */}
      
      <Box sx={{ mt: 4, textAlign: 'right' }}>
        <Typography variant="h4" color="primary">
          TOTAL : {formatPrice(commande.prix_total)}
        </Typography>
      </Box>

      {/* PIED DE PAGE */}
      <Box sx={{ mt: 8, textAlign: 'center', color: 'gray', fontSize: 12 }}>
        <Typography>Merci pour votre confiance.</Typography>
      </Box>
    </Box>
  );
}