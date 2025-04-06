
import React from 'react';
import Layout from '@/components/Layout';
import { getEntriesByCategory } from '@/lib/dictionaryData';
import WordsList from '@/components/WordsList';

const VerbesPage = () => {
  const verbes = getEntriesByCategory('verb');

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold text-center mb-6">Verbes Nzébi</h2>
        <WordsList entries={verbes} />
      </div>
    </Layout>
  );
};

export default VerbesPage;
