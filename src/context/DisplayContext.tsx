import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type DisplayMode = 'nzebi-first' | 'french-first';

interface DisplayContextType {
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
}

const DisplayContext = createContext<DisplayContextType | undefined>(undefined);

export const DisplayProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [displayMode, setDisplayModeState] = useState<DisplayMode>('nzebi-first');

  // Load from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('displayMode') as DisplayMode;
    if (savedMode === 'nzebi-first' || savedMode === 'french-first') {
      setDisplayModeState(savedMode);
    }
  }, []);

  const setDisplayMode = (mode: DisplayMode) => {
    setDisplayModeState(mode);
    localStorage.setItem('displayMode', mode);
  };

  return (
    <DisplayContext.Provider value={{ displayMode, setDisplayMode }}>
      {children}
    </DisplayContext.Provider>
  );
};

export const useDisplayMode = () => {
  const context = useContext(DisplayContext);
  if (context === undefined) {
    throw new Error('useDisplayMode must be used within DisplayProvider');
  }
  return context;
};
