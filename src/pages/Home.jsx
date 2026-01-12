import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Code2, Zap, Globe, Cpu, Sparkles, 
  Briefcase, GraduationCap, User, ChevronRight, 
  Award, MapPin, Calendar, ExternalLink 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { publicApi } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import SafeDynamicSvgIcon from '../components/SafeDynamicSvgIcon';

const Home = () => {
  const [typedText, setTypedText] = useState('');
  const [texts, setTexts] = useState(['Python Developer', 'React Specialist', 'Java Expert', 'Full Stack Wizard']);
  const [typingConfig, setTypingConfig] = useState({ speed: 100, delay: 2000 });
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [featuredTechnologies, setFeaturedTechnologies] = useState([]);
  const [homeData, setHomeData] = useState(null);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [featuredExperiences, setFeaturedExperiences] = useState([]);
  const [featuredEducation, setFeaturedEducation] = useState([]);
  const [stats, setStats] = useState(null);
  
  

  const { settings, loading } = useSiteSettings();

  useEffect(() => {
    const fetchRotatingTexts = async () => {
      try {
        const response = await publicApi.getRotatingTexts();
        if (response.data.hero_texts && response.data.hero_texts.length > 0) {
          setTexts(response.data.hero_texts);
          setTypingConfig({
            speed: response.data.typing_speed,
            delay: response.data.delay_seconds * 1000
          });
        }
      } catch (error) {
        console.error('Failed to fetch rotating texts:', error);
      }
    };

    fetchRotatingTexts();
  }, []);

  useEffect(() => {
    if (texts.length === 0) return;

    if (charIndex < texts[textIndex].length) {
      const timeout = setTimeout(() => {
        setTypedText(texts[textIndex].substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, typingConfig.speed);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setTypedText('');
        setCharIndex(0);
        setTextIndex((textIndex + 1) % texts.length);
      }, typingConfig.delay);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, textIndex, texts, typingConfig]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await publicApi.getHomeData();
        setHomeData(response.data);
        setStats(response.data.stats);
        setFeaturedExperiences(response.data.featured_experiences || []);
        setFeaturedEducation(response.data.featured_education || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchHomeData();
  }, []);

  useEffect(() => {
    const fetchFeaturedTechnologies = async () => {
      try {
        const response = await publicApi.getTechnologies({
          featured: true
        });
        setFeaturedTechnologies(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFeaturedTechnologies();
  }, []);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const response = await publicApi.getProjects({
          featured: true
        });
        setFeaturedProjects(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFeaturedProjects();
  }, []);

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

  const getEducationColor = (type) => {
    switch(type) {
      case 'bachelors': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'masters': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      case 'phd': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'certification': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    }
  };

  const truncateHtml = (html, maxLength = 50) => {
  if (!html) return '';
  
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Get text content (strips HTML tags automatically)
  const text = tempDiv.textContent || tempDiv.innerText || '';
  
  // Trim and truncate
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  
  return trimmed.substring(0, maxLength) + '...';
};

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded-xl mx-auto mb-4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-48 mx-auto"></div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10 dark:opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center space-x-2 mb-6 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <Sparkles size={16} />
              <span className="text-sm font-medium">{settings?.site?.tagline}</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 dark:text-white">
              <span className="block">Hello, I'm <span style={{
                background: `linear-gradient(45deg, ${settings?.theme?.primary_color}, ${settings?.theme?.secondary_color})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Bhupendra</span></span>
              <span
                style={{
                  background: `linear-gradient(45deg, ${settings?.theme?.primary_color}, ${settings?.theme?.secondary_color})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
                className="block mt-2 bg-clip-text text-transparent">
                {typedText}|
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
              {settings?.site?.self_description || 'Full Stack Developer passionate about creating elegant solutions to complex problems'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                to="/projects"
                className="px-6 py-3 bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white rounded-lg font-medium inline-flex items-center justify-center transition-colors"
              >
                Explore Projects <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg font-medium inline-flex items-center justify-center transition-colors"
              >
                About Me <User className="ml-2" size={20} />
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="flex justify-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl">
              {[
                { label: 'Projects', value: `${stats?.total_projects || 0}+`, icon: <Code2 /> },
                { label: 'Technologies', value: `${stats?.total_technologies || 0}+`, icon: <Cpu /> },
                { label: 'Live Demos', value: stats?.total_demos || 0, icon: <Globe /> },
                { label: 'Experiences', value: stats?.total_experiences || 0, icon: <Briefcase /> },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center"
                >
                  <div className="text-gray-600 dark:text-gray-400 mb-2 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">About Me</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Professional Background & Philosophy
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {settings?.site?.self_description || 
                  "I'm a passionate full-stack developer with expertise in modern web technologies. I specialize in building scalable applications with clean code and intuitive user interfaces. My approach combines technical excellence with creative problem-solving."}
              </p>
              {/* <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span className="font-medium text-gray-900 dark:text-white">Experience</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {featuredExperiences?.duration_months} + in Industry
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-purple-500" />
                    <span className="font-medium text-gray-900 dark:text-white">Education</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {featuredEducation.length}+ Qualifications
                  </p>
                </div>
              </div> */}
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-all"
              >
                View Full Profile
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl"
            >
              <div className="text-center rounded-xl">
                <img className='rounded-xl w-full h-auto' src={settings?.site?.my_image} alt="" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 mb-3 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                <Briefcase className="w-4 h-4" />
                <span className="text-sm font-medium">Professional Journey</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Work Experience
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Key positions and roles throughout my career
              </p>
            </div>
            <Link
              to="/experience"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All Experiences
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {featuredExperiences.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredExperiences.slice(0, 3).map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start gap-4 mb-4">
                    {exp.company_logo && (
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img 
                          src={exp.company_logo} 
                          alt={exp.company}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">{exp.position}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{exp.company}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}</span>
                    </div>
                    {exp.employment_type && (
                      <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                        {exp.employment_type}
                      </span>
                    )}
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
              {truncateHtml(exp.description, 50)}
            </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Experience data coming soon</p>
            </div>
          )}
        </div>
      </section>

      {/* Technologies */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Technologies I Master</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              From frontend to backend, across multiple languages
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {featuredTechnologies.map((tech) => (
              <motion.div
                key={tech.id}
                whileHover={{ scale: 1.06 }}
                className={`relative bg-gradient-to-r
                 rounded-xl p-5 shadow-lg
                 flex flex-col items-center text-center
                 group transition-all ${tech.color}`}
              >
                <span
                  style={{ background: settings?.theme?.primary_color }}
                  className="absolute top-2 right-2 text-[11px] px-2.5 py-0.5 rounded-full text-gray-100"
                >
                  {tech.category}
                </span>

                <span className="absolute top-8 right-2 text-[11px] px-2.5 py-0.5 rounded-full
                       bg-gray-100 dark:bg-gray-700 
                       text-gray-600 dark:text-gray-300 capitalize">
                  {tech.type}
                </span>

                <SafeDynamicSvgIcon svgString={tech.icon} className={'w-12 h-12 mb-3 flex items-center justify-center'} />

                <h3 className="text-base font-semibold">
                  {tech.name}
                </h3>

                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {tech.type}
                </p>

                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                  {tech.description}
                </p>

                {tech.website_url && (
                  <a
                    href={tech.website_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 text-xs text-blue-500 hover:underline"
                  >
                    Visit →
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Featured Projects</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                Showcasing my work across different technologies
              </p>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All Projects
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {featuredProjects?.items?.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects?.items.slice(0, 3).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No featured projects yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Education Preview */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 mb-3 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                <GraduationCap className="w-4 h-4" />
                <span className="text-sm font-medium">Academic Background</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Education & Certifications
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Formal education and professional certifications
              </p>
            </div>
            <Link
              to="/education"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All Education
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {featuredEducation.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEducation.slice(0, 3).map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium mb-2 inline-block ${getEducationColor(edu.education_type)}`}>
                        {edu.education_type?.replace('_', ' ') || 'Education'}
                      </span>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">{edu.degree}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{edu.institution}</p>
                    </div>
                    {edu.institution_logo && (
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img 
                          src={edu.institution_logo} 
                          alt={edu.institution}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date)}</span>
                    </div>
                    {edu.field_of_study && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Field:</span> {edu.field_of_study}
                      </p>
                    )}
                    {edu.formatted_grade && (
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {edu.formatted_grade}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Education data coming soon</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 md:p-12 text-center"
          >
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                Ready to Start a Project?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Whether you need a website, web application, or consultation, I'm here to help bring your ideas to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-all hover:scale-[1.02]"
                >
                  Get in Touch
                </Link>
                <Link
                  to="/demos"
                  className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg font-medium border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  View Live Demos
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
