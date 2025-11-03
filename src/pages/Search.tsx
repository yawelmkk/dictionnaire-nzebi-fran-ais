import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Search() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-nzebi-primary/10 dark:bg-nzebi-accent/20 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-nzebi-primary dark:text-nzebi-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-nzebi-text dark:text-nzebi-text-dark mb-2">
          Recherche avancée
        </h1>
        <p className="text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary">
          La recherche avancée sera bientôt disponible...
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary mt-6"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}


