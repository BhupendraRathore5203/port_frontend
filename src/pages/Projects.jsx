import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Github, 
  Eye, 
  Code, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { publicApi } from '../services/api';
import { Link } from 'react-router-dom';

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTechnology, setSelectedTechnology] = useState('all');
  const [expandedProject, setExpandedProject] = useState(null);
  const [technologies, setTechnologies] = useState([]);
  const [projectsData, setProjectsData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const techScrollRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [techResponse, projectsResponse] = await Promise.all([
          publicApi.getTechnologies(),
          publicApi.getProjects()
        ]);
        
        // Handle technologies response
        const techData = Array.isArray(techResponse.data) ? techResponse.data : 
                       Array.isArray(techResponse) ? techResponse : [];
        setTechnologies(techData);
        
        // Handle projects response - it returns { items: [], total: X }
        const projectsRes = projectsResponse.data || projectsResponse;
        setProjectsData({
          items: Array.isArray(projectsRes.items) ? projectsRes.items : [],
          total: projectsRes.total || 0
        });
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setTechnologies([]);
        setProjectsData({ items: [], total: 0 });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const scrollTech = (direction) => {
    if (techScrollRef.current) {
      const scrollAmount = 200;
      const newPosition = direction === 'right' 
        ? scrollPosition + scrollAmount
        : scrollPosition - scrollAmount;
      
      techScrollRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return '';
    }
  };

  // Filter projects based on search and selected technology
  const filteredProjects = Array.isArray(projectsData.items) ? projectsData.items.filter(project => {
    if (!project) return false;
    
    // Search filter
    const matchesSearch = searchTerm === '' ||
      (project.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (project.short_description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (Array.isArray(project.tags) && project.tags.some(tag => 
        tag?.toLowerCase().includes(searchTerm.toLowerCase())
      ));

    // Technology filter
    const matchesTechnology = selectedTechnology === 'all' ||
      (Array.isArray(project.technologies) && project.technologies.some(tech => 
        tech?.name?.toLowerCase() === selectedTechnology.toLowerCase()
      ));

    return matchesSearch && matchesTechnology;
  }) : [];

  // Get project languages/technologies for display
  const getProjectLanguages = (project) => {
    if (!project || !Array.isArray(project.technologies)) return [];
    return project.technologies.slice(0, 3).map(tech => tech.name || '').filter(Boolean);
  };

  // Get count of projects by technology
  const getTechProjectCount = (techName) => {
    if (!Array.isArray(projectsData.items)) return 0;
    return projectsData.items.filter(p => 
      Array.isArray(p.technologies) && 
      p.technologies.some(t => t?.name?.toLowerCase() === techName.toLowerCase())
    ).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-500/20 dark:border-blue-400/20"
          >
            <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Projects I had worked on.
            </span>
          </motion.div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl dark:text-gray-100 font-bold mb-4">
            Project <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Portfolio</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore my collection of projects built with modern technologies and best practices
          </p>
        </div>

        {/* Filters Section */}
        <div className="mb-10 space-y-6">
          {/* Search Bar */}
          <div className="max-w-lg mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search projects by title, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent shadow-sm transition-all duration-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Technology Filters with Scroll */}
          <div className="relative">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Filter by Technology
              </h3>
              <button
                onClick={() => setSelectedTechnology('all')}
                className={`text-xs px-3 py-1 rounded-full transition-all ${
                  selectedTechnology === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Clear Filter
              </button>
            </div>

            {/* Scrollable Technology Container */}
            <div className="relative">
              {/* Left Scroll Button */}
              {scrollPosition > 0 && (
                <button
                  onClick={() => scrollTech('left')}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gradient-to-r from-white dark:from-gray-900 to-transparent pl-2 pr-4 py-4"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              )}

              {/* Technology Scroll Container */}
              <div 
                ref={techScrollRef}
                className="flex space-x-2 overflow-x-auto scrollbar-hide py-2 px-1"
                style={{ scrollBehavior: 'smooth' }}
                onScroll={(e) => setScrollPosition(e.target.scrollLeft)}
              >
                {/* All Technologies Button */}
                <button
                  onClick={() => setSelectedTechnology('all')}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    selectedTechnology === 'all'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></span>
                    <span>All Projects</span>
                    <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full ml-1">
                      {projectsData.total}
                    </span>
                  </span>
                </button>

                {/* Individual Technology Buttons */}
                {technologies.slice(0, 20).map((tech) => (
                  <button
                    key={tech.id}
                    onClick={() => setSelectedTechnology(tech.name.toLowerCase())}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                      selectedTechnology === tech.name.toLowerCase()
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      {tech.icon && (
                        <div className="w-4 h-4 flex items-center justify-center">
                          <div dangerouslySetInnerHTML={{ __html: tech.icon }} className="w-4 h-4" />
                        </div>
                      )}
                      <span>{tech.name}</span>
                      <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full ml-1">
                        {getTechProjectCount(tech.name)}
                      </span>
                    </span>
                  </button>
                ))}
              </div>

              {/* Right Scroll Button */}
              {techScrollRef.current && 
                scrollPosition < techScrollRef.current.scrollWidth - techScrollRef.current.clientWidth && (
                <button
                  onClick={() => scrollTech('right')}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pl-4 pr-2 py-4"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{projectsData.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Projects</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {projectsData.items.filter(p => p.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {new Set(projectsData.items.flatMap(p => p.technologies?.map(t => t.name) || [])).size}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Technologies Used</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {filteredProjects.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Showing</div>
            </div>
          </div> */}
        </div>

        {/* Projects Grid */}
        <AnimatePresence>
          {filteredProjects.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                >
                  {/* Project Image/Header */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                    {project.featured_image ? (
                      <img
                        src={project.featured_image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Code className="w-16 h-16 text-gray-400 dark:text-gray-600" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    {project.status && (
                      <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
                        project.status === 'completed' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-yellow-500 text-gray-800'
                      }`}>
                        {project.status}
                      </div>
                    )}
                    
                    {/* Featured Badge */}
                    {project.is_featured && (
                      <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-xs font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Featured
                      </div>
                    )}
                    
                    {/* Technology Badges */}
                    <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
                      {getProjectLanguages(project).map((lang, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs font-medium bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-md text-gray-800 dark:text-gray-200"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">
                        {project.title}
                      </h3>
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        {formatDate(project.start_date)}
                      </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {project.short_description || 'No description available'}
                    </p>

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="px-2 py-1 text-xs text-gray-500">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Expand Button */}
                    {project.long_description && (
                      <button
                        onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                        className="flex items-center text-blue-600 dark:text-blue-400 mb-4 hover:underline"
                      >
                        <ChevronDown
                          className={`transition-transform duration-200 ${expandedProject === project.id ? 'rotate-180' : ''}`}
                          size={16}
                        />
                        <span className="ml-2 text-sm font-medium">
                          {expandedProject === project.id ? 'Show less' : 'Read more'}
                        </span>
                      </button>
                    )}

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {expandedProject === project.id && project.long_description && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          {/* <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                            {project.long_description}
                          </p> */}
                          
                          {project.technologies && project.technologies.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Technologies:</h4>
                              <div className="flex flex-wrap gap-2">
                                {project.technologies.map((tech, index) => (
                                  <span
                                    key={index}
                                    className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
                                  >
                                    {tech.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Link
                        to={`/projects/${project.slug}`}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all font-medium text-sm"
                      >
                        <Eye size={16} />
                        View Details
                      </Link>
                      
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-medium text-sm"
                        >
                          <Github size={16} />
                          Code
                        </a>
                      )}
                      
                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-medium text-sm"
                        >
                          <ExternalLink size={16} />
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
            >
              <Filter className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">No projects found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTechnology('all');
                }}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all"
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Note */}
        {/* {filteredProjects.length > 0 && (
          <div className="mt-12 text-center text-gray-600 dark:text-gray-400 text-sm">
            <p>
              Showing {filteredProjects.length} of {projectsData.total} projects • 
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="ml-2 text-blue-600 dark:text-blue-400 hover:underline"
              >
                Back to top
              </button>
            </p>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Projects;