
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DictionaryEntry, getCategoryById } from '@/lib/dictionaryData';

interface WordCardProps {
  entry: DictionaryEntry;
}

const WordCard: React.FC<WordCardProps> = ({ entry }) => {
  const category = getCategoryById(entry.categoryId);

  return (
    <Card className="w-full mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold">{entry.nzebi}</h3>
            <p className="text-md text-muted-foreground">{entry.french}</p>
          </div>
          <Badge variant="outline" className="bg-green-100">
            {category?.name || entry.categoryId}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="pt-2 border-t">
          <p className="font-semibold text-sm">Exemple:</p>
          <p className="italic text-sm">{entry.example.nzebi}</p>
          <p className="text-sm">{entry.example.french}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WordCard;
