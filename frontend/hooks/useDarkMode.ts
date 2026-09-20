// hooks/useDarkMode.ts - Hook centralizado para el modo oscuro/claro
'use client';
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'theme-override';

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detección inicial: preferencia guardada > preferencia del sistema.
  // Se lee en el efecto (no en useState) para evitar desajuste de hidratación
  // SSR, ya que localStorage/matchMedia no existen en el servidor.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDarkMode(darkModeMediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        if (!localStorage.getItem(STORAGE_KEY)) {
          setIsDarkMode(e.matches);
        }
      };

      darkModeMediaQuery.addEventListener('change', handleChange);
      return () => darkModeMediaQuery.removeEventListener('change', handleChange);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Aplicación: clase explícita 'dark' o 'light' en <html>.
  // La clase 'light' es necesaria para poder anular la preferencia del
  // sistema operativo cuando el usuario fuerza modo claro manualmente
  // (ver :root:not(.light) en globals.css).
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem(STORAGE_KEY, newMode ? 'dark' : 'light');
  };

  return { isDarkMode, toggleDarkMode };
}
