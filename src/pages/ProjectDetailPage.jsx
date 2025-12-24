import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  ExternalLink,
  Github,
  ArrowLeft,
  Tag,
  Globe,
  Code,
  Star,
  FileText,
  BookOpen,
  Zap,
  Clock,
  Cpu,
  Database,
  Layout,
  Server,
  Layers,
  Sparkles,
  TrendingUp,
  Shield,
  Users,
  Rocket
} from 'lucide-react';
import { publicApi } from '../services/api';
import TechStackBadge from '../components/TechStackBadgeProps';
import SafeDynamicSvgIcon from '../components/SafeDynamicSvgIcon';
import ProjectGallery from '../components/ProjectGallery';

const ProjectDetailPage = () => {
  const { projectSlug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        if (projectSlug) {
          const response = await publicApi.getProject(projectSlug);
          const data = response.data || response;
          setProject(data);
        }
      } catch (err) {
        setError('Failed to load project details');
        console.error('Error loading project:', err);
      } finally {
        setLoading(false);
      }
    };

    if (projectSlug) {
      loadProject();
    }
  }, [projectSlug]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getTechCategoryIcon = (category) => {
    switch(category?.toLowerCase()) {
      case 'backend':
        return <Server className="w-4 h-4" />;
      case 'frontend':
        return <Layout className="w-4 h-4" />;
      case 'database':
        return <Database className="w-4 h-4" />;
      case 'language':
        return <Code className="w-4 h-4" />;
      default:
        return <Cpu className="w-4 h-4" />;
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">Loading project details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="text-red-500 text-5xl mb-3">⚠️</div>
        <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Error</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">{error}</p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 rounded-lg hover:opacity-90 transition-all text-sm font-medium shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
      </div>
    </div>
  );

  if (!project) return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="text-gray-500 dark:text-gray-400 text-5xl mb-3">🔍</div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Project Not Found</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">The requested project doesn&apos;t exist.</p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 rounded-lg hover:opacity-90 transition-all text-sm font-medium shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Browse All Projects
        </Link>
      </div>
    </div>
  );

  // Calculate project duration
  const getProjectDuration = () => {
    if (project.start_date && project.completion_date) {
      try {
        const start = new Date(project.start_date);
        const end = new Date(project.completion_date);
        const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        return diffMonths > 0 ? `${diffMonths} month${diffMonths > 1 ? 's' : ''}` : 'Less than a month';
      } catch (error) {
        return 'N/A';
      }
    }
    return 'N/A';
  };

  // Categorize technologies
  const categorizedTech = project.technologies?.reduce((acc, tech) => {
    const category = tech.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tech);
    return acc;
  }, {}) || {};

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 pt-20 pb-12">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-size-10"></div>
        <div className="container mx-auto px-4 relative">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>

          <div className="max-w-4xl">
            {/* Project Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {project.category && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                  <Tag className="w-3 h-3" />
                  {project.category.name}
                </span>
              )}
              
              <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${
                project.status === 'completed'
                  ? 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-400'
                  : project.status === 'in-progress'
                  ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-400'
                  : 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-400'
              }`}>
                {project.status?.charAt(0).toUpperCase() + project.status?.slice(1)}
              </span>

              {/* {project.is_featured && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-xs font-medium">
                  <Star className="w-3 h-3" />
                  Featured
                </span>
              )} */}

              {/* <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                {project.is_public ? 'Public' : 'Private'}
              </span> */}
            </div>

            {/* Project Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent leading-tight">
              {project.title}
            </h1>

            {/* Project Description */}
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl">
              {project.short_description}
            </p>

            {/* Project Metadata */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Start Date: {formatDate(project.start_date)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Complition Date: {formatDate(project.completion_date)}</span>
              </div>

              {project.start_date && project.completion_date && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Duration: {getProjectDuration()}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-8">
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-lg hover:opacity-90 transition-all hover:scale-[1.02] font-medium shadow-lg"
                >
                  <Globe className="w-4 h-4" />
                  Live Demo
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white px-5 py-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium border border-gray-300 dark:border-gray-700"
                >
                  <Github className="w-4 h-4" />
                  View Source
                </a>
              )}
              
              {project.documentation_url && (
                <a
                  href={project.documentation_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white px-5 py-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium border border-gray-300 dark:border-gray-700"
                >
                  <FileText className="w-4 h-4" />
                  Documentation
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-xl"
            >
              {project.featured_image ? (
                <img
                  src={project.featured_image}
                  alt={project.title}
                  className="w-full h-auto max-h-[500px] object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center">
                  <Code className="w-16 h-16 text-gray-400 dark:text-gray-600" />
                </div>
              )}
            </motion.div>

            {/* Content Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-800">
              <nav className="flex space-x-8">
                {['overview', 'features', 'installation'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="space-y-8">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="dark:bg-gray-900 bg-gray-100 p-3 prose prose-lg dark:prose-invert max-w-none"
                >
                  {project.long_description ? (
                    <div dangerouslySetInnerHTML={{ __html: project.long_description }} />
                  ) : (
                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      <p>{project.short_description}</p>
                      <p className="mt-4">This project showcases expertise in modern web development practices and technologies.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Features Tab */}
              {activeTab === 'features' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {project.features && project.features.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {project.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                            <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="text-gray-800 dark:text-gray-200">{feature}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        No Features Listed
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Features information will be added soon.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Installation Tab */}
              {activeTab === 'installation' && project.installation_guide && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="dark:bg-gray-900 bg-gray-100 p-3 rounded-xl overflow-hidden"
                >
                  {/* <div className="bg-gray-800 px-6 py-3 border-b border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="ml-2 text-gray-400 text-sm">Terminal</span>
                    </div>
                  </div> */}
                  {/* <pre className="p-6 overflow-x-auto">
                    <code className="text-gray-300 font-mono text-sm whitespace-pre">
                      {project.installation_guide}
                    </code>
                  </pre> */}


                  <div dangerouslySetInnerHTML={{ __html: project.installation_guide }} />
                </motion.div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Technology Stack */}
            {categorizedTech && Object.keys(categorizedTech).length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-blue-500" />
                    Technology Stack
                  </h3>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
                    {(project.technologies?.length) || 0} technologies
                  </span>
                </div>

                <div className="space-y-6">
                  {Object.entries(categorizedTech).map(([category, techs]) => (
                    <div key={category} className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {getTechCategoryIcon(category)}
                        <span>{category}</span>
                      </div>
                      <div className="space-y-2">
                        {techs.map((tech) => (
                          <div key={tech.id} className="group">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
                              <div className="flex items-center gap-3">
                                {tech.icon && (
                                  <SafeDynamicSvgIcon
                                    svgString={tech.icon}
                                    className="w-5 h-5"
                                  />
                                )}
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {tech.name}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {tech.type}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${tech.color || 'bg-gradient-to-r from-blue-500 to-purple-500'} rounded-full`}
                                    style={{ width: `${tech.proficiency || 0}%` }}
                                  />
                                </div>
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-8 text-right">
                                  {tech.proficiency || 0}%
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Project Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-500" />
                Project Details
              </h3>
              
              <div className="space-y-4">
                {project.category && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Category</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {project.category.name}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                  <span className={`text-sm font-medium capitalize px-2.5 py-1 rounded-full ${
                    project.status === 'completed'
                      ? 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-400'
                      : project.status === 'in-progress'
                      ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-400'
                      : 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-400'
                  }`}>
                    {project.status}
                  </span>
                </div>

                {project.start_date && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Start Date</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatDate(project.start_date)}
                    </span>
                  </div>
                )}

                {project.completion_date && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Completion Date</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatDate(project.completion_date)}
                    </span>
                  </div>
                )}

                {project.start_date && project.completion_date && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Duration</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {getProjectDuration()}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(project.updated_at)}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Project Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 dark:from-blue-600/20 dark:to-purple-600/20 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Project Stats
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 text-center backdrop-blur-sm">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {project.technologies?.length || 0}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Technologies</div>
                </div>
                
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 text-center backdrop-blur-sm">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                    {(project.images?.length || 0) + (project.featured_image ? 1 : 0)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Screenshots</div>
                </div>
                
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 text-center backdrop-blur-sm">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400 mb-1">
                    {project.status === 'completed' ? '✓' : '⏳'}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Status</div>
                </div>
                
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 text-center backdrop-blur-sm">
                  <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                    {project.is_featured ? '⭐' : '★'}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Featured</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Project Gallery */}
        {(project.featured_image || project.images?.length > 0) && (
          <section className="pt-8">
            <ProjectGallery
              images={project.images || []}
              projectTitle={project.title}
              featuredImage={project.featured_image}
            />
          </section>
        )}
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 p-8 border border-gray-300 dark:border-gray-700"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-32 translate-x-32"></div>
          
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Interested in this project?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Want to learn more about the implementation details, discuss similar projects, or collaborate on something amazing?
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all hover:scale-[1.02] font-medium shadow-lg"
              >
                <Users className="w-4 h-4" />
                Get in Touch
              </Link>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white px-6 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium border border-gray-300 dark:border-gray-700"
              >
                <Rocket className="w-4 h-4" />
                Explore More Projects
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;