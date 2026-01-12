import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Download,
    Award,
    Briefcase,
    GraduationCap,
    Code2,
    Globe,
    Linkedin,
    Github,
    Twitter,
    FileText,
    Sparkles,
    Users,
    Rocket,
    Heart,
    Zap,
    Clock,
    Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { publicApi } from '../services/api';
import { useSiteSettings } from '../hooks/useSiteSettings';

const AboutPage = () => {
    const [aboutData, setAboutData] = useState({
        experiences: [],
        education: [],
        resume: null,
        stats: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { settings } = useSiteSettings();

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                setLoading(true);

                // Fetch data in parallel
                const [experiencesRes, educationRes, statsRes] = await Promise.all([
                    publicApi.getFeaturedExperiences(),
                    publicApi.getFeaturedEducation(),
                    publicApi.getStats()
                ]);

                // Try to get resume, but don't fail if it's 404
                let resumeRes = null;
                try {
                    resumeRes = await publicApi.getAboutResume();
                } catch (err) {
                    console.log('No resume available or error fetching resume:', err);
                }

                setAboutData({
                    experiences: experiencesRes.data || [],
                    education: educationRes.data || [],
                    resume: resumeRes?.data || null, // Handle null case
                    stats: statsRes.data || null
                });

            } catch (err) {
                console.error('Error fetching about data:', err);
                setError('Failed to load about data');
            } finally {
                setLoading(false);
            }
        };

        fetchAboutData();
    }, []);

    const handleDownloadResume = async () => {
        if (aboutData.resume) {
            try {
                const result = await publicApi.downloadResumeFile(aboutData.resume.id);
                if (result.success) {
                    alert(`Resume downloaded successfully: ${result.filename}`);
                } else {
                    alert(`Failed to download resume: ${result.error}`);
                }
            } catch (error) {
                alert('Failed to download resume. Please try again.');
            }
        }
    };

    const principles = [
        { icon: <Zap />, title: 'Fast & Efficient', description: 'Optimized code and performance-focused solutions' },
        { icon: <Target />, title: 'Quality First', description: 'Clean, maintainable code with thorough testing' },
        { icon: <Users />, title: 'Collaborative', description: 'Team player with excellent communication skills' },
        { icon: <Heart />, title: 'Passionate', description: 'Love for coding and continuous learning' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading about information...</p>
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
                        <User className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            About Me
                        </span>
                    </motion.div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                        Bhupendra Singh
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        {settings?.site?.self_description || 'Full Stack Developer passionate about creating elegant solutions to complex problems'}
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                    {/* Left Column - Profile & Contact */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Profile Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Professional Profile</h2>
                                        <p className="text-blue-100 text-sm">Full Stack Developer & Problem Solver</p>
                                    </div>
                                    <User className="text-white opacity-80" size={24} />
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="mb-6">
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                        <div dangerouslySetInnerHTML={{ __html: settings?.site?.self_long_description }} />
                                        
                                    </p>
                                </div>

                                {/* Work Principles */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Work Principles</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {principles.map((principle) => (
                                            <div
                                                key={principle.title}
                                                className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50"
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                                    <div className="text-white">{principle.icon}</div>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white">{principle.title}</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{principle.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Experience & Education Preview */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Experience Preview */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Briefcase className="w-5 h-5 text-blue-500" />
                                        Recent Experience
                                    </h3>
                                    <Link
                                        to="/experience"
                                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        View All
                                    </Link>
                                </div>

                                <div className="space-y-4">
                                    {aboutData.experiences.slice(0, 2).map((exp) => (
                                        <div key={exp.id} className="space-y-2">
                                            <h4 className="font-medium text-gray-900 dark:text-white">{exp.position}</h4>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <Briefcase className="w-4 h-4" />
                                                <span>{exp.company}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {new Date(exp.start_date).toLocaleDateString()} -
                                                {exp.is_current ? ' Present' : ` ${new Date(exp.end_date).toLocaleDateString()}`}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Education Preview */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <GraduationCap className="w-5 h-5 text-purple-500" />
                                        Education
                                    </h3>
                                    <Link
                                        to="/education"
                                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        View All
                                    </Link>
                                </div>

                                <div className="space-y-4">
                                    {aboutData.education.slice(0, 2).map((edu) => (
                                        <div key={edu.id} className="space-y-2">
                                            <h4 className="font-medium text-gray-900 dark:text-white">{edu.degree}</h4>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <GraduationCap className="w-4 h-4" />
                                                <span>{edu.institution}</span>
                                            </div>
                                            {edu.formatted_grade && (
                                                <div className="text-sm font-medium text-green-600 dark:text-green-400">
                                                    {edu.formatted_grade}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Right Column - Contact & Resume */}
                    <div className="space-y-8">
                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
                        >
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <Mail className="w-5 h-5 text-blue-500" />
                                Contact Information
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Email</div>
                                        <a href={`mailto:${settings?.site?.contact_email}`} className="text-gray-900 dark:text-white">{settings?.site?.contact_email || 'bhupendra@example.com'}</a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Phone</div>
                                        <a href={`tel:${settings?.site?.contact_phone}`} className="text-gray-900 dark:text-white">{settings?.site?.contact_phone || '+1 (555) 123-4567'}</a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Location</div>
                                        <div className="text-gray-900 dark:text-white">{settings?.site?.location || 'San Francisco, CA'}</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Resume */}
                        {aboutData.resume && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-gray-300 dark:border-gray-700"
                            >
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-500" />
                                    Download Resume
                                </h3>

                                <div className="space-y-4">
                                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {aboutData.resume.title}
                                            </div>
                                            {aboutData.resume.is_primary && (
                                                <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs rounded-full">
                                                    Primary
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                            <span>{aboutData.resume.file_size_human}</span>
                                            <span>Version {aboutData.resume.version}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                            Last updated: {new Date(aboutData.resume.last_updated).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleDownloadResume}
                                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-all"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download Resume
                                    </button>

                                    <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                                        <Clock className="inline mr-1" size={12} />
                                        Updated regularly with new achievements
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Social Links */}
                        {settings?.social && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white"
                            >
                                <h3 className="text-lg font-bold mb-4">Connect With Me</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {settings.social.github && (
                                        <a
                                            href={settings.social.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-gradient-to-br from-gray-900 to-gray-800 p-3 rounded-lg flex flex-col items-center justify-center hover:scale-105 transition-transform"
                                        >
                                            <Github />
                                            <span className="text-xs mt-2">GitHub</span>
                                        </a>
                                    )}
                                    {settings.social.linkedin && (
                                        <a
                                            href={settings.social.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-gradient-to-br from-blue-700 to-blue-600 p-3 rounded-lg flex flex-col items-center justify-center hover:scale-105 transition-transform"
                                        >
                                            <Linkedin />
                                            <span className="text-xs mt-2">LinkedIn</span>
                                        </a>
                                    )}
                                    {settings.social.twitter && (
                                        <a
                                            href={settings.social.twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-gradient-to-br from-sky-500 to-cyan-400 p-3 rounded-lg flex flex-col items-center justify-center hover:scale-105 transition-transform"
                                        >
                                            <Twitter />
                                            <span className="text-xs mt-2">Twitter</span>
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Quick Stats */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
                        >
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <Award className="w-5 h-5 text-yellow-500" />
                                Quick Stats
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                                        {aboutData.stats?.total_projects || 0}
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">Projects</div>
                                </div>

                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                                        {aboutData.experiences.length}
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">Experiences</div>
                                </div>

                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                                        {aboutData.education.length}
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">Qualifications</div>
                                </div>

                                <div className="text-center">
                                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                                        {aboutData.stats?.total_demos || 0}
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">Live Demos</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 p-8 border border-gray-300 dark:border-gray-700"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-32 translate-x-32"></div>

                    <div className="relative z-10 text-center max-w-2xl mx-auto">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <Rocket className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Ready to Work Together?
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            Whether you have a project in mind, want to collaborate, or just want to connect, I'd love to hear from you!
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all hover:scale-[1.02] font-medium shadow-lg"
                            >
                                <Mail className="w-4 h-4" />
                                Get in Touch
                            </Link>
                            <Link
                                to="/projects"
                                className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white px-6 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium border border-gray-300 dark:border-gray-700"
                            >
                                <Code2 className="w-4 h-4" />
                                Explore Projects
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AboutPage;