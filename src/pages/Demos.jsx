import React, { useState } from 'react';
import { Play, ExternalLink, Code, Terminal, Globe, Zap, Cpu, Clock, Wrench, Rocket, Sparkles, Coffee, Calendar, Target, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Demos = () => {
  const [activeDemo, setActiveDemo] = useState(null);

  const upcomingDemos = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'Full-featured online store with cart, checkout, and admin panel.',
      progress: 85,
      eta: '2 weeks',
      tech: ['React', 'Django', 'PostgreSQL', 'Stripe'],
      features: ['Shopping Cart', 'Payment Gateway', 'Admin Dashboard', 'Inventory Management']
    },
    {
      id: 2,
      title: 'Real-time Dashboard',
      description: 'Interactive analytics dashboard with live data streaming.',
      progress: 70,
      eta: '3 weeks',
      tech: ['React', 'Node.js', 'Socket.io', 'D3.js'],
      features: ['Real-time Charts', 'Data Export', 'Custom Reports', 'Multi-user']
    },
    {
      id: 3,
      title: 'AI Model Playground',
      description: 'Interactive interface to test and visualize machine learning models.',
      progress: 60,
      eta: '4 weeks',
      tech: ['Python', 'Flask', 'TensorFlow', 'React'],
      features: ['Model Testing', 'Data Visualization', 'Parameter Tuning', 'Results Export']
    },
    {
      id: 4,
      title: 'Code Editor IDE',
      description: 'Browser-based code editor with compilation and collaboration features.',
      progress: 45,
      eta: '6 weeks',
      tech: ['TypeScript', 'Monaco', 'WebAssembly'],
      features: ['Syntax Highlighting', 'Code Execution', 'Live Collaboration', 'Multi-language']
    },
    {
      id: 5,
      title: 'API Documentation Portal',
      description: 'Interactive API documentation with live testing and examples.',
      progress: 90,
      eta: '1 week',
      tech: ['OpenAPI', 'React', 'JWT', 'Swagger'],
      features: ['Live Testing', 'Authentication', 'Request Builder', 'Code Examples']
    },
    {
      id: 6,
      title: 'Project Management Tool',
      description: 'Team collaboration platform with task tracking and file sharing.',
      progress: 55,
      eta: '5 weeks',
      tech: ['React', 'Node.js', 'MongoDB', 'WebRTC'],
      features: ['Task Management', 'File Sharing', 'Real-time Chat', 'Progress Tracking']
    },
  ];

  const DemoCard = ({ demo }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
    >
      {/* Progress Indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-700">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
          style={{ width: `${demo.progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              In Development
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">• {demo.progress}% complete</span>
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            {demo.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {demo.description}
          </p>
        </div>
        <div className="flex-shrink-0 ml-4">
          <div className="px-3 py-1.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-lg text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">ETA</div>
            <div className="text-sm font-bold text-blue-600 dark:text-blue-400">{demo.eta}</div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mb-5">
        <h4 className="font-semibold mb-2 text-sm text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Target className="w-4 h-4 text-blue-500" />
          Key Features
        </h4>
        <div className="flex flex-wrap gap-2">
          {demo.features.map((feature) => (
            <span
              key={feature}
              className="px-2.5 py-1 text-xs bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2 text-sm text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-purple-500" />
          Technology Stack
        </h4>
        <div className="flex flex-wrap gap-2">
          {demo.tech.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-xs bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-800/30 rounded-lg text-blue-700 dark:text-blue-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Coming Soon Badge */}
      <div className="absolute top-4 right-4">
        <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-medium rounded-full shadow-lg">
          Coming Soon
        </span>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-full border border-blue-200 dark:border-blue-800/30">
            <Rocket className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Interactive Demos
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Live Demos
            </span>
            <br />
            <span className="text-gray-800 dark:text-gray-200">Coming Soon</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Exciting interactive demos are currently in development. Each project will feature live, 
            fully-functional instances that you can explore and interact with directly in your browser.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-800/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                  <Wrench className="text-white w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">6</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Projects</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-2xl border border-purple-200 dark:border-purple-800/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                  <Clock className="text-white w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">75%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Average Progress</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/10 dark:from-pink-900/20 dark:to-pink-800/20 p-6 rounded-2xl border border-pink-200 dark:border-pink-800/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 flex items-center justify-center">
                  <Users className="text-white w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-pink-700 dark:text-pink-300">100%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Interactive Features</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Upcoming Demos Grid */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Upcoming Interactive Demos
              </h2>
              <div className="px-3 py-1 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full">
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                  Live Testing Soon
                </span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingDemos.map((demo, index) => (
                <motion.div
                  key={demo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <DemoCard demo={demo} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Coming Soon Message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 dark:from-blue-600/10 dark:via-purple-600/10 dark:to-pink-600/10 p-8 md:p-12 border border-gray-300 dark:border-gray-700"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-500/5 to-purple-500/5 rounded-full translate-y-32 -translate-x-32"></div>
            
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Sparkles className="text-white w-10 h-10" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Something Amazing is Brewing
              </h2>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                I'm working hard to bring you fully interactive, production-ready demos that 
                showcase real-world applications. Each demo will include live data, user interactions, 
                and the complete feature set as described.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <div className="text-left">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Expected Launch</div>
                    <div className="font-semibold text-gray-900 dark:text-white">Next 4-6 weeks</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                  <Coffee className="w-5 h-5 text-purple-500" />
                  <div className="text-left">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
                    <div className="font-semibold text-green-600 dark:text-green-400">Active Development</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-300 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Want to be notified when demos go live? 
                  <a 
                    href="/contact" 
                    className="ml-2 font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    Get in touch →
                  </a>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Back to Projects */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center"
          >
            <a
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-300 rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
            >
              <Globe className="w-4 h-4" />
              View Completed Projects
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Demos;