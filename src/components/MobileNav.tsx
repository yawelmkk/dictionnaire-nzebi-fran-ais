
import React from 'react';
import { Book, Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="flex justify-around items-center h-16">
        <button
          onClick={() => navigate('/')}
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive('/') ? 'text-green-700' : 'text-gray-500'
          }`}
        >
          <Search size={24} />
          <span className="text-xs mt-1">Recherche</span>
        </button>
        
        <button
          onClick={() => navigate('/categories')}
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive('/categories') ? 'text-green-700' : 'text-gray-500'
          }`}
        >
          <Book size={24} />
          <span className="text-xs mt-1">Catégories</span>
        </button>
      </div>
    </nav>
  );
}
