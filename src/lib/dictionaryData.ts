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
  subcategories?: Category[];
}

export const categories: Category[] = [
  {
    id: 'noun',
    name: 'Noms',
    description: 'Désigne une personne, un lieu, une chose ou un concept',
    subcategories: [
      {
        id: 'proper_noun',
        name: 'Noms propres',
        description: 'Désigne une entité unique et spécifique'
      },
      {
        id: 'common_noun',
        name: 'Noms communs',
        description: 'Désigne une catégorie générale de personnes, lieux, choses ou concepts'
      }
    ]
  },
  {
    id: 'adjective',
    name: 'Adjectifs',
    description: 'Qualifie ou modifie un nom',
    subcategories: [
      {
        id: 'qualificative_adj',
        name: 'Adjectifs qualificatifs',
        description: 'Décrit une qualité ou caractéristique'
      },
      {
        id: 'possessive_adj',
        name: 'Adjectifs possessifs',
        description: 'Indique la possession ou l\'appartenance'
      },
      {
        id: 'demonstrative_adj',
        name: 'Adjectifs démonstratifs',
        description: 'Indique la position ou la référence'
      }
    ]
  },
  {
    id: 'verb',
    name: 'Verbes',
    description: 'Exprime une action, un état ou un processus'
  },
  {
    id: 'adverb',
    name: 'Adverbes',
    description: 'Modifie un verbe, un adjectif ou un autre adverbe',
    subcategories: [
      {
        id: 'manner_adv',
        name: 'Adverbes de manière',
        description: 'Indique comment une action est réalisée'
      },
      {
        id: 'time_adv',
        name: 'Adverbes de temps',
        description: 'Indique quand une action est réalisée'
      },
      {
        id: 'place_adv',
        name: 'Adverbes de lieu',
        description: 'Indique où une action est réalisée'
      }
    ]
  },
  {
    id: 'pronoun',
    name: 'Pronoms',
    description: 'Remplace un nom ou un groupe nominal',
    subcategories: [
      {
        id: 'personal_pron',
        name: 'Pronoms personnels',
        description: 'Remplace une personne ou une chose'
      },
      {
        id: 'possessive_pron',
        name: 'Pronoms possessifs',
        description: 'Indique la possession'
      },
      {
        id: 'demonstrative_pron',
        name: 'Pronoms démonstratifs',
        description: 'Désigne une personne ou une chose'
      }
    ]
  },
  {
    id: 'preposition',
    name: 'Prépositions',
    description: 'Relie des mots ou groupes de mots entre eux'
  },
  {
    id: 'conjunction',
    name: 'Conjonctions',
    description: 'Relie des mots, phrases ou propositions',
    subcategories: [
      {
        id: 'coord_conj',
        name: 'Conjonctions de coordination',
        description: 'Relie des éléments de même niveau'
      },
      {
        id: 'subord_conj',
        name: 'Conjonctions de subordination',
        description: 'Introduit une proposition subordonnée'
      }
    ]
  },
  {
    id: 'interjection',
    name: 'Interjections',
    description: 'Exprime une émotion ou un sentiment'
  }
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
