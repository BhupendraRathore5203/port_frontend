// components/SiteMetadata.jsx
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const SiteMetadata = ({ siteSettings }) => {
  useEffect(() => {
    // Update favicon dynamically if available
    if (siteSettings?.favicon) {
      let favicon = document.querySelector('link[rel="icon"]');
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }
      favicon.href = siteSettings.favicon;
    }
    
    // Also update document title for immediate effect
    if (siteSettings?.site_name) {
      document.title = siteSettings.site_name;
    }
  }, [siteSettings]);

  // Create title string
  const title = siteSettings?.site_name 
    ? `${siteSettings.site_name}${siteSettings?.site_tagline ? ` | ${siteSettings.site_tagline}` : ''}`
    : 'Portfolio';

  // Create description string
  const description = siteSettings?.self_long_description || 'Developer Portfolio';

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      
      {siteSettings?.favicon && (
        <link rel="icon" href={siteSettings.favicon} />
      )}
    </Helmet>
  );
};

export default SiteMetadata;