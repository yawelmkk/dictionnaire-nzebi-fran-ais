import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, ArrowLeftRight, Info, Mail, MessageCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onSettingsClick: () => void;
  onAboutClick: () => void;
  onContactClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onSettingsClick,
  onAboutClick,
  onContactClick,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between py-3">
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-3 group"
      >
        <div>
          <h1 className="font-serif text-[26px] font-bold italic text-nzebi-accent tracking-tight leading-none">
            Nzébi
          </h1>
          <p className="text-[11px] uppercase tracking-widest text-nzebi-text-dark-secondary mt-1">
            Dictionnaire
          </p>
        </div>
      </button>

      <div className="flex items-center space-x-2">
        <button
          onClick={onSettingsClick}
          className="w-10 h-10 rounded-full bg-nzebi-surface-dark text-nzebi-accent
                     flex items-center justify-center active:scale-90 transition-transform duration-150"
          aria-label="Changer le mode d'affichage"
        >
          <ArrowLeftRight size={18} />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="w-10 h-10 rounded-full bg-nzebi-surface-dark text-nzebi-accent
                         flex items-center justify-center active:scale-90 transition-transform duration-150"
              aria-label="Menu"
            >
              <MoreVertical size={18} />
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