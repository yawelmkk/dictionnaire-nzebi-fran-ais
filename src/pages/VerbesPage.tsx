
import React from 'react';
import Layout from '@/components/Layout';
import { getEntriesByCategory } from '@/lib/dictionaryData';
import WordsList from '@/components/WordsList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const VerbesPage = () => {
  const verbes = getEntriesByCategory('verb');

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Verbes Nzébi</h2>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
          >
            <Plus size={18} />
            <span>Ajouter un verbe</span>
          </Button>
        </div>
        <WordsList entries={verbes} />
      </div>
    </Layout>
  );
};

export default VerbesPage;
