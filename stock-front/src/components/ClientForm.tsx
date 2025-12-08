// stock-front/src/components/ClientForm.tsx

import React, { useState } from 'react';

// Interface pour les données du formulaire (sans l'ID)
interface ClientFormData {
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
}

// Props pour le composant ClientForm
interface ClientFormProps {
  onSubmit: (data: ClientFormData) => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ClientFormData>({
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData); // Appelle la fonction handleAddClient de la page parente
    // Réinitialiser le formulaire après soumission
    setFormData({ nom: '', email: '', telephone: '', adresse: '' }); 
  };

  return (
    <div className="card mb-4">
      <div className="card-header">Ajouter un Nouveau Client</div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          
          <div className="mb-3">
            <label htmlFor="nom" className="form-label">Nom Complet</label>
            <input
              type="text"
              className="form-control"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="telephone" className="form-label">Téléphone</label>
            <input
              type="text"
              className="form-control"
              id="telephone"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="adresse" className="form-label">Adresse</label>
            <input
              type="text"
              className="form-control"
              id="adresse"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
            />
          </div>
          
          <button type="submit" className="btn btn-primary">Ajouter Client</button>
        </form>
      </div>
    </div>
  );
};

export default ClientForm;