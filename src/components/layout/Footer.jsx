import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Twitter, Mail, Heart, Globe, Instagram } from 'lucide-react';
import { publicApi } from '../../services/api';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [siteSettings, setSiteSettings] = useState(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const response = await publicApi.getAllSettings();
        // console.log('Footer Settings:', response.data); // Debug log
        setSiteSettings(response.data);
      } catch (error) {
        console.error('Failed to fetch site settings:', error);
      }
    };

    fetchSiteSettings();
  }, []);

  const socialIcons = {
    github: <Github size={20} />,
    linkedin: <Linkedin size={20} />,
    twitter: <Twitter size={20} />,
    mail: <Mail size={20} />,
    globe: <Globe size={20} />,
    instagram: <Instagram size={20} />,
    facebook: <Globe size={20} />, // Facebook icon
    youtube: <Globe size={20} />, // YouTube icon
    discord: <Globe size={20} />, // Discord icon
  };

  const getSocialLinks = () => {
    if (!siteSettings?.social) return [];

    return Object.entries(siteSettings.social)
      .filter(([_, url]) => url && url.trim() !== '')
      .map(([platform, url]) => ({
        platform,
        url,
        icon: socialIcons[platform.toLowerCase()] || <Globe size={20} />
      }));
  };

  // Also get contact info from API
  const contactInfo = {
    email: siteSettings?.site?.contact_email || '',
    phone: siteSettings?.site?.contact_phone || '',
    location: siteSettings?.site?.location || ''
  };

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              {siteSettings?.site?.logo ? (
                <img
                  src={siteSettings.site.logo}
                  alt={siteSettings?.site?.name || 'Portfolio Logo'}
                  className="w-10 h-10 rounded-lg object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 dark:from-gray-500 dark:to-gray-700 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
              )}
              <span className="text-xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-300 dark:to-gray-400 bg-clip-text text-transparent">
                {siteSettings?.site?.name || 'DevPortfolio'}
              </span>
            </div>
            <div className="flex flex-col">
              <p className="text-gray-600 dark:text-gray-400">
                {siteSettings?.site?.tagline || 'Showcasing amazing projects across multiple technologies and frameworks.'}
              </p>
              {contactInfo.email && (
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="inline-block mt-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:underline"
                >
                  <Mail className="inline w-4 h-4 mr-1" />
                  {contactInfo.email}
                </a>
              )}
              {contactInfo.phone && (
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="inline-block mt-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:underline"
                >
                  <Mail className="inline w-4 h-4 mr-1" />
                  {contactInfo.phone}
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Quick Links</h3>
            <div className="flex space-x-20">
              <ul className="space-y-2">
                <li>
                  <Link
                    to={`/`}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/projects`}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors"
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/demos`}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors"
                  >
                    Live Demos
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/tech`}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors"
                  >
                    Technologies
                  </Link>
                </li>
              </ul>
              <div className="2">
                <ul className='space-y-2'>
                  <li>
                    <Link
                      to={`/experience`}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors"
                    >
                      Experience
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/education`}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors"
                    >
                      Education
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/contact`}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/about`}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors"
                    >
                      About
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Connect</h3>
            <div className="flex flex-wrap gap-3">
              {getSocialLinks().map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:-translate-y-1 text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                  aria-label={link.platform}
                  title={link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                >
                  {link.icon}
                </a>
              ))}
            </div>
            {siteSettings?.seo?.description && (
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                {siteSettings.seo.description.substring(0, 100)}...
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            All Rights Reserved <Heart className="inline w-4 h-4 text-red-500 animate-pulse" /> • © {currentYear} {siteSettings?.site?.name || 'DevPortfolio'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;