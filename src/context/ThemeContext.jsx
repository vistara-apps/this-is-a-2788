import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { websiteFunctions } from '../lib/db';

// Create the theme context
const ThemeContext = createContext();

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState({
    layout: '3col',
    primaryColor: '#667eea',
    accentColor: '#764ba2',
    backgroundColor: '#f8fafc'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load theme from database when user changes
  useEffect(() => {
    const loadTheme = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await websiteFunctions.getWebsiteSettings(user.id);
        
        if (error) throw error;
        
        if (data && data.theme) {
          setTheme(data.theme);
        }
      } catch (err) {
        console.error('Error loading theme:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, [user]);

  // Update theme in database
  const updateTheme = async (newTheme) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      // Update local state immediately for better UX
      setTheme(newTheme);
      
      // Update in database
      const { error } = await websiteFunctions.updateWebsiteSettings(user.id, {
        theme: newTheme
      });
      
      if (error) throw error;
      
      return { success: true };
    } catch (err) {
      console.error('Error updating theme:', err);
      setError(err.message);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    theme,
    updateTheme,
    loading,
    error,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;

