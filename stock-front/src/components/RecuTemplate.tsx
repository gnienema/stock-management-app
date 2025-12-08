import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Divider, Button, Paper } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';

// --- Interfaces ---
interface LignePanier {
  produit: { libelle: string; pu: number };
  qte: number;
  totalLigne: number;
}

interface RecuProps {
  clientName: string;
  panier: LignePanier[];
  total: number;
  date: string;
  onClose: () => void;
}

export default function RecuTemplate({ clientName, panier, total, date, onClose }: RecuProps) {
  
  // --- Fonction utilitaire INTERNE (Plus besoin d'import) ---
  const formatPrice = (price: number): string => {
    if (isNaN(price)) return '0 FCFA';
    try {
      return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
    } catch (e) {
      return price + ' FCFA';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Sécurité anti-crash : si le panier est vide ou indéfini, on n'affiche rien
  if (!panier || panier.length === 0) return null;

  return (
    <Box 
      sx={{ 
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
        bgcolor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center'
      }}
    >
      <Paper 
        sx={{ 
          p: 4, width: '100%', maxWidth: 400, maxHeight: '90vh', overflow: 'auto',
          '@media print': { 
            boxShadow: 'none', maxWidth: '100%', position: 'absolute', top: 0, left: 0, margin: 0, padding: 0 
          }
        }}
        id="printable-area"
      >
        {/* EN-TÊTE TICKET */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">STOCK MANAGMENT</Typography>
          <Typography variant="body2">Abidjan, Côte d'Ivoire</Typography>
          <Typography variant="body2">Tél: +225 07 00 00 00</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2">Date : {date}</Typography>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>Client : {clientName}</Typography>
        </Box>

        {/* LISTE PRODUITS */}
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Art</TableCell>
              <TableCell align="center">Qté</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {panier.map((item, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontSize: '0.8rem' }}>{item.produit.libelle}</TableCell>
                <TableCell align="center">{item.qte}</TableCell>
                <TableCell align="right">
                    {formatPrice(item.totalLigne)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Divider sx={{ my: 2 }} />

        {/* TOTAL */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h6">TOTAL NET</Typography>
          <Typography variant="h6" fontWeight="bold">{formatPrice(total)}</Typography>
        </Box>

        <Typography variant="caption" display="block" align="center" sx={{ mb: 2 }}>
          Merci de votre visite !
        </Typography>

        {/* BOUTONS (Cachés à l'impression) */}
        <Box sx={{ display: 'flex', gap: 2, '@media print': { display: 'none' } }}>
          <Button fullWidth variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}>
            Imprimer
          </Button>
          <Button fullWidth variant="outlined" onClick={onClose}>
            Fermer
          </Button>
        </Box>
      </Paper>

      {/* CSS POUR L'IMPRESSION */}
      {/* ... (Code JSX du Reçu) ... */}

      {/* CSS POUR L'IMPRESSION (VERSION ULTRA-AGRESSIVE) */}
      <style>
        {`
          @media print {
            /* Masque l'intégralité du corps de l'application sauf l'élément imprimable */
            body * { visibility: hidden; }
            
            /* Rend le contenu du reçu et ses enfants visibles */
            #printable-area, #printable-area * { visibility: visible !important; }
            
            /* Positionne le reçu en haut à gauche de la page d'impression */
            #printable-area { 
                position: absolute; 
                left: 0; 
                top: 0; 
                width: 100%;
                margin: 0; 
                padding: 0; 
                box-shadow: none; /* Supprime l'ombre de la Paper MUI */
            }
          }
        `}
      </style>
    </Box>
  );
}