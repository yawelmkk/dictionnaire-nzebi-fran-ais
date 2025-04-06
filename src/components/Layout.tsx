
import React, { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileNav } from './MobileNav';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Nzébi-Français</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      
      <MobileNav />
    </div>
  );
};

export default Layout;
