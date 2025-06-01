import React, { ReactNode, useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileNav } from './MobileNav';
import TabsNavigation from './TabsNavigation';
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
  Trash
} from 'lucide-react';
import { toast } from 'sonner';
import WordForm from '@/components/word-form/WordForm';
import { addWord, getAllWords, deleteWord } from '@/services/wordsService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { categories } from '@/lib/dictionaryData';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [settingsClickCount, setSettingsClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [versionClickCount, setVersionClickCount] = useState(0);
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [words, setWords] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedWord, setSelectedWord] = useState(null);
  const [formKey, setFormKey] = useState(0);
  
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
    
    // After 10 clicks, redirect to appropriate page based on count
    if (newCount >= 20) {
      // Reset counter
      setSettingsClickCount(0);
      // Show options after 10 clicks
      navigate('/ajouter');
    }
  };

  const handleAboutClick = () => {
    toast.info(
      <div className="flex flex-col gap-3 max-w-2xl">
        <h3 className="font-bold text-lg">À propos du Dictionnaire Nzébi-Français</h3>
        <div className="space-y-3 text-sm">
          <p>Le Nzébi est une langue bantoue parlée principalement au Gabon et dans certaines régions de la République du Congo.</p>
          <p>Au Gabon, la langue est principalement utilisée dans les provinces de la Ngounié et du Haut-Ogooué, notamment dans des villes comme Lebamba, Franceville, et leurs environs.</p>
          <p>On estime qu'il y a environ 60 000 à 80 000 locuteurs Nzébi répartis entre le Gabon et le Congo.</p>
          <p>Ce dictionnaire Français-Nzébi a été conçu pour préserver, promouvoir et faciliter l'apprentissage de cette langue riche en culture et en histoire.</p>
          <p>Il propose des traductions, des synonymes, des formes plurielles, et bientôt des prononciations audio pour aider tous ceux qui souhaitent découvrir ou approfondir leur connaissance du Nzébi.</p>
          <p className="font-semibold">Ce dictionnaire a été créé par NDJONDO MAKOUKOU Fredy, animé par la passion de valoriser le patrimoine linguistique Nzébi et de le rendre accessible à tous.</p>
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

  const fetchWords = async () => {
    try {
      const data = await getAllWords();
      setWords(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des mots');
    }
  };

  const handleDeleteWord = async (id) => {
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

  const handleEditWord = (word) => {
    setSelectedWord(word);
    setFormKey(prev => prev + 1); // force le reset du formulaire avec nouvelles valeurs
  };

  const handleAddWord = async (data) => {
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
    <div className="min-h-screen bg-slate-100">
      <div className="sticky top-0 z-50">
        <header className="bg-[#374151] rounded-t-lg">
          <div className="flex items-center justify-between px-8 pt-8 pb-2">
            <h1 className="text-5xl font-bold italic text-white">Nzébi</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="rounded-full bg-[#42506a] p-4 flex items-center justify-center"
                >
                  <MoreVertical className="text-white" size={28} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleSettingsClick}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  toast.info(
                    <div style={{maxHeight: '60vh', overflowY: 'auto'}}>
                      <h3 className="font-bold text-lg mb-2">Politique de confidentialité</h3>
                      <p className="mb-2">Merci d'utiliser notre application Dictionnaire Nzebi-Français, disponible sur mobile et sur le web.</p>
                      <p className="mb-2">Nous prenons votre vie privée très au sérieux. Cette politique de confidentialité a pour but de vous informer de manière transparente sur la manière dont vos données sont traitées lorsque vous utilisez notre application.</p>
                      <ol className="mb-2 list-decimal list-inside">
                        <li className="mb-1">
                          <strong>Données collectées</strong><br/>
                          Aucune donnée personnelle n'est collectée.<br/>
                          L'application ne collecte, ne stocke, ni ne partage aucune information personnelle ou données sensibles. Cela inclut :<br/>
                          <ul className="list-disc list-inside ml-4">
                            <li>Nom</li>
                            <li>Adresse e-mail</li>
                            <li>Adresse IP</li>
                            <li>Données de localisation</li>
                            <li>Historique de navigation ou d'utilisation</li>
                          </ul>
                          Votre utilisation de l'application reste entièrement anonyme.
                        </li>
                        <li className="mb-1">
                          <strong>Cookies et technologies de suivi</strong><br/>
                          La version web de l'application ne recourt pas à des cookies ou à des outils de suivi tiers.
                        </li>
                        <li className="mb-1">
                          <strong>Services tiers</strong><br/>
                          L'application n'intègre aucun service tiers susceptible de collecter des données, tels que Google Analytics, Facebook SDK ou autres services similaires.
                        </li>
                        <li className="mb-1">
                          <strong>Sécurité</strong><br/>
                          Même si aucune donnée n'est collectée, nous mettons en œuvre des mesures techniques pour garantir que votre expérience soit sécurisée et sans risques pour votre vie privée.
                        </li>
                        <li className="mb-1">
                          <strong>Modifications de la politique de confidentialité</strong><br/>
                          Nous nous réservons le droit de modifier cette politique à tout moment. Toute mise à jour sera publiée sur cette page, avec indication de la date de modification.
                        </li>
                        <li className="mb-1">
                          <strong>Contact</strong><br/>
                          Pour toute question concernant cette politique de confidentialité, vous pouvez nous contacter à l'adresse suivante :<br/>
                          <a href="mailto:languenzebiofficiel@gmail.com" className="text-blue-600 underline">languenzebiofficiel@gmail.com</a>
                        </li>
                      </ol>
                      <div className="flex justify-end mt-4">
                        <button 
                          onClick={() => toast.dismiss()}
                          className="px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors"
                        >
                          Fermer
                        </button>
                      </div>
                    </div>,
                    {
                      duration: 20000,
                      className: "bg-white text-black",
                      style: {
                        maxWidth: "500px",
                        padding: "1rem",
                        borderRadius: "0.5rem"
                      }
                    }
                  );
                }}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres de confidentialité</span>
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
          <div className="flex justify-center pb-2">
            <span className="text-black text-2xl tracking-widest" style={{letterSpacing: '0.1em'}}>DICTIONNAIRE</span>
          </div>
          <div className="h-1 bg-yellow-400 w-[98%] mx-auto rounded" />
        </header>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-4">
        {children}
      </main>
      
      <MobileNav />

      <Dialog open={showSecretModal} onOpenChange={setShowSecretModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Menu secret : Gestion des mots</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col md:flex-row gap-6">
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
