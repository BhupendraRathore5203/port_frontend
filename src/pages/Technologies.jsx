import React, { useState, useEffect, useMemo } from 'react';
import { 
  Code2, Zap, Database, Cpu, Server, Terminal, 
  Globe, Layout, Sparkles, Filter, TrendingUp, 
  Grid, List, ChevronRight, Star, ExternalLink,
  Layers, Puzzle, Cloud, Brain, Search, X,
  BarChart3, Award, Clock, FolderGit2,
  Rocket, Code, Shield, Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { publicApi } from '../services/api';

// Utility component for safe SVG rendering
const SafeDynamicSvgIcon = ({ svgString, className }) => {
  if (!svgString) {
    return <div className={`${className} bg-gray-200 dark:bg-gray-700 rounded-lg`}></div>;
  }

  try {
    // Extract SVG content safely
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const svg = doc.documentElement;
    
    // Add classes to the SVG
    svg.setAttribute('class', className || 'w-12 h-12');
    
    // Create a container div and set innerHTML with the SVG
    return (
      <div 
        className="flex items-center justify-center"
        dangerouslySetInnerHTML={{ __html: svg.outerHTML }}
      />
    );
  } catch (error) {
    console.error('Error parsing SVG:', error);
    return <div className={`${className} bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center`}>
      <Code2 className="w-6 h-6 text-gray-400" />
    </div>;
  }
};

const Technologies = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState();
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    featured: 0,
    averageProficiency: 0
  });

  // Categories with counts (will be calculated from data)
  const [categories, setCategories] = useState([
    { id: 'all', name: 'All', icon: <Cpu />, color: 'from-purple-500 to-pink-500' },
    { id: 'Frontend', name: 'Frontend', icon: <Layout />, color: 'from-blue-500 to-cyan-500' },
    { id: 'Backend', name: 'Backend', icon: <Server />, color: 'from-green-500 to-emerald-500' },
    { id: 'Database', name: 'Database', icon: <Database />, color: 'from-orange-500 to-amber-500' },
    { id: 'DevOps', name: 'DevOps', icon: <Terminal />, color: 'from-indigo-500 to-blue-500' },
    { id: 'Cloud', name: 'Cloud', icon: <Cloud />, color: 'from-yellow-500 to-orange-500' },
    { id: 'ML/AI', name: 'ML/AI', icon: <Brain />, color: 'from-red-500 to-pink-500' },
    { id: 'Tool', name: 'Tools', icon: <Puzzle />, color: 'from-teal-500 to-green-500' },
  ]);

  // Fetch technologies from API
  useEffect(() => {
    fetchTechnologies();
  }, []);

  const fetchTechnologies = async () => {
    try {
      setLoading(true);
      const response = await publicApi.getTechnologies({
        search: searchQuery,
        featured: null, // Get all
        category: activeCategory === 'all' ? null : activeCategory
      });
      
      const techData = response.data || [];
      setTechnologies(techData);
      
      // Calculate statistics
      const featured = techData.filter(t => t.is_featured).length;
      const avgProficiency = techData.length > 0 
        ? Math.round(techData.reduce((acc, t) => acc + t.proficiency, 0) / techData.length)
        : 0;
      
      setStats({
        total: techData.length,
        featured,
        averageProficiency: avgProficiency
      });

      // Update category counts
      const updatedCategories = categories.map(cat => ({
        ...cat,
        count: cat.id === 'all' 
          ? techData.length 
          : techData.filter(t => t.category === cat.id).length
      }));
      setCategories(updatedCategories);

      setError(null);
    } catch (err) {
      console.error('Error fetching technologies:', err);
      setError('Failed to load technologies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort technologies
  const filteredTech = useMemo(() => {
    let filtered = [...technologies];
    
    // Filter by active category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(tech => tech.category === activeCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(tech => 
        tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.type?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort by selected criteria
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'proficiency':
          return b.proficiency - a.proficiency;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'featured':
          return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        default:
          return b.order - a.order;
      }
    });
    
    return filtered;
  }, [technologies, activeCategory, searchQuery, sortBy]);

  // Get proficiency level text
  const getProficiencyLevel = (percentage) => {
    if (percentage >= 90) return { text: 'Expert', color: 'text-green-500' };
    if (percentage >= 75) return { text: 'Advanced', color: 'text-blue-500' };
    if (percentage >= 60) return { text: 'Intermediate', color: 'text-yellow-500' };
    return { text: 'Beginner', color: 'text-gray-500' };
  };

  // Get proficiency bar width
  const getProficiencyWidth = (percentage) => {
    return `${percentage}%`;
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchTechnologies();
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    fetchTechnologies();
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4">
        {/* Hero Header with Animated Background */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl mb-12 bg-gradient-to-br from-primary-500 via-purple-600 to-pink-500 p-8 md:p-12"
        >
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center space-x-2 mb-6 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
              <Sparkles size={16} />
              <span className="text-sm font-medium text-white">Tech Stack Mastery</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              Technology <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-300">Expertise</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Comprehensive collection of programming languages, frameworks, and tools I've mastered
            </p>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl shadow-lg text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Technologies</p>
                <h3 className="text-3xl font-bold mt-2">{stats.total}</h3>
              </div>
              <Layers className="w-10 h-10 opacity-80" />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="card bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl shadow-lg text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Average Proficiency</p>
                <h3 className="text-3xl font-bold mt-2">{stats.averageProficiency}%</h3>
              </div>
              <TrendingUp className="w-10 h-10 opacity-80" />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="card bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Featured Tech</p>
                <h3 className="text-3xl font-bold mt-2">{stats.featured}</h3>
              </div>
              <Star className="w-10 h-10 opacity-80" />
            </div>
          </motion.div>
        </div>

        {/* Search and Filters Bar */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search technologies, frameworks, tools..."
                  className="w-full pl-10 pr-10 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </form>

            {/* View Mode and Sort */}
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-gray-700 shadow-sm' 
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white dark:bg-gray-700 shadow-sm' 
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="proficiency">Sort by Proficiency</option>
                <option value="name">Sort by Name</option>
                <option value="featured">Sort by Featured</option>
                <option value="newest">Sort by Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filters with Counts */}
        <div className="overflow-x-auto mb-8 pb-2">
          <div className="flex space-x-3 min-w-max">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all flex-shrink-0 ${
                  activeCategory === category.id
                    ? `text-white shadow-lg bg-gradient-to-r ${category.color}`
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category.icon}
                <span className="font-medium">{category.name}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activeCategory === category.id 
                    ? 'bg-white/20' 
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  {category.count || 0}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
                    <div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                  </div>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="card text-center py-12">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Failed to Load Data</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={fetchTechnologies}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Technology Grid/List View */}
        <AnimatePresence mode="wait">
          {!loading && !error && (
            <motion.div
              key={viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={viewMode === 'grid' 
                ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-6"
              }
            >
              {filteredTech.map((tech, index) => (
                <motion.div
                  key={tech.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`card group hover:shadow-xl shadow-md p-3 rounded-lg transition-all duration-300 ${
                    viewMode === 'list' ? 'flex items-start gap-4' : ''
                  }`}
                >
                  {/* Tech Header */}
                  <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`relative ${viewMode === 'list' ? 'w-16 h-16' : 'w-12 h-12'} rounded-xl bg-gradient-to-br ${tech.color || 'from-gray-500 to-gray-700'} flex items-center justify-center`}>
                          <SafeDynamicSvgIcon 
                            svgString={tech.icon} 
                            className={viewMode === 'list' ? 'w-10 h-10' : 'w-8 h-8'} 
                          />
                          {tech.is_featured && (
                            <div className="absolute -top-2 -right-2">
                              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold">{tech.name}</h3>
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 capitalize">
                              {tech.type}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex items-center">
                              {[1,2,3,4,5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`w-3 h-3 ${
                                    star <= Math.ceil(tech.proficiency / 20)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'fill-gray-300 text-gray-300 dark:fill-gray-700 dark:text-gray-700'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className={`text-sm font-medium ${getProficiencyLevel(tech.proficiency).color}`}>
                              {getProficiencyLevel(tech.proficiency).text}
                            </span>
                          </div>
                        </div>
                      </div>
                      {viewMode === 'grid' && (
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{tech.proficiency}%</div>
                          <div className="text-xs text-gray-500">Proficiency</div>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-wrap">
                      {tech.description}
                    </p>

                    {/* Category Badge */}
                    <div className="mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        <FolderGit2 className="w-3 h-3 mr-1" />
                        {tech.category}
                      </span>
                    </div>

                    {/* Proficiency Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Skill Level</span>
                        <span className="font-medium">{tech.proficiency}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: getProficiencyWidth(tech.proficiency) }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className={`h-full rounded-full bg-gradient-to-r ${tech.color}`}
                        />
                      </div>
                    </div>

                    {/* Links */}
                    {(tech.website_url || tech.documentation_url) && (
                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        {tech.website_url && (
                          <a
                            href={tech.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                          >
                            <Globe className="w-4 h-4" />
                            Website
                          </a>
                        )}
                        {tech.documentation_url && (
                          <a
                            href={tech.documentation_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:underline"
                          >
                            <Code className="w-4 h-4" />
                            Docs
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* List View Additional Info */}
                  {viewMode === 'list' && (
                    <div className="text-right min-w-[100px]">
                      <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">{tech.proficiency}%</div>
                      <div className="text-xs text-gray-500">Proficiency</div>
                      <div className="mt-4 text-sm text-gray-500">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Added {new Date(tech.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Results */}
        {!loading && !error && filteredTech.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card text-center py-16"
          >
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Technologies Found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}

        {/* Tech Stack Visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Tech Stack Distribution</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Visual breakdown of technologies across categories
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.filter(c => c.id !== 'all').map((category) => {
              const count = technologies.filter(t => t.category === category.id).length;
              const percentage = technologies.length > 0 ? (count / technologies.length) * 100 : 0;
              
              return (
                <div key={category.id} className="card text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                    {category.icon}
                  </div>
                  <h4 className="font-semibold">{category.name}</h4>
                  <p className="text-2xl font-bold mt-1">{count}</p>
                  <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${category.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% of stack</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Technologies;
