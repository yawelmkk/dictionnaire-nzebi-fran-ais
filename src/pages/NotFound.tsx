import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="text-center py-16 animate-fade-in">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-nzebi-primary/10 dark:bg-nzebi-accent/20 flex items-center justify-center">
        <AlertCircle size={48} className="text-nzebi-primary dark:text-nzebi-accent" />
      </div>
      <h1 className="text-6xl font-bold mb-4 text-nzebi-text dark:text-nzebi-text-dark">404</h1>
      <p className="text-xl text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary mb-8">
        Page non trouvée
      </p>
      <button
        onClick={() => navigate('/')}
        className="btn-primary inline-flex items-center gap-2"
      >
        <Home size={20} />
        Retour à l'accueil
      </button>
    </div>
  );
}


