import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, MoreVertical, ArrowLeftRight, Info, Mail, MessageCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onSettingsClick: () => void;
  onAboutClick: () => void;
  onContactClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleDarkMode,
  onSettingsClick,
  onAboutClick,
  onContactClick,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between py-4">
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

      <div className="flex items-center space-x-2">
        <button
          onClick={onToggleDarkMode}
          className="p-2.5 rounded-xl bg-nzebi-surface dark:bg-nzebi-surface-dark 
                   text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary
                   hover:bg-nzebi-primary/10 dark:hover:bg-nzebi-accent/20
                   hover:text-nzebi-primary dark:hover:text-nzebi-accent
                   transition-all duration-300"
          aria-label={isDarkMode ? "Mode clair" : "Mode sombre"}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button
          onClick={onSettingsClick}
          className="p-2.5 rounded-xl bg-nzebi-surface dark:bg-nzebi-surface-dark 
                   text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary
                   hover:bg-nzebi-primary/10 dark:hover:bg-nzebi-accent/20
                   hover:text-nzebi-primary dark:hover:text-nzebi-accent
                   transition-all duration-300"
          aria-label="Changer le mode d'affichage"
        >
          <ArrowLeftRight size={20} />
        </button>

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
            <DropdownMenuItem onClick={onAboutClick}>
              <Info className="mr-2 h-4 w-4" />
              <span>À propos</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onContactClick}>
              <Mail className="mr-2 h-4 w-4" />
              <span>Contactez-nous par mail</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.open('https://wa.me/241076208199', '_blank')}>
              <MessageCircle className="mr-2 h-4 w-4" />
              <span>Contactez-nous par WhatsApp</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;