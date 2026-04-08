export const categories = [
  { id: 'noun', name: 'Nom' },
  { id: 'verb', name: 'Verbe' },
  { id: 'adjective', name: 'Adjectif' },
  { id: 'adverb', name: 'Adverbe' },
  { id: 'pronoun', name: 'Pronom' },
  { id: 'preposition', name: 'Préposition' },
  { id: 'conjunction', name: 'Conjonction' },
  { id: 'interjection', name: 'Interjection' },
  { id: 'adjectif possessif', name: 'Adjectif possessif' },
  { id: 'adverbe interrogatif', name: 'Adverbe interrogatif' },
  { id: 'adjectif démonstratif', name: 'Adjectif démonstratif' },
  { id: 'adjectif numéral', name: 'Adjectif numéral' },
  { id: 'locution adverbiale', name: 'Locution adverbiale' },
  { id: 'locution conjonctive', name: 'Locution conjonctive' },
  { id: 'locution prépositive', name: 'Locution prépositive' },
  { id: 'nom composé', name: 'Nom composé' },
  { id: 'nom propre', name: 'Nom propre' },
  { id: 'onomatopée', name: 'Onomatopée' },
  { id: 'particule', name: 'Particule' },
  { id: 'pronom démonstratif', name: 'Pronom démonstratif' },
  { id: 'pronom indéfini', name: 'Pronom indéfini' },
  { id: 'pronom interrogatif', name: 'Pronom interrogatif' },
  { id: 'pronom personnel', name: 'Pronom personnel' },
  { id: 'pronom possessif', name: 'Pronom possessif' },
];

export const getCategoryName = (categoryId: string): string => {
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.name : categoryId;
};


