import React, { useState, useEffect } from 'react';
import logo from '../assets/splash_screen.png'; // Assurez-vous que le chemin est correct

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onFinish();
    }, 4500); // 4.5 secondes

    return () => clearTimeout(timer);
  }, [onFinish]);

  return isVisible ? (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#1E293B', // Couleur de fond correspondant à l'image
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        transition: 'opacity 1s ease-out',
        opacity: isVisible ? 1 : 0,
      }}
    >
      <img
        src={logo}
        alt="Dictionnaire Nzebi-Français"
        style={{
          maxWidth: '80%',
          maxHeight: '80%',
          objectFit: 'contain',
        }}
      />
    </div>
  ) : null;
};

export default SplashScreen; 