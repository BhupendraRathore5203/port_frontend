import { useState, useEffect } from 'react';
import { publicApi } from '../services/api';

/**
 * Hook to fetch and manage ALL site settings
 */
export const useSiteSettings = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await publicApi.getAllSettings();
            setSettings(response.data);
            setError(null);

            // Apply theme to DOM
            if (response.data.theme) {
                applyThemeToDOM(response.data.theme);
            }


        } catch (err) {
            setError(err.message);
            console.error('Failed to fetch site settings:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return {
        settings, // This will be the full nested object
        loading,
        error,
        refetch: fetchSettings
    };
};

/**
 * Hook to fetch only theme settings
 */
export const useThemeSettings = () => {
    const [theme, setTheme] = useState({
        primary_color: '#3b82f6',
        secondary_color: '#8b5cf6',
        dark_mode: true
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTheme = async () => {
        try {
            setLoading(true);
            const response = await publicApi.getThemeSettings();
            const themeData = response.data;

            setTheme(themeData);
            applyThemeToDOM(themeData);
            setError(null);


            if (themeData.dark_mode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }



        } catch (err) {
            setError(err.message);
            console.error('Failed to fetch theme settings:', err);

            // Apply default theme if fetch fails
            applyThemeToDOM({
                primary_color: '#3b82f6',
                secondary_color: '#8b5cf6',
                dark_mode: true
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTheme();
    }, []);

    return {
        theme,
        loading,
        error,
        refetch: fetchTheme
    };
};

/**
 * Hook to fetch social links
 */
export const useSocialLinks = () => {
    const [links, setLinks] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLinks = async () => {
        try {
            setLoading(true);
            const response = await publicApi.getSocialLinks();
            setLinks(response.data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Failed to fetch social links:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLinks();
    }, []);

    return {
        links,
        loading,
        error,
        refetch: fetchLinks
    };
};

/**
 * Helper function to apply theme to DOM
 */
const applyThemeToDOM = (themeData) => {
    // Apply CSS variables
    const root = document.documentElement;

    if (themeData.primary_color) {
        root.style.setProperty('--primary-color', themeData.primary_color);
        root.style.setProperty('--primary-500', themeData.primary_color);

        // Generate darker shades (simplified)
        const primaryColor = themeData.primary_color;
        root.style.setProperty('--primary-600', adjustColorBrightness(primaryColor, -20));
        root.style.setProperty('--primary-700', adjustColorBrightness(primaryColor, -40));
        root.style.setProperty('--primary-800', adjustColorBrightness(primaryColor, -60));
    }

    if (themeData.secondary_color) {
        root.style.setProperty('--secondary-color', themeData.secondary_color);
    }

    // Apply dark mode class
    if (themeData.dark_mode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};

/**
 * Helper function to adjust color brightness
 */
const adjustColorBrightness = (color, percent) => {
    // Simple color adjustment function
    try {
        let R = parseInt(color.substring(1, 3), 16);
        let G = parseInt(color.substring(3, 5), 16);
        let B = parseInt(color.substring(5, 7), 16);

        R = Math.min(255, Math.max(0, R + (R * percent) / 100));
        G = Math.min(255, Math.max(0, G + (G * percent) / 100));
        B = Math.min(255, Math.max(0, B + (B * percent) / 100));

        const RR = Math.round(R).toString(16).padStart(2, '0');
        const GG = Math.round(G).toString(16).padStart(2, '0');
        const BB = Math.round(B).toString(16).padStart(2, '0');

        return `#${RR}${GG}${BB}`;
    } catch (error) {
        console.error('Error adjusting color:', error);
        return color;
    }
};