
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCMSData  } from '../redux/actions/cmsActions';
import { connect } from 'react-redux';
import {
  Menu,
  X,
  ChevronRight,
  Rocket,
  Shield,
  Zap,
  Globe,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  Code,
  Database,
  Lock,
  Palette,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Github,
  Heart,
  Sparkles,
  Target,
  Users as UsersIcon,
  Award,
  Cloud,
  Server,
  Smartphone,
  ShieldCheck
} from 'lucide-react';

const Home = (props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    props.fetchCMSData();
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { 
      icon: <Rocket className="w-8 h-8" />, 
      title: 'Lightning Fast', 
      description: 'Built with React 18 for maximum performance',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      icon: <ShieldCheck className="w-8 h-8" />, 
      title: 'Secure', 
      description: 'JWT authentication & role-based access',
      color: 'from-green-500 to-teal-500'
    },
    { 
      icon: <Palette className="w-8 h-8" />, 
      title: 'Customizable', 
      description: 'Fully customizable themes and layouts',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: <Database className="w-8 h-8" />, 
      title: 'Scalable', 
      description: 'Handles thousands of posts and users',
      color: 'from-orange-500 to-red-500'
    },
  ];

  const testimonials = [
    { 
      name: 'Mujibuddin Ansari', 
      role: 'Co-Founder, RM Tech Solution', 
      content: 'RM Tech CMS transformed our content workflow!',
      rating: 5,
      avatar: 'MA'
    },
    { 
      name: 'Ram Mohan Rao', 
      role: 'Co-Founder, RM Tech Solution', 
      content: 'Intuitive interface with powerful features.',
      rating: 5,
      avatar: 'RM'
    },
    {
      name: 'Shahil ', 
      role: 'Product Head, RM Tech Solution',
      content: 'The best CMS I have ever used for my projects.',
      rating: 4,
      avatar: 'S'
    },
      {
      name: 'Alim Abdul', 
      role: 'Marketing Manager, RM Tech Solution',
      content: 'Streamlined our content operations significantly.',
      rating: 4,
      avatar: 'AA'
    },
    {
      name: 'Ramesh pothi',
      role: 'Lead, RM Tech Solution',
      content: 'Highly recommend RM Tech CMS for any team!',
      rating: 5,
      avatar: 'RP'
    },
    {
      name: 'Rahaman',
      role: 'Chated Accountant, RM Tech Solution',
      content: 'A game-changer for our Accounting management needs.',
      rating: 4,
      avatar: 'R'
    },
    {
      name: 'Zakeer Asmath',
      role: 'Project Manager, RM Tech Solution',
      content: 'Our team productivity has skyrocketed since using this CMS.',
      rating: 5,
      avatar: 'ZA'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Active Users', icon: <UsersIcon className="w-6 h-6" /> },
    { value: '50K+', label: 'Posts Managed', icon: <Code className="w-6 h-6" /> },
    { value: '99.9%', label: 'Uptime', icon: <Server className="w-6 h-6" /> },
    { value: '24/7', label: 'Support', icon: <Shield className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-lg py-3' 
          : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    RM Tech
                  </span>
                  <span className="block text-xs text-gray-500">Solution</span>
                </div>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {['Home', 'Features', 'About', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  {item}
                </a>
              ))}
              
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center shadow-lg"
              >
                Dashboard <ChevronRight className="ml-2 w-4 h-4" />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-blue-600 z-50"
            >
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-t shadow-xl">
            <div className="px-4 pt-4 pb-6 space-y-3">
              {['Home', 'Features', 'About', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-lg font-medium"
                >
                  {item}
                </a>
              ))}
              <button
                onClick={() => {
                  navigate('/dashboard');
                  setIsMenuOpen(false);
                }}
                className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg flex items-center justify-center text-lg font-semibold"
              >
                Dashboard <ChevronRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-6">
              ✨ Modern Content Management System
            </span>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="block text-gray-900">Transform Your</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Content Experience
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              A powerful React.js CMS dashboard designed for RM Tech Solution. 
              Manage content, users, media, and settings with an intuitive interface.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-xl text-lg font-semibold flex items-center justify-center shadow-lg transition-all"
              >
                Get Started Free <ArrowRight className="ml-3 w-5 h-5" />
              </button>
              <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:border-blue-600 hover:text-blue-600 text-lg font-semibold transition-all">
                <a href="#features" className="flex items-center justify-center">
                  View Features <ChevronRight className="ml-2 w-5 h-5" />
                </a>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  <div className="text-blue-600 mb-3">{stat.icon}</div>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
              ✨ Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Modern Teams
              </span>
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">
              Everything you need to manage your content efficiently
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative"
              >
                <div className="relative bg-white p-8 rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-6`}>
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                  <div className="mt-6">
                    <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold mb-4">
                🚀 About Us
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Building the Future of{' '}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Content Management
                </span>
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                At RM Tech Solution, we're passionate about creating tools that empower businesses
                to manage their digital content efficiently. Our CMS platform combines cutting-edge
                technology with intuitive design.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: <Target className="w-6 h-6" />, text: 'Mission-driven development' },
                  { icon: <Award className="w-6 h-6" />, text: 'Award-winning user experience' },
                  { icon: <UsersIcon className="w-6 h-6" />, text: 'Team of expert developers' },
                  { icon: <Globe className="w-6 h-6" />, text: 'Global customer support' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <div className="text-white">{item.icon}</div>
                    </div>
                    <span className="text-gray-700 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-2 shadow-2xl">
                  <div className="bg-gray-800 rounded-2xl p-8">
                    <div className="flex space-x-2 mb-6">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    
                    <div className="mb-8">
                      <h4 className="text-white font-semibold mb-4">Our Tech Stack</h4>
                      <div className="flex flex-wrap gap-3">
                        {['React', 'Tailwind CSS', 'Node.js', 'MongoDB', 'AWS', 'Docker', 'Git', 'Figma'].map((tech, index) => (
                          <span
                            key={tech}
                            className="px-4 py-2 bg-gray-700 text-gray-200 rounded-full text-sm font-medium hover:bg-gray-600 transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((item) => (
                        <div
                          key={item}
                          className="bg-gray-700 rounded-xl p-4"
                        >
                          <div className="h-2 bg-gray-600 rounded-full mb-2"></div>
                          <div className="h-2 bg-gray-600 rounded-full w-3/4"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-pink-100 text-pink-600 rounded-full text-sm font-semibold mb-4">
              📞 Contact Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Get in{' '}
              <span className="bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                Touch
              </span>
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start space-x-6 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Phone</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-sm text-gray-500">Mon-Fri from 8am to 6pm</p>
                </div>
              </div>

              <div className="flex items-start space-x-6 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
                  <p className="text-gray-600">hello@rmtechsolution.com</p>
                  <p className="text-sm text-gray-500">We'll reply within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-6 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Office</h3>
                  <p className="text-gray-600">123 Tech Street</p>
                  <p className="text-gray-600">San Francisco, CA 94107</p>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  {[
                    { icon: <Facebook className="w-6 h-6" />, color: 'from-blue-500 to-blue-600' },
                    { icon: <Twitter className="w-6 h-6" />, color: 'from-sky-500 to-cyan-500' },
                    { icon: <Linkedin className="w-6 h-6" />, color: 'from-blue-700 to-blue-800' },
                    { icon: <Instagram className="w-6 h-6" />, color: 'from-pink-500 to-rose-500' },
                    { icon: <Github className="w-6 h-6" />, color: 'from-gray-700 to-gray-900' },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href="#"
                      className={`w-12 h-12 bg-gradient-to-r ${social.color} rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all`}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Tell us about your project..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl text-lg font-semibold shadow-lg transition-all"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-600 rounded-full text-sm font-semibold mb-4">
              ⭐ Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Loved by{' '}
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Businesses
              </span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic mb-6">"{testimonial.content}"</p>
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
              Join thousands of businesses using RM Tech CMS to manage their content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-white text-blue-600 rounded-2xl hover:shadow-2xl text-lg font-semibold flex items-center justify-center shadow-lg transition-all"
              >
                Start Free Trial <ArrowRight className="ml-3 w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-2xl hover:bg-white/10 text-lg font-semibold transition-all">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold">RM Tech</span>
                  <span className="block text-sm text-gray-400">Solution</span>
                </div>
              </div>
              <p className="text-gray-400 mb-6">
                Modern content management solutions.
              </p>
              <div className="flex space-x-4">
                {[Facebook, Twitter, Linkedin, Instagram, Github].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
            
            {[
              {
                title: 'Product',
                links: ['Features', 'Pricing', 'API', 'Documentation']
              },
              {
                title: 'Company',
                links: ['About Us', 'Blog', 'Careers', 'Partners']
              },
              {
                title: 'Support',
                links: ['Help Center', 'Contact Us', 'Status', 'Community']
              }
            ].map((column, colIndex) => (
              <div key={colIndex}>
                <h4 className="text-lg font-semibold mb-6">{column.title}</h4>
                <ul className="space-y-3">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} RM Tech Solution. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-gray-400">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Cookie Policy</a>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-500 text-sm">
            Made with <Heart className="inline w-4 h-4 text-red-500" /> by RM Tech Solution
          </div>
        </div>
      </footer>
    </div>
  );
};

const mapStateToProps = (state) => ({
  cms: state.cms,
  posts: state.posts,
  users: state.users,
});

const mapDispatchToProps = {
  fetchCMSData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);