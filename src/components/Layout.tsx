
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
import { MoreVertical, Settings, User, Plus, BookOpen } from 'lucide-react';
import AddWordDialog from '@/components/AddWordDialog';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [settingsClickCount, setSettingsClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  
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
    
    // After 10 clicks, redirect to add word page
    if (newCount >= 10) {
      navigate('/ajouter');
      setSettingsClickCount(0); // Reset counter after redirect
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-slate-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold italic">Nzébi</h1>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-full bg-slate-600 hover:bg-slate-500 transition-colors">
                <MoreVertical className="text-white" size={24} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white">
              <DropdownMenuItem 
                className="cursor-pointer flex items-center" 
                onClick={() => navigate('/admin')}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Admin</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer flex items-center"
                onClick={() => navigate('/categories')}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Catégories</span>
              </DropdownMenuItem>
              <AddWordDialog
                trigger={
                  <DropdownMenuItem 
                    className="cursor-pointer flex items-center"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Ajouter un mot</span>
                  </DropdownMenuItem>
                }
              />
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer flex items-center"
                onClick={handleSettingsClick}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <TabsNavigation />
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      
      <MobileNav />
    </div>
  );
};

export default Layout;
