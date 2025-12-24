import React, { createContext, useContext, useState, useEffect } from 'react';
import { publicApi } from '../services/api';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    darkMode: false
  });

  useEffect(() => {
    const applyTheme = async () => {
      try {
        const response = await publicApi.getThemeSettings();
        const themeData = response.data;
        
        if (themeData) {
          setTheme({
            primaryColor: themeData.primary_color,
            secondaryColor: themeData.secondary_color,
            darkMode: themeData.dark_mode
          });

          // Apply CSS variables
          const root = document.documentElement;
          root.style.setProperty('--primary-500', themeData.primary_color);
          root.style.setProperty('--primary-600', adjustColor(themeData.primary_color, -20));
          root.style.setProperty('--primary-700', adjustColor(themeData.primary_color, -40));
          
          // Apply dark mode class
        //   if (themeData.dark_mode) {
        //     document.documentElement.classList.add('dark');
        //   } else {
        //     document.documentElement.classList.remove('dark');
        //   }
        }
      } catch (error) {
        console.error('Failed to fetch theme:', error);
      }
    };

    applyTheme();
  }, []);

  // Helper function to adjust color brightness
  const adjustColor = (color, amount) => {
    // Simple color adjustment - you might want to use a library like chroma.js
    return color; // Simplified for now
  };

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    // Apply changes to document
    const root = document.documentElement;
    root.style.setProperty('--primary-500', newTheme.primaryColor);
    // ... other color updates
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};