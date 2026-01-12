import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Mail, MapPin, Phone, Linkedin, Github, Twitter,
  MessageSquare, CheckCircle, AlertCircle, Loader2,
  Globe, User, Briefcase, Shield, Zap, Sparkles,
  GithubIcon,
  LinkedinIcon,
  TwitterIcon,
  Globe2,
  Instagram,
  Youtube,
  Globe2Icon
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { publicApi } from '../services/api';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { BsDiscord } from 'react-icons/bs';


const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const messageLength = formData.message.length;
  const { settings, loading } = useSiteSettings();


  // Add this function to extract social links from API response:
  const getSocialLinksFromAPI = (settings) => {
    if (!settings?.social) return [];

    const socialConfig = {
      github: { name: 'GitHub', color: 'from-gray-900 to-gray-800' },
      linkedin: { name: 'LinkedIn', color: 'from-blue-700 to-blue-600' },
      twitter: { name: 'Twitter', color: 'from-sky-500 to-cyan-400' },
      facebook: { name: 'Facebook', color: 'from-blue-600 to-blue-500' },
      instagram: { name: 'Instagram', color: 'from-pink-600 to-purple-600' },
      youtube: { name: 'YouTube', color: 'from-red-600 to-red-500' },
      discord: { name: 'Discord', color: 'from-indigo-600 to-purple-600' },
      globe: { name: 'Website', color: 'from-green-600 to-emerald-500' },
    };

    return Object.entries(settings.social)
      .filter(([_, url]) => url && url.trim() !== '')
      .map(([platform, url]) => ({
        platform,
        url,
        name: socialConfig[platform]?.name || platform.charAt(0).toUpperCase() + platform.slice(1),
        color: socialConfig[platform]?.color || 'from-gray-600 to-gray-500',
        icon: getSocialIcon(platform)
      }));
  };

  const getSocialIcon = (platform) => {
    const icons = {
      github: <GithubIcon />,
      linkedin: <LinkedinIcon />,
      twitter: <TwitterIcon />,
      facebook: <Globe2 />, // You can replace with Facebook icon if you have it
      instagram: <Instagram />, // You can replace with Instagram icon if you have it
      youtube: <Youtube />, // You can replace with YouTube icon if you have it
      discord: <BsDiscord />, // You can replace with Discord icon if you have it
      globe: <Globe2Icon />,
    };
    return icons[platform] || <Globe />;
  };

  // Then in your Contact component JSX, replace the hardcoded socialLinks:
  const apiSocialLinks = getSocialLinksFromAPI(settings);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.length < 2) newErrors.name = 'Minimum 2 characters';

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email))
      newErrors.email = 'Invalid email';

    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    else if (formData.subject.length < 5) newErrors.subject = 'Minimum 5 characters';

    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.length < 20) newErrors.message = 'Minimum 20 characters';
    else if (formData.message.length > 2000) newErrors.message = 'Maximum 2000 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const socialLinks = getSocialLinksFromAPI(settings);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    try {
      await publicApi.sendContactMessage(formData);
      toast.success('Message sent successfully! I\'ll respond within 24 hours.', {
        duration: 5000,
        icon: '🎉'
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
      setFormSubmitted(true);
      setTimeout(() => setFormSubmitted(false), 3000);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to send message');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail />,
      title: 'Email',
      value: settings?.site?.contact_email || 'bhupendrasingh05022003@gmail.com',
      link: `mailto:${settings?.site?.contact_email || 'bhupendrasingh05022003@gmail.com'}`,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Phone />,
      title: 'Phone',
      value: settings?.site?.contact_phone || '+917297837735',
      link: `tel:${settings?.site?.contact_phone || '+917297837735'}`,
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <MapPin />,
      title: 'Location',
      value: settings?.site?.location || 'San Francisco, CA',
      link: '#',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const isFormValid = () => {
    return formData.name.length >= 2 &&
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email) &&
      formData.subject.length >= 5 &&
      formData.message.length >= 20 &&
      formData.message.length <= 2000;
  };

  // Fixed: Added return statement for loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <p className="text-gray-600 dark:text-gray-300">Loading contact information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
        }}
      />

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <MessageSquare size={16} />
            <span className="text-sm font-medium">Contact Me</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Let&apos;s Work Together
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have a project in mind? Let&apos;s discuss how we can bring your ideas to life.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Send a Message</h2>
                    <p className="text-blue-100 text-sm">I typically respond within 24 hours</p>
                  </div>
                  <Send className="text-white opacity-80" size={24} />
                </div>
              </div>

              <form onSubmit={onSubmit} className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Your name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject *</label>
                  <input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border ${errors.subject ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Project inquiry"
                  />
                  {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border ${errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none`}
                    placeholder="Tell me about your project..."
                  />
                  <div className="flex justify-between mt-2">
                    {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
                    <span className={`text-sm ${messageLength > 1800 ? 'text-red-500' :
                        messageLength > 1500 ? 'text-yellow-500' : 'text-gray-500'
                      }`}>
                      {messageLength}/2000
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !isFormValid()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={20} />
                      Sending...
                    </span>
                  ) : 'Send Message'}
                </button>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  <Shield className="inline mr-1" size={14} />
                  Your information is secure and encrypted
                </p>
              </form>
            </div>
          </motion.div>

          {/* Contact Info & Social */}
          <div className="space-y-6">
            {/* Contact Cards */}
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center`}>
                    <div className="text-white">{info.icon}</div>
                  </div>
                  <div>
                    <h3 className="font-medium">{info.title}</h3>
                    <p className="text-gray-600 text-sm dark:text-gray-300">{info.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white"
            >
              <h3 className="text-xl font-bold mb-4">Connect With Me</h3>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`bg-gradient-to-br ${social.color} p-3 rounded-lg flex flex-col items-center justify-center hover:scale-105 transition-transform`}
                  >
                    {social.icon}
                    <span className="text-xs mt-2">{social.name}</span>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white"
            >
              <h3 className="text-xl font-bold mb-4">Why Work With Me</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Zap className="text-yellow-300" size={20} />
                  <span className="text-sm">Fast Response Time</span>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles className="text-cyan-300" size={20} />
                  <span className="text-sm">Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="text-green-300" size={20} />
                  <span className="text-sm">Secure & Confidential</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Success Message Overlay */}
        <AnimatePresence>
          {formSubmitted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <CheckCircle className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Thank you for reaching out. I&apos;ll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Got it!
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { q: 'What is your response time?', a: 'Typically within 24 hours for initial responses.' },
              { q: 'Do you work with international clients?', a: 'Yes, I work with clients worldwide remotely.' },
              { q: 'What are your rates?', a: 'Rates vary based on project scope. Contact for a custom quote.' },
              { q: 'Do you offer ongoing support?', a: 'Yes, maintenance and support packages are available.' },
            ].map((faq, idx) => (
              <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <h4 className="font-medium mb-2">{faq.q}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;