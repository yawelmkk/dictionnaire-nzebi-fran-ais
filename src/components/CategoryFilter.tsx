
import React from 'react';
import { Button } from '@/components/ui/button';
import { categories } from '@/lib/dictionaryData';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  selectedCategory, 
  onSelectCategory 
}) => {
  return (
    <div className="my-4">
      <h3 className="text-sm font-medium mb-2">Filtrer par catégorie:</h3>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 pb-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectCategory(null)}
            className="flex-shrink-0"
          >
            Tous
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => onSelectCategory(category.id)}
              className="flex-shrink-0"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CategoryFilter;
