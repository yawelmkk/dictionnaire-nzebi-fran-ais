import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function MobileNav() {
  // We keep the component in place for future use, but it won't display any navigation items
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="flex justify-around items-center h-16">
        {/* Mobile navigation items have been removed as requested */}
      </div>
    </nav>
  );
}
