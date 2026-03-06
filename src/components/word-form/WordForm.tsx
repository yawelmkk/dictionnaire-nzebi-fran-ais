import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface WordFormProps {
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  initialValues?: any;
  categories: any[];
}

export default function WordForm({ onSubmit, isSubmitting, initialValues, categories }: WordFormProps) {
  const [formData, setFormData] = useState({
    nzebi: initialValues?.nzebi || '',
    french: initialValues?.french || '',
    categoryId: initialValues?.categoryId || '',
    exampleNzebi: initialValues?.exampleNzebi || '',
    exampleFrench: initialValues?.exampleFrench || '',
    pluralForm: initialValues?.pluralForm || '',
    synonyms: initialValues?.synonyms || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Mot Nzébi</label>
        <input
          type="text"
          value={formData.nzebi}
          onChange={e => setFormData({ ...formData, nzebi: e.target.value })}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Mot Français</label>
        <input
          type="text"
          value={formData.french}
          onChange={e => setFormData({ ...formData, french: e.target.value })}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Catégorie</label>
        <select
          value={formData.categoryId}
          onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
          className="w-full px-3 py-2 border rounded-md"
          required
        >
          <option value="">Sélectionner...</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Exemple Nzébi</label>
        <input
          type="text"
          value={formData.exampleNzebi}
          onChange={e => setFormData({ ...formData, exampleNzebi: e.target.value })}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Exemple Français</label>
        <input
          type="text"
          value={formData.exampleFrench}
          onChange={e => setFormData({ ...formData, exampleFrench: e.target.value })}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
      </Button>
    </form>
  );
}


