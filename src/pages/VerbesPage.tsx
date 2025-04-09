
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import WordsList from '@/components/WordsList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AddWordDialog from '@/components/AddWordDialog';
import { getWordsByCategory } from '@/services/wordsService';
import { toast } from 'sonner';

const VerbesPage = () => {
  const [verbes, setVerbes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVerbs = async () => {
    setIsLoading(true);
    try {
      const data = await getWordsByCategory('verb');
      setVerbes(data);
    } catch (error) {
      console.error('Error fetching verbs:', error);
      toast.error('Erreur lors du chargement des verbes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVerbs();
  }, []);

  const handleAddSuccess = () => {
    fetchVerbs();
    toast.success('Verbe ajouté avec succès!');
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Verbes Nzébi</h2>
          <AddWordDialog
            trigger={
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
              >
                <Plus size={18} />
                <span>Ajouter un verbe</span>
              </Button>
            }
            onSuccess={handleAddSuccess}
          />
        </div>
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Chargement des verbes...</p>
          </div>
        ) : (
          <WordsList entries={verbes} />
        )}
      </div>
    </Layout>
  );
};

export default VerbesPage;
