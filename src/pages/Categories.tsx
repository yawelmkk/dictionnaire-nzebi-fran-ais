
import React from 'react';
import Layout from '@/components/Layout';
import { categories, getEntriesByCategory } from '@/lib/dictionaryData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="max-w-3xl mx-auto pb-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Catégories</h1>
          <p className="text-gray-600">Explorez les mots par catégorie grammaticale</p>
        </div>
        
        <div className="grid gap-4">
          {categories.map((category) => {
            const entries = getEntriesByCategory(category.id);
            
            return (
              <Card 
                key={category.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/?category=${category.id}`)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <Badge variant="outline" className="bg-green-100">
                      {entries.length} mot{entries.length > 1 ? 's' : ''}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
