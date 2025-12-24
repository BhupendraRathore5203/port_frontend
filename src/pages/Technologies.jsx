import React, { useState } from 'react';
import { Code2, Zap, Database, Cpu, Server, Terminal, Globe, Layout } from 'lucide-react';
import { motion } from 'framer-motion';

const Technologies = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: <Cpu /> },
    { id: 'frontend', name: 'Frontend', icon: <Layout /> },
    { id: 'backend', name: 'Backend', icon: <Server /> },
    { id: 'database', name: 'Database', icon: <Database /> },
    { id: 'devops', name: 'DevOps', icon: <Terminal /> },
    { id: 'ml', name: 'ML/AI', icon: <Zap /> },
  ];

  const technologies = [
    {
      id: 1,
      name: 'React',
      category: 'frontend',
      level: 'Expert',
      description: 'Building interactive UIs with hooks, context, and modern patterns.',
      projects: 12,
      color: 'from-blue-500 to-cyan-500',
      icon: '⚛️',
      frameworks: ['Next.js', 'Gatsby', 'Remix']
    },
    {
      id: 2,
      name: 'Python',
      category: 'backend',
      level: 'Expert',
      description: 'Backend development, data analysis, automation, and machine learning.',
      projects: 18,
      color: 'from-yellow-500 to-orange-500',
      icon: '🐍',
      frameworks: ['Django', 'Flask', 'FastAPI']
    },
    {
      id: 3,
      name: 'Java',
      category: 'backend',
      level: 'Advanced',
      description: 'Enterprise applications, microservices, and Android development.',
      projects: 8,
      color: 'from-red-500 to-pink-500',
      icon: '☕',
      frameworks: ['Spring Boot', 'Android SDK']
    },
    {
      id: 4,
      name: 'Node.js',
      category: 'backend',
      level: 'Advanced',
      description: 'Server-side JavaScript with Express, real-time applications.',
      projects: 10,
      color: 'from-green-500 to-emerald-500',
      icon: '🟢',
      frameworks: ['Express', 'NestJS', 'Socket.io']
    },
    {
      id: 5,
      name: 'MySQL',
      category: 'database',
      level: 'Expert',
      description: 'Relational database design, optimization, and complex queries.',
      projects: 15,
      color: 'from-orange-500 to-amber-500',
      icon: '🐬',
      frameworks: []
    },
    {
      id: 6,
      name: 'MongoDB',
      category: 'database',
      level: 'Advanced',
      description: 'NoSQL databases, document storage, and aggregation pipelines.',
      projects: 7,
      color: 'from-green-600 to-lime-500',
      icon: '🍃',
      frameworks: []
    },
    {
      id: 7,
      name: 'Docker',
      category: 'devops',
      level: 'Advanced',
      description: 'Containerization, microservices architecture, and deployment.',
      projects: 9,
      color: 'from-blue-600 to-indigo-500',
      icon: '🐳',
      frameworks: []
    },
    {
      id: 8,
      name: 'TensorFlow',
      category: 'ml',
      level: 'Intermediate',
      description: 'Machine learning models, neural networks, and data preprocessing.',
      projects: 5,
      color: 'from-orange-600 to-red-500',
      icon: '🧠',
      frameworks: ['Keras']
    },
    {
      id: 9,
      name: 'Vue.js',
      category: 'frontend',
      level: 'Intermediate',
      description: 'Progressive framework for building user interfaces.',
      projects: 4,
      color: 'from-green-400 to-teal-500',
      icon: '🟩',
      frameworks: ['Nuxt.js', 'Vuex']
    },
    {
      id: 10,
      name: 'PostgreSQL',
      category: 'database',
      level: 'Advanced',
      description: 'Advanced SQL features, JSON support, and spatial data.',
      projects: 6,
      color: 'from-blue-700 to-blue-900',
      icon: '🐘',
      frameworks: []
    },
    {
      id: 11,
      name: 'AWS',
      category: 'devops',
      level: 'Intermediate',
      description: 'Cloud services, serverless architecture, and infrastructure.',
      projects: 7,
      color: 'from-orange-500 to-yellow-500',
      icon: '☁️',
      frameworks: []
    },
    {
      id: 12,
      name: 'GraphQL',
      category: 'backend',
      level: 'Intermediate',
      description: 'API query language and efficient data fetching.',
      projects: 5,
      color: 'from-pink-500 to-purple-500',
      icon: '📊',
      frameworks: ['Apollo', 'Relay']
    },
  ];

  const filteredTech = technologies.filter(tech => 
    activeCategory === 'all' || tech.category === activeCategory
  );

  const getLevelColor = (level) => {
    switch(level) {
      case 'Expert': return 'bg-green-500';
      case 'Advanced': return 'bg-blue-500';
      case 'Intermediate': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 mb-6 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
            <Code2 size={16} />
            <span className="text-sm font-medium">Tech Stack</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Technology <span className="gradient-text">Expertise</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Comprehensive overview of programming languages, frameworks, and tools I work with
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all ${
                activeCategory === category.id
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category.icon}
              <span className="font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Technology Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredTech.map((tech) => (
            <motion.div
              key={tech.id}
              whileHover={{ y: -5 }}
              className="card group"
            >
              {/* Tech Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tech.color} flex items-center justify-center text-2xl`}>
                    {tech.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{tech.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${getLevelColor(tech.level)}`}></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{tech.level}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{tech.projects}</div>
                  <div className="text-xs text-gray-500">Projects</div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 mb-4">{tech.description}</p>

              {/* Frameworks */}
              {tech.frameworks.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Frameworks & Libraries:</h4>
                  <div className="flex flex-wrap gap-2">
                    {tech.frameworks.map((framework) => (
                      <span
                        key={framework}
                        className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-lg"
                      >
                        {framework}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Proficiency</span>
                  <span className="font-medium">{tech.level}</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${tech.color} rounded-full`}
                    style={{
                      width: tech.level === 'Expert' ? '90%' :
                             tech.level === 'Advanced' ? '75%' :
                             tech.level === 'Intermediate' ? '60%' : '40%'
                    }}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card max-w-4xl mx-auto bg-gradient-to-r from-primary-500 to-purple-600 text-white"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Technology Overview</h3>
              <p className="opacity-90">
                With expertise across multiple technology stacks, I can tackle projects from concept to deployment.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{technologies.length}</div>
                <div className="opacity-90 text-sm">Technologies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">8</div>
                <div className="opacity-90 text-sm">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">25+</div>
                <div className="opacity-90 text-sm">Projects</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Technologies;