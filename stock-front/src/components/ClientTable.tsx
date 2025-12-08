// stock-front/src/components/ClientTable.tsx

import React from 'react';

// Interface Client (doit correspondre à l'entité NestJS)
interface Client {
  id: number;
  nom: string;
  email: string;
  telephone?: string;
  adresse?: string;
}

// Props pour le composant ClientTable
interface ClientTableProps {
  clients: Client[];
  // Ajoutez des fonctions pour la suppression et la modification si nécessaire
  // onDelete: (id: number) => void;
  // onEdit: (client: Client) => void;
}

const ClientTable: React.FC<ClientTableProps> = ({ clients /*, onDelete, onEdit*/ }) => {
  if (clients.length === 0) {
    return <p>Aucun client enregistré pour le moment.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Adresse</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>{client.id}</td>
              <td>{client.nom}</td>
              <td>{client.email}</td>
              <td>{client.telephone || 'N/A'}</td>
              <td>{client.adresse || 'N/A'}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2">Modifier</button>
                <button className="btn btn-sm btn-danger">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTable;