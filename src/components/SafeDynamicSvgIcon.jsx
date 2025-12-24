import DOMPurify from 'dompurify'; // or similar library

const SafeDynamicSvgIcon = ({ svgString, className = "" }) => {
    const cleanSVG = DOMPurify.sanitize(svgString, {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ['use'], // Allow <use> tags if needed
    ADD_ATTR: ['href', 'xlink:href'] // Allow href attributes
  });

    return (
        // <div 
        //   className={className}
        //   dangerouslySetInnerHTML={{ __html: cleanSVG }}
        // />

        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: cleanSVG }}
        />
    );
};

export default SafeDynamicSvgIcon;