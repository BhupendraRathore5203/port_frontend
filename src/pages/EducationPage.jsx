import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    GraduationCap,
    BookOpen,
    MapPin,
    Calendar,
    Award,
    Sparkles,
    Filter,
    Search,
    TrendingUp,
    Brain,
    FileText,
    ExternalLink,
    ChevronRight,
    Trophy
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { publicApi } from '../services/api';

const EducationPage = () => {
    const [education, setEducation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        education_type: 'all',
        is_featured: false,
        search: '',
    });
    const [filteredEducation, setFilteredEducation] = useState([]);

    useEffect(() => {
        const fetchEducation = async () => {
            try {
                setLoading(true);
                const response = await publicApi.getEducation({
                    page_size: 50
                });

                if (response.data) {
                    const data = response.data.items || response.data;
                    setEducation(data);
                    setFilteredEducation(data);
                }
            } catch (err) {
                setError('Failed to load education records');
                console.error('Error fetching education:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchEducation();
    }, []);

    useEffect(() => {
        let filtered = [...education];

        // Apply filters
        if (filters.education_type !== 'all') {
            filtered = filtered.filter(edu => edu.education_type === filters.education_type);
        }

        if (filters.is_featured) {
            filtered = filtered.filter(edu => edu.is_featured === true);
        }

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(edu =>
                (edu.degree && edu.degree.toLowerCase().includes(searchTerm)) ||
                (edu.institution && edu.institution.toLowerCase().includes(searchTerm)) ||
                (edu.field_of_study && edu.field_of_study.toLowerCase().includes(searchTerm))
            );
        }

        setFilteredEducation(filtered);
    }, [filters, education]);

    const educationTypes = [
        { value: 'all', label: 'All Types', count: education.length },
        { value: 'bachelors', label: "Bachelor's", count: education.filter(e => e.education_type === 'bachelors').length },
        { value: 'masters', label: "Master's", count: education.filter(e => e.education_type === 'masters').length },
        { value: 'phd', label: 'PhD', count: education.filter(e => e.education_type === 'phd').length },
        { value: 'certification', label: 'Certifications', count: education.filter(e => e.education_type === 'certification').length },
    ];

    const getEducationColor = (type) => {
        switch (type) {
            case 'bachelors': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
            case 'masters': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
            case 'phd': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
            case 'certification': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
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
                    <p className="text-gray-600 dark:text-gray-400">Loading education...</p>
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
                        <GraduationCap className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            Academic Journey
                        </span>
                    </motion.div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                        Education & Qualifications
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        My academic background, certifications, and continuous learning journey in technology and development.
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
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white">{education.length}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Total Qualifications</div>
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
                                <Award className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {education.filter(e => e.grade_value >= 90).length}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Distinctions</div>
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
                                    {education.filter(e => e.is_current).length}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Currently Studying</div>
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
                                <Brain className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {new Set(education.flatMap(e => e.courses || [])).size}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Courses Completed</div>
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
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filter Education</h3>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="relative flex-1 max-w-xs">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search degrees or institutions..."
                                        value={filters.search}
                                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <button
                                    onClick={() => setFilters({ education_type: 'all', is_featured: false, search: '' })}
                                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {educationTypes.map((type) => (
                                <button
                                    key={type.value}
                                    onClick={() => setFilters(prev => ({ ...prev, education_type: type.value }))}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filters.education_type === type.value
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

                {/* Education Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {filteredEducation.length > 0 ? (
                        filteredEducation.map((edu, index) => (
                            <motion.div
                                key={edu.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEducationColor(edu.education_type)}`}>
                                                    {edu.education_type.replace('_', ' ')}
                                                </span>
                                                {edu.is_featured && (
                                                    <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs rounded-full flex items-center gap-1">
                                                        <Sparkles size={10} />
                                                        Featured
                                                    </span>
                                                )}
                                                {edu.is_current && (
                                                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs rounded-full">
                                                        Current
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                                {edu.degree}
                                            </h3>
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                                                <BookOpen size={14} />
                                                <span>{edu.institution}</span>
                                                {edu.location && (
                                                    <>
                                                        <span className="text-gray-400">•</span>
                                                        <MapPin size={14} />
                                                        <span>{edu.location}</span>
                                                    </>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date)}
                                                </span>
                                                {edu.duration_years && (
                                                    <span className="flex items-center gap-1">
                                                        <TrendingUp size={12} />
                                                        {edu.duration_years} years
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {edu.institution_logo && (
                                            <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                                <img
                                                    src={edu.institution_logo}
                                                    alt={edu.institution}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {edu.field_of_study && (
                                        <div className="mb-3">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Field: </span>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">{edu.field_of_study}</span>
                                        </div>
                                    )}

                                    {edu.description && (
                                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                                            {edu.description}
                                        </p>
                                    )}

                                    {/* Grade */}
                                    {edu.formatted_grade && (
                                        <div className="mb-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Trophy className="w-4 h-4 text-yellow-500" />
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Grade:</span>
                                                </div>
                                                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                                    {edu.formatted_grade}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Achievements */}
                                    {edu.achievements && edu.achievements.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                                <Award className="w-4 h-4 text-yellow-500" />
                                                Achievements & Awards:
                                            </h4>
                                            <ul className="space-y-1">
                                                {edu.achievements.slice(0, 3).map((achievement, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                        <ChevronRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                                        <span>{achievement}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Courses */}
                                    {edu.courses && edu.courses.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Key Courses:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {edu.courses.slice(0, 6).map((course, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
                                                    >
                                                        {course}
                                                    </span>
                                                ))}
                                                {edu.courses.length > 6 && (
                                                    <span className="px-2 py-1 text-xs text-gray-500">
                                                        +{edu.courses.length - 6} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Links */}
                                    <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        {edu.thesis_url && (
                                            <a
                                                href={edu.thesis_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                            >
                                                <FileText size={14} />
                                                Thesis
                                                <ExternalLink size={12} />
                                            </a>
                                        )}
                                        {edu.transcript_url && (
                                            <a
                                                href={edu.transcript_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-sm text-green-600 dark:text-green-400 hover:underline"
                                            >
                                                <FileText size={14} />
                                                Transcript
                                                <ExternalLink size={12} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-2 text-center py-16">
                            <GraduationCap className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No education records found</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Try adjusting your filters or check back later.
                            </p>
                            <button
                                onClick={() => setFilters({ education_type: 'all', is_featured: false, search: '' })}
                                className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all"
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Continuous Learning */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-16 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 border border-gray-300 dark:border-gray-700"
                >
                    <div className="text-center max-w-2xl mx-auto">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <Brain className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Continuous Learning
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            I believe in lifelong learning. Beyond formal education, I constantly update my skills through online courses, workshops, and personal projects to stay current with evolving technologies.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link
                                to="/projects"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all font-medium"
                            >
                                <BookOpen className="w-4 h-4" />
                                View Learning Projects
                            </Link>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all font-medium"
                            >
                                <ExternalLink className="w-4 h-4" />
                                LinkedIn Certifications
                            </a>
                        </div>
                    </div>
                </motion.div>

                {/* Educational Timeline (Optional) */}
                {education.some(e => e.start_date) && (
                    <div className="mt-16">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Educational Timeline</h2>
                                <p className="text-gray-600 dark:text-gray-400">Visual journey through my academic path</p>
                            </div>
                        </div>

                        <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 hidden md:block"></div>

                            <div className="space-y-8">
                                {[...education]
                                    .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
                                    .slice(0, 5)
                                    .map((edu, index) => (
                                        <motion.div
                                            key={`timeline-${edu.id}`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="relative"
                                        >
                                            <div className="md:flex gap-6">
                                                <div className="hidden md:flex flex-col items-center w-12">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center z-10">
                                                        <GraduationCap className="w-6 h-6 text-white" />
                                                    </div>
                                                    {index < 4 && (
                                                        <div className="w-0.5 h-8 bg-gradient-to-b from-purple-500 to-pink-500"></div>
                                                    )}
                                                </div>

                                                <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                        <div>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium mb-2 inline-block ${getEducationColor(edu.education_type)}`}>
                                                                {edu.education_type.replace('_', ' ')}
                                                            </span>
                                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{edu.degree}</h3>
                                                            <p className="text-gray-600 dark:text-gray-400">{edu.institution}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date)}
                                                            </div>
                                                            {edu.formatted_grade && (
                                                                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                                                    {edu.formatted_grade}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {edu.description && (
                                                        <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
                                                            {edu.description.substring(0, 150)}...
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                            </div>
                        </div>

                        {education.length > 5 && (
                            <div className="text-center mt-8">
                                <Link
                                    to="/education/timeline"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all font-medium"
                                >
                                    View Complete Timeline
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* Skills Developed Section */}
                <div className="mt-16">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                            Skills & Competencies
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Technical and soft skills developed through formal education and continuous learning
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                        >
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Technical Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {Array.from(new Set(education.flatMap(e => e.technical_skills || [])))
                                    .slice(0, 10)
                                    .map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                        >
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                                <Brain className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Research & Analysis</h3>
                            <div className="flex flex-wrap gap-2">
                                {['Data Analysis', 'Research Methodology', 'Critical Thinking', 'Problem Solving', 'Statistical Analysis', 'Academic Writing']
                                    .map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                        >
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                                <Award className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Professional Development</h3>
                            <div className="flex flex-wrap gap-2">
                                {['Project Management', 'Team Leadership', 'Presentation Skills', 'Technical Writing', 'Collaboration', 'Time Management']
                                    .map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EducationPage;