// Navbar.jsx (Updated with clarification)
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Terminal, Code2, Globe, Cpu, PhoneIcon } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings'; // Removed unused import
import { Helmet } from 'react-helmet-async';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const { settings, loading } = useSiteSettings();

    const navItems = [
        { name: 'Home', path: '/', icon: <Terminal size={18} /> },
        { name: 'Projects', path: '/projects', icon: <Code2 size={18} /> },
        { name: 'Live Demos', path: '/demos', icon: <Globe size={18} /> },
        { name: 'Technologies', path: '/tech', icon: <Cpu size={18} /> },
        { name: 'Contact', path: '/contact', icon: <PhoneIcon size={18} /> },
    ];
    

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (loading) {
        return (
            <nav className="fixed top-0 w-full z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="animate-pulse">
                            <div className="w-10 h-10 bg-gray-300 rounded-xl"></div>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg' : 'lg:bg-transparent bg-white/95 dark:bg-transparent/95'}`}>
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2 group">
                            {settings?.site?.logo ? (
                                <div style={{ background: settings?.theme?.primary_color }} className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                                    <img className='rounded-xl' src={settings?.site?.logo} alt={`${settings?.site?.name}`} />
                                </div>
                            ) : (
                                <div style={{ background: settings?.theme?.primary_color }} className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                                    <Terminal className="text-white" size={24} />
                                </div>
                            )}
                            <div>
                                <h1 style={{
                                    background: `linear-gradient(45deg, ${settings?.theme?.primary_color}, ${settings?.theme?.secondary_color})`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }} className="text-xl font-bold">
                                    {settings?.site?.name ? settings?.site?.name : 'Bhupendra'}
                                </h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Python, Web Developer</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${location.pathname === item.path
                                        ? 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-500'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    {item.icon}
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {isOpen && (
                        <div className="lg:hidden mt-4 py-4 border-t border-gray-200 dark:border-gray-800">
                            <div className="flex flex-col space-y-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${location.pathname === item.path
                                            ? 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                            }`}
                                    >
                                        {item.icon}
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </nav>
    );
};

export default Navbar;