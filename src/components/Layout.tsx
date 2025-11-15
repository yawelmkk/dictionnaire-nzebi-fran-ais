import React, { ReactNode, useState, useEffect } from 'react';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { 
  MoreVertical, 
  Settings, 
  Info, 
  Mail, 
  RefreshCw,
  Tag,
  Trash,
  Sun,
  Moon,
  Search
} from 'lucide-react';
import { toast } from 'sonner';
import WordForm from '@/components/word-form/WordForm';
import { addWord, getAllWords, deleteWord } from '@/services/wordsService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { categories } from '@/lib/dictionaryData';

interface LayoutProps {
  children: ReactNode;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();
  const [settingsClickCount, setSettingsClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [versionClickCount, setVersionClickCount] = useState(0);
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [words, setWords] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedWord, setSelectedWord] = useState<any>(null);
  const [formKey, setFormKey] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Gestion du mode sombre
  useEffect(() => {
    // Vérifier la préférence système ou localStorage
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.body.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  
  // Reset click counter after 3 seconds of inactivity
  useEffect(() => {
    if (settingsClickCount > 0) {
      const timer = setTimeout(() => {
        setSettingsClickCount(0);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [settingsClickCount, lastClickTime]);
  
  const handleSettingsClick = () => {
    const currentTime = Date.now();
    setLastClickTime(currentTime);
    
    // Increment counter
    const newCount = settingsClickCount + 1;
    setSettingsClickCount(newCount);
    
    // After 20 clicks, redirect to appropriate page based on count
    if (newCount >= 20) {
      // Reset counter
      setSettingsClickCount(0);
      // Show options after 20 clicks
      navigate('/ajouter');
    }
  };

  const handleAboutClick = () => {
    toast.info(
      <div className="flex flex-col gap-3 max-w-2xl">
        <h3 className="font-bold text-lg">Le dictionnaire Nzébi-français</h3>
        <div className="space-y-3 text-sm overflow-y-auto max-h-[500px]">
          <p>Le dictionnaire Nzébi-français est une application conçue pour préserver, valoriser et transmettre la langue et le patrimoine culturel de l'ethnie Nzébi du Gabon et du Congo.</p>
          <p>Elle permet à tout utilisateur de découvrir des mots en langue nzébi, leur traduction en français, et dans certains cas, leur prononciation audio, afin d'en faciliter l'apprentissage et la mémorisation.</p>

          <p>Ce projet s'inscrit dans une démarche de sauvegarde des langues gabonaises minoritaires, souvent menacées de disparition à cause de l'exode rural, de la domination du français, et du vieillissement des locuteurs natifs.</p>

          <h4 className="font-bold text-base mt-4">Origine des données linguistiques</h4>
          <p>Les données de ce dictionnaire proviennent d'un travail existant, réalisé par: Luc de NADAILLAC, sous la forme d'un PDF librement accessible en ligne.
          Ce dictionnaire numérique ne prétend en aucun cas s'approprier ce travail. Au contraire, il vise à le valoriser, le diffuser et le rendre plus accessible, notamment aux jeunes générations.</p>
          <p>Nous reconnaissons et respectons la propriété intellectuelle de l'auteur initial, et l'application ne saurait exister sans sa contribution précieuse.</p>

          <h4 className="font-bold text-base mt-4">Qui sont les Nzébi ?</h4>
          <p>Les Nzébi (ou Ndzébi, parfois écrit Njebi) sont un peuple bantou du Gabon et du Congo-Brazzaville. Au Gabon, ils sont principalement présents dans le sud-est du pays.</p>

          <h5 className="font-bold text-sm mt-2">Localisation</h5>
          <p>Ils sont installés dans la province du Haut-Ogooué (notamment autour de Franceville, Moanda, Bongoville) et aussi dans le sud de la Ngounié (Mbigou, Mandji, Lébamba, Mouila).</p>
          <p>Le territoire nzébi se situe entre forêts équatoriales, plateaux sablonneux et zones minières, en bordure du fleuve Ogooué et de ses affluents.</p>

          <h5 className="font-bold text-sm mt-2">Population</h5>
          <p>Leur population est estimée entre 50 000 et 70 000 personnes au Gabon, bien que beaucoup aient migré vers les villes comme Libreville ou Port-Gentil. Certains groupes Nzébi sont également présents au Congo-Brazzaville.</p>

          <h5 className="font-bold text-sm mt-2">Histoire, culture et langue</h5>
          <p>Les Nzébi descendent de peuples bantous migrants, venus des rives du fleuve Congo.</p>
          <p>Ils sont réputés pour leur culture spirituelle riche, leurs rituels d'initiation (Bwiti, Mwiri, etc.), leurs masques traditionnels et leur oralité poétique.</p>
          <p>Leur langue, le nzébi, fait partie du groupe B.50 des langues bantoues, avec une grammaire complexe fondée sur les classes nominales et un système de tons.</p>
          <p>Cependant, cette langue est aujourd'hui en danger, menacée par la prédominance du français dans l'enseignement, les médias et la vie sociale. C'est pourquoi cette application souhaite contribuer, à son échelle, à la préservation de ce patrimoine linguistique précieux.</p>
          <p>En utilisant cette application, vous participez activement à la transmission de la langue nzébi.
          Merci de votre engagement et de votre curiosité.</p>
          <p className="font-semibold">Merci d'utiliser cette application et de soutenir la mission de Langue Nzébi Officiel.
          En diffusant et en pratiquant la langue nzébi, vous aidez à faire vivre un patrimoine culturel précieux.</p>
        </div>
        <div className="flex justify-end mt-4">
          <button 
            onClick={() => toast.dismiss()}
            className="px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors"
          >
            Retour
          </button>
        </div>
      </div>,
      {
        duration: Infinity,
        className: "bg-white text-black",
        style: {
          maxWidth: "600px",
          padding: "1.5rem",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        }
      }
    );
  };

  const handleContactClick = () => {
    window.location.href = 'mailto:languenzebiofficiel@gmail.com';
  };

  const handleUpdateClick = () => {
    toast.info("Mise à jour", {
      description: "Vérification des mises à jour..."
    });
    // Ici vous pouvez ajouter la logique de mise à jour
  };

  const handleVersionClick = () => {
    const newCount = versionClickCount + 1;
    setVersionClickCount(newCount);
    if (newCount >= 20) {
      setShowSecretModal(true);
      setVersionClickCount(0);
    }
  };

  // Charger les mots à l'ouverture du menu secret
  useEffect(() => {
    if (showSecretModal) {
      fetchWords();
      setSelectedWord(null);
      setFormKey(prev => prev + 1); // reset form
    }
  }, [showSecretModal]);

  // Préserver la position de scroll lors de l'ouverture/fermeture de la modale
  useEffect(() => {
    if (showSecretModal) {
      // Sauvegarder la position de scroll actuelle avant l'ouverture
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      
      // Empêcher Radix UI de bloquer le scroll en restaurant la position
      // Utiliser plusieurs tentatives pour s'assurer que ça fonctionne
      const restoreScroll = () => {
        // Vérifier si le body a été modifié par Radix UI
        const body = document.body;
        // Restaurer les styles si Radix UI les a modifiés
        if (body.style.overflow === 'hidden' || body.style.position === 'fixed') {
          body.style.overflow = '';
          body.style.position = '';
          body.style.top = '';
          body.style.width = '';
        }
        
        // Restaurer la position de scroll
        const currentScroll = window.scrollY || document.documentElement.scrollTop;
        if (Math.abs(currentScroll - scrollY) > 1) {
          window.scrollTo({
            top: scrollY,
            behavior: 'auto'
          });
        }
      };

      // Restaurer après que Radix UI ait fait ses modifications
      const timeoutId1 = setTimeout(restoreScroll, 0);
      const timeoutId2 = setTimeout(restoreScroll, 10);
      const timeoutId3 = setTimeout(restoreScroll, 50);
      const timeoutId4 = setTimeout(restoreScroll, 100);
      
      // Utiliser requestAnimationFrame pour restaurer après le rendu
      requestAnimationFrame(() => {
        requestAnimationFrame(restoreScroll);
      });

      // Observer les changements de style sur le body
      const observer = new MutationObserver(restoreScroll);
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['style', 'class']
      });

      return () => {
        clearTimeout(timeoutId1);
        clearTimeout(timeoutId2);
        clearTimeout(timeoutId3);
        clearTimeout(timeoutId4);
        observer.disconnect();
        
        // Restaurer les styles et la position à la fermeture
        const body = document.body;
        body.style.overflow = '';
        body.style.position = '';
        body.style.top = '';
        body.style.width = '';
        
        requestAnimationFrame(() => {
          window.scrollTo({
            top: scrollY,
            behavior: 'auto'
          });
        });
      };
    }
  }, [showSecretModal]);

  const fetchWords = async () => {
    try {
      const data = await getAllWords();
      setWords(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des mots');
    }
  };

  const handleDeleteWord = async (id: string) => {
    if (!window.confirm('Supprimer ce mot ?')) return;
    try {
      await deleteWord(id);
      toast.success('Mot supprimé !');
      fetchWords();
      if (selectedWord && selectedWord.id === id) setSelectedWord(null);
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleEditWord = (word: any) => {
    setSelectedWord(word);
    setFormKey(prev => prev + 1); // force le reset du formulaire avec nouvelles valeurs
  };

  const handleAddWord = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (selectedWord) {
        // Modification : suppression puis ajout (simple pour ce cas)
        await deleteWord(selectedWord.id);
      }
      await addWord(data);
      toast.success(selectedWord ? 'Mot modifié !' : 'Mot ajouté avec succès !');
      fetchWords();
      setSelectedWord(null);
      setFormKey(prev => prev + 1);
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement du mot");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredWords = words
    .filter(w =>
      w.nzebi_word.toLowerCase().includes(search.toLowerCase()) ||
      w.french_word.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.nzebi_word.localeCompare(b.nzebi_word, 'fr'));
  
  return (
    <div className="min-h-screen bg-nzebi-background dark:bg-nzebi-background-dark transition-colors duration-300">
      <div className="sticky top-0 z-50 backdrop-blur-lg bg-white/90 dark:bg-nzebi-background-dark/90 border-b border-nzebi-surface dark:border-nzebi-surface-dark">
        <header className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-4">
            {/* Logo et titre */}
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nzebi-primary to-nzebi-accent flex items-center justify-center shadow-soft group-hover:shadow-card-hover transition-all duration-300">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-nzebi-text dark:text-nzebi-text-dark">
                  Nzébi
                </h1>
                <p className="text-xs text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary">
                  Dictionnaire
                </p>
              </div>
            </button>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {/* Bascule mode sombre */}
              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl bg-nzebi-surface dark:bg-nzebi-surface-dark 
                         text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary
                         hover:bg-nzebi-primary/10 dark:hover:bg-nzebi-accent/20
                         hover:text-nzebi-primary dark:hover:text-nzebi-accent
                         transition-all duration-300"
                aria-label={isDarkMode ? "Mode clair" : "Mode sombre"}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Menu principal */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-2.5 rounded-xl bg-nzebi-surface dark:bg-nzebi-surface-dark
                             text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary
                             hover:bg-nzebi-primary/10 dark:hover:bg-nzebi-accent/20
                             hover:text-nzebi-primary dark:hover:text-nzebi-accent
                             transition-all duration-300"
                    aria-label="Menu"
                  >
                    <MoreVertical size={20} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={handleSettingsClick}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleAboutClick}>
                    <Info className="mr-2 h-4 w-4" />
                    <span>À propos</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleContactClick}>
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Contactez-nous</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleUpdateClick}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    <span>Mise à jour</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={e => {
                      e.preventDefault();
                      handleVersionClick();
                    }}
                    style={{
                      opacity: 0.5,
                      cursor: 'pointer',
                      pointerEvents: 'auto',
                    }}
                  >
                    <Tag className="mr-2 h-4 w-4" />
                    <span>Version 1.0.0</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        {/* Search bar moved here */}
        <div className="max-w-4xl mx-auto px-4 pb-4 sm:px-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary pointer-events-none" size={20} />
            <input
              type="text"
              placeholder="Rechercher un mot en nzébi ou en français..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input pl-10 py-3 text-base"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg hover:bg-nzebi-primary/10 dark:hover:bg-nzebi-accent/20 transition-colors duration-200"
                aria-label="Effacer la recherche"
              >
                <svg className="w-4 h-4 text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8 pt-[120px]">
        {children}
      </main>
      
      {/* <MobileNav /> */}

      <Dialog open={showSecretModal} onOpenChange={setShowSecretModal}>
        <DialogContent 
          className="max-w-2xl"
        >
          <DialogHeader>
            <DialogTitle>Menu secret : Gestion des mots</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Compteur de mots */}
            <div className="mb-2 text-sm font-semibold text-gray-700">
              Nombre de mots enregistrés : {filteredWords.length}
            </div>
            {/* Liste des mots + recherche */}
            <div className="w-full md:w-1/2 max-h-[60vh] overflow-y-auto border-r pr-4">
              <div className="flex items-center mb-2 gap-2 sticky top-0 bg-white z-10 py-2 border-b">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm"
                />
                <button
                  className="bg-green-600 text-white rounded p-2 hover:bg-green-700"
                  onClick={() => { setSelectedWord(null); setFormKey(prev => prev + 1); }}
                  title="Ajouter un mot"
                >
                  +
                </button>
              </div>
              <ul className="divide-y">
                {filteredWords.map(word => (
                  <li key={word.id} className="flex items-center justify-between py-2 group">
                    <span
                      className="cursor-pointer hover:underline"
                      onClick={() => handleEditWord(word)}
                    >
                      <span className="font-bold text-green-900">{word.nzebi_word}</span> <span className="text-gray-500">({word.french_word})</span>
                    </span>
                    <button
                      className="ml-2 text-red-500 opacity-70 hover:opacity-100"
                      onClick={() => handleDeleteWord(word.id)}
                      title="Supprimer"
                    >
                      <Trash size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {/* Formulaire d'ajout/modification */}
            <div className="w-full md:w-1/2">
              <WordForm
                key={formKey}
                onSubmit={handleAddWord}
                isSubmitting={isSubmitting}
                initialValues={selectedWord ? {
                  nzebi: selectedWord.nzebi_word,
                  french: selectedWord.french_word,
                  categoryId: selectedWord.part_of_speech,
                  exampleNzebi: selectedWord.example_nzebi || '',
                  exampleFrench: selectedWord.example_french || '',
                  pluralForm: selectedWord.plural_form || '',
                  synonyms: selectedWord.synonyms || ''
                } : undefined}
                categories={categories}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Layout;
