import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Briefcase,
  MapPin,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Filter,
  Search,
  Clock,
  TrendingUp,
  Award,
  Building2,
  Users,
  Zap,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { publicApi } from '../services/api';

const ExperiencePage = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    experience_type: 'all',
    is_featured: false,
    search: '',
  });
  const [filteredExperiences, setFilteredExperiences] = useState([]);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const response = await publicApi.getExperiences({
          page_size: 50
        });

        if (response.data) {
          const data = response.data.items || response.data;
          setExperiences(data);
          setFilteredExperiences(data);
        }
      } catch (err) {
        setError('Failed to load experiences');
        console.error('Error fetching experiences:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  useEffect(() => {
    let filtered = [...experiences];

    // Apply filters
    if (filters.experience_type !== 'all') {
      filtered = filtered.filter(exp => exp.experience_type === filters.experience_type);
    }

    if (filters.is_featured) {
      filtered = filtered.filter(exp => exp.is_featured === true);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(exp =>
        (exp.position && exp.position.toLowerCase().includes(searchTerm)) ||
        (exp.company && exp.company.toLowerCase().includes(searchTerm)) ||
        (exp.description && exp.description.toLowerCase().includes(searchTerm))
      );
    }

    setFilteredExperiences(filtered);
  }, [filters, experiences]);

  const experienceTypes = [
    { value: 'all', label: 'All Types', count: experiences.length },
    { value: 'full_time', label: 'Full-time', count: experiences.filter(e => e.experience_type === 'full_time').length },
    { value: 'contract', label: 'Contract', count: experiences.filter(e => e.experience_type === 'contract').length },
    { value: 'freelance', label: 'Freelance', count: experiences.filter(e => e.experience_type === 'freelance').length },
    { value: 'internship', label: 'Internship', count: experiences.filter(e => e.experience_type === 'internship').length },
  ];

  const getExperienceColor = (type) => {
    switch (type) {
      case 'full_time': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'contract': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      case 'freelance': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'internship': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading experiences...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-3">⚠️</div>
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-5">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }



  const DescriptionWithToggle = ({ description, maxHeight = 80 }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [needsExpansion, setNeedsExpansion] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
      if (contentRef.current) {
        // Check if content height exceeds max height
        const contentHeight = contentRef.current.scrollHeight;
        setNeedsExpansion(contentHeight > maxHeight);
      }
    }, [description, maxHeight]);

    const handleToggle = () => {
      setIsExpanded(!isExpanded);
    };

    return (
      <div className="mb-4">
        <div
          ref={contentRef}
          className={`text-gray-600 border-1 border-gray-300 shadow-lg lg:p-6 rounded-lg bg-gray-100 dark:bg-gray-800 mt-4 dark:text-gray-400 overflow-hidden transition-all duration-300 ${!isExpanded && needsExpansion ? 'max-h-50' : 'max-h-none'
            }`}
          style={{
            maxHeight: !isExpanded && needsExpansion ? `${maxHeight}px` : 'none'
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </div>

        {needsExpansion && (
          <button
            onClick={handleToggle}
            className="mt-2 text-sm font-medium text-purple-600 dark:text-purple-600 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            {isExpanded ? (
              <>
                <span className='cursor-pointer'>Show Less</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </>
            ) : (
              <>
                <span className='cursor-pointer'>Read More</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        )}
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 dark:border-blue-400/20"
          >
            <Briefcase className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Professional Journey
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Work Experience
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A detailed timeline of my professional journey, showcasing projects, achievements, and skills developed along the way.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{experiences.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Positions</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {experiences.filter(e => e.is_current).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Current Positions</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {experiences.filter(e => e.is_featured).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Featured</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {new Set(experiences.flatMap(e => e.technologies?.map(t => t.name) || [])).size}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Technologies Used</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filter Experiences</h3>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search positions or companies..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={() => setFilters({ experience_type: 'all', is_featured: false, search: '' })}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {experienceTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setFilters(prev => ({ ...prev, experience_type: type.value }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filters.experience_type === type.value
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  {type.label}
                  <span className="ml-2 px-2 py-0.5 text-xs bg-white/20 rounded-full">
                    {type.count}
                  </span>
                </button>
              ))}

              <button
                onClick={() => setFilters(prev => ({ ...prev, is_featured: !prev.is_featured }))}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${filters.is_featured
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                <Sparkles size={14} />
                Featured Only
              </button>
            </div>
          </div>
        </div>

        {/* Experience Cards */}
        <div className="grid grid-cols-1 gap-8">
          {filteredExperiences.length > 0 ? (
            filteredExperiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getExperienceColor(exp.experience_type)}`}>
                          {exp.experience_type.replace('_', ' ')}
                        </span>
                        {exp.is_featured && (
                          <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs rounded-full flex items-center gap-1">
                            <Sparkles size={10} />
                            Featured
                          </span>
                        )}
                        {exp.is_current && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs rounded-full">
                            Current
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {exp.position}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                        <Building2 size={14} />
                        <span>{exp.company}</span>
                        {exp.location && (
                          <>
                            <span className="text-gray-400">•</span>
                            <MapPin size={14} />
                            <span>{exp.location}</span>
                          </>
                        )}
                      </div>

                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="inline mr-1" size={12} />
                        {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                        {exp.duration && (
                          <span className="ml-2">({exp.duration})</span>
                        )}
                      </div>
                    </div>

                    {exp.company_logo && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img
                          src={exp.company_logo}
                          alt={exp.company}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {exp.description && (
                    <DescriptionWithToggle
                      description={exp.description}
                      maxHeight={120} // Adjust height as needed
                    />
                  )}

                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Key Responsibilities:</h4>
                      <ul className="space-y-1">
                        {exp.responsibilities.slice(0, 3).map((resp, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <ChevronRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Technologies:</h4>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.slice(0, 6).map((tech) => (
                          <span
                            key={tech.id}
                            className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
                          >
                            {tech.name}
                          </span>
                        ))}
                        {exp.technologies.length > 6 && (
                          <span className="px-2 py-1 text-xs text-gray-500">
                            +{exp.technologies.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {exp.skills_gained && exp.skills_gained.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <div className="flex flex-wrap gap-2">
                        {exp.skills_gained.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 text-yellow-800 dark:text-yellow-400 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-16">
              <Briefcase className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No experiences found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your filters or check back later.
              </p>
              <button
                onClick={() => setFilters({ experience_type: 'all', is_featured: false, search: '' })}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 border border-gray-300 dark:border-gray-700"
        >
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Want to see my skills in action?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Explore my projects to see how I've applied these experiences in real-world applications.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all font-medium"
              >
                <Layers className="w-4 h-4" />
                View Projects
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white px-6 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                <Users className="w-4 h-4" />
                Get in Touch
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExperiencePage;