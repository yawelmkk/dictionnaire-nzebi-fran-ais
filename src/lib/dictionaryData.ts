export interface DictionaryEntry {
  id: string;
  nzebi: string;
  french: string;
  categoryId: string;
  example: {
    nzebi: string;
    french: string;
  };
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: 'uncategorized',
    name: 'Non catégorisé',
    description: 'Mots dont la catégorie n\'est pas encore définie'
  },
  { 
    id: 'noun', 
    name: 'Nom', 
    description: 'Désigne une personne, un lieu, une chose ou un concept'
  },
  { 
    id: 'verb', 
    name: 'Verbe', 
    description: 'Exprime une action, un état ou un processus'
  },
  { 
    id: 'adjective', 
    name: 'Adjectif', 
    description: 'Qualifie ou modifie un nom'
  },
  { 
    id: 'adverb', 
    name: 'Adverbe', 
    description: 'Modifie un verbe, un adjectif ou un autre adverbe'
  },
  { 
    id: 'pronoun', 
    name: 'Pronom', 
    description: 'Remplace un nom ou un groupe nominal'
  },
];

// Using an array for dictionary entries that can be modified
export const dictionaryEntries: DictionaryEntry[] = [
  {
    id: '1',
    nzebi: 'mwana',
    french: 'enfant',
    categoryId: 'noun',
    example: {
      nzebi: 'Mwana a bakè na ndzo.',
      french: "L'enfant est rentré à la maison."
    }
  },
  {
    id: '2',
    nzebi: 'ndzo',
    french: 'maison',
    categoryId: 'noun',
    example: {
      nzebi: 'Ndzo ami e lè mboti.',
      french: 'Ma maison est belle.'
    }
  },
  {
    id: '3',
    nzebi: 'dia',
    french: 'manger',
    categoryId: 'verb',
    example: {
      nzebi: 'Beto tè dia.',
      french: 'Nous mangeons.'
    }
  },
  {
    id: '4',
    nzebi: 'mboti',
    french: 'beau/belle',
    categoryId: 'adjective',
    example: {
      nzebi: 'Mwasi a lè mboti.',
      french: 'La femme est belle.'
    }
  },
  {
    id: '5',
    nzebi: 'mwasi',
    french: 'femme',
    categoryId: 'noun',
    example: {
      nzebi: 'Mwasi a bakè na tsiani.',
      french: 'La femme est allée au marché.'
    }
  },
  {
    id: '6',
    nzebi: 'mumi',
    french: 'homme',
    categoryId: 'noun',
    example: {
      nzebi: 'Mumi a lè ngulu.',
      french: "L'homme est fort."
    }
  },
  {
    id: '7',
    nzebi: 'tunga',
    french: 'construire',
    categoryId: 'verb',
    example: {
      nzebi: 'Beto tè tunga ndzo.',
      french: 'Nous construisons une maison.'
    }
  },
  {
    id: '8',
    nzebi: 'lamba',
    french: 'cuisiner',
    categoryId: 'verb',
    example: {
      nzebi: 'A lamba bidia.',
      french: 'Elle cuisine le repas.'
    }
  },
  {
    id: '9',
    nzebi: 'mè',
    french: 'je/moi',
    categoryId: 'pronoun',
    example: {
      nzebi: 'Mè nè vè ngulu.',
      french: 'Je suis fort.'
    }
  },
  {
    id: '10',
    nzebi: 'bwato',
    french: 'rapidement',
    categoryId: 'adverb',
    example: {
      nzebi: 'A nè kwènda bwato.',
      french: 'Il marche rapidement.'
    }
  }
];

export function searchEntries(query: string): DictionaryEntry[] {
  if (!query || query.trim() === '') {
    return dictionaryEntries;
  }
  
  const lowerCaseQuery = query.toLowerCase().trim();
  
  return dictionaryEntries.filter(entry => 
    entry.nzebi.toLowerCase().includes(lowerCaseQuery) || 
    entry.french.toLowerCase().includes(lowerCaseQuery)
  );
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find(category => category.id === id);
}

export function getEntriesByCategory(categoryId: string): DictionaryEntry[] {
  return dictionaryEntries.filter(entry => entry.categoryId === categoryId);
}

// Add a new function to add entries to the dictionary
export function addEntry(entry: DictionaryEntry): void {
  dictionaryEntries.push(entry);
}
