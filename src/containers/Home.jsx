
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCMSData } from '../redux/actions/cmsActions';
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
  ShieldCheck,
  TrendingUp,
  BarChart,
  DollarSign,
  Clock,
  Layers,
  ShoppingCart,
  Smartphone as Mobile,
  Monitor,
  Terminal,
  Database as Db,
  Shield as Security,
  Zap as Lightning,
  Globe as Worldwide,
  Headphones,
  Check,
  X as Close,
  MessageSquare,
  Video,
  Calendar,
  Award as Trophy,
  Briefcase,
  Building,
  Store,
  Coffee,
  // Restaurant,
  ShoppingBag,
  Wrench,
  Truck,
  Heart as Health,
  GraduationCap,
  Music,
  Camera,
  BookOpen,
  Utensils,
  TabletSmartphone,
  LayoutDashboard,
  Grid3x3,
  Eye,
  Smartphone as PhoneIcon,
  Monitor as Laptop,
  Filter,
  Search,
  ShoppingCart as CartIcon,
  User,
  Settings as SettingsIcon,
  Bell,
  Home as HomeIcon,
  Package,
  Tag,
  Image,
  FileText,
  BarChart3,
  ChevronLeft,
  ChevronDown,
  Play,
  Pause,
  Maximize2,
  Minimize2,
} from 'lucide-react';

const Home = (props) => {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeShowcase, setActiveShowcase] = useState('web');
  const [autoRotate, setAutoRotate] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    props.fetchCMSData();
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Auto-rotate showcase
    let interval;
    if (autoRotate) {
      interval = setInterval(() => {
        const showcases = ['web', 'mobile', 'cms', 'catalog'];
        setActiveShowcase(current => {
          const currentIndex = showcases.indexOf(current);
          return showcases[(currentIndex + 1) % showcases.length];
        });
      }, 4000);
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (interval) clearInterval(interval);
    };
  }, [autoRotate]);

  const features = [
    { 
      icon: <Rocket className="w-8 h-8" />, 
      title: 'Lightning Fast', 
      description: 'Built with  for maximum performance',
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
      name: 'Adil Abdul', 
      role: 'Tech Support, RM Tech Solution',
      content: 'Reliable and efficient CMS platform.',
      rating: 4,
      avatar: 'AA'
    },
    {
      name: 'Ramesh Pothi',
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

  // FAQ
  const faqs = [
    {
      question: 'How long does it take to develop a custom app?',
      answer: 'Typically 4-8 weeks depending on complexity. We follow agile methodology with regular updates.'
    },
    {
      question: 'Do you provide maintenance after launch?',
      answer: 'Yes! All our plans include 6 months of free maintenance. We offer affordable maintenance packages thereafter.'
    },
    {
      question: 'Can I update content myself?',
      answer: 'Absolutely! Our CMS is designed for non-technical users with an intuitive interface.'
    },
    {
      question: 'What technologies do you use?',
      answer: 'We use React, Node.js, MongoDB, Express, and other modern technologies for scalable solutions.'
    },
    {
      question: 'Do you provide hosting?',
      answer: 'Yes, we provide secure hosting with 99.9% uptime guarantee and regular backups.'
    },
  ];

  
  // Pricing Plans
  const pricingPlans = [
    {
      name: 'Starter',
      price: '₹40K+',
      description: 'Perfect for basic online presence',
      features: [
        { included: true, text: 'Responsive Website' },
        { included: true, text: 'Basic Blog System' },
        { included: true, text: 'Contact Form' },
        { included: true, text: '5 Pages' },
        { included: true, text: 'Mobile Responsive' },
        { included: false, text: 'Admin Dashboard' },
        { included: false, text: 'Product Catalog' },
        { included: false, text: 'Custom CMS' },
        { included: false, text: 'E-commerce' },
        { included: false, text: 'Mobile App' },
      ],
      color: 'from-blue-500 to-cyan-500',
      highlight: false
    },
    {
      name: 'Business',
      price: '₹80K+',
      description: 'Complete business solution with CMS',
      features: [
        { included: true, text: 'Everything in Starter' },
        { included: true, text: 'Advanced CMS Dashboard' },
        { included: true, text: 'Product Catalog System' },
        { included: true, text: 'User Management' },
        { included: true, text: 'Content Management' },
        { included: true, text: 'Media Library' },
        { included: true, text: 'Basic E-commerce' },
        { included: true, text: '10+ Pages' },
        { included: false, text: 'Mobile App' },
        { included: false, text: 'Advanced Analytics' },
      ],
      color: 'from-purple-500 to-pink-500',
      highlight: true
    },
    {
      name: 'Enterprise',
      price: '₹1L+',
      description: 'Full-stack dynamic solution',
      features: [
        { included: true, text: 'Everything in Business' },
        { included: true, text: 'Native Mobile App' },
        { included: true, text: 'Advanced E-commerce' },
        { included: true, text: 'Real-time Analytics' },
        { included: true, text: 'API Integration' },
        { included: true, text: 'Custom Modules' },
        { included: true, text: 'Unlimited Pages' },
        { included: true, text: 'Priority Support' },
        { included: true, text: 'Training Sessions' },
        { included: true, text: 'Maintenance (1 Year)' },
      ],
      color: 'from-orange-500 to-red-500',
      highlight: false
    },
  ];

    // Our Services
  const services = [
    {
      title: 'Web Development',
      description: 'Responsive, SEO-friendly websites that drive results',
      icon: <Monitor className="w-10 h-10" />,
      features: ['Mobile Responsive', 'SEO Optimized', 'Fast Loading', 'CMS Integration'],
      color: 'from-blue-600 to-cyan-500'
    },
    {
      title: 'Mobile Apps',
      description: 'Native & cross-platform mobile applications',
      icon: <Mobile className="w-10 h-10" />,
      features: ['iOS & Android', 'Push Notifications', 'Offline Support', 'App Store Ready'],
      color: 'from-purple-600 to-pink-500'
    },
    {
      title: 'E-commerce Solutions',
      description: 'Complete online store setup with payment integration',
      icon: <ShoppingCart className="w-10 h-10" />,
      features: ['Product Management', 'Payment Gateway', 'Order Tracking', 'Inventory'],
      color: 'from-green-600 to-teal-500'
    },
    {
      title: 'Custom CMS',
      description: 'Tailored content management systems',
      icon: <Terminal className="w-10 h-10" />,
      features: ['User Management', 'Content Editor', 'Media Library', 'Custom Fields'],
      color: 'from-orange-600 to-red-500'
    },
    {
      title: 'Database Design',
      description: 'Scalable database architecture',
      icon: <Db className="w-10 h-10" />,
      features: ['MongoDB/MySQL', 'API Integration', 'Data Migration', 'Backup Systems'],
      color: 'from-indigo-600 to-blue-500'
    },
    {
      title: 'Maintenance & Support',
      description: 'Ongoing support and updates',
      icon: <Headphones className="w-10 h-10" />,
      features: ['24/7 Support', 'Regular Updates', 'Security Patches', 'Performance Tuning'],
      color: 'from-gray-700 to-gray-900'
    },
  ];

    // Industry Solutions
  const industries = [
    { icon: <Store className="w-8 h-8" />, name: 'Retail Stores', color: 'from-blue-500 to-cyan-500' },
    { icon: <Utensils className="w-8 h-8" />, name: 'Restaurants', color: 'from-red-500 to-orange-500' },
    { icon: <Coffee className="w-8 h-8" />, name: 'Cafes', color: 'from-amber-500 to-yellow-500' },
    { icon: <Health className="w-8 h-8" />, name: 'Healthcare', color: 'from-green-500 to-teal-500' },
    { icon: <GraduationCap className="w-8 h-8" />, name: 'Education', color: 'from-purple-500 to-pink-500' },
    { icon: <Wrench className="w-8 h-8" />, name: 'Services', color: 'from-gray-600 to-gray-800' },
    { icon: <Truck className="w-8 h-8" />, name: 'Logistics', color: 'from-indigo-500 to-blue-500' },
    { icon: <Camera className="w-8 h-8" />, name: 'Photography', color: 'from-pink-500 to-rose-500' },
  ];

    // Process Steps
  const processSteps = [
    { step: '01', title: 'Consultation', description: 'Understand your business needs', icon: <MessageSquare /> },
    { step: '02', title: 'Planning', description: 'Create detailed project roadmap', icon: <Calendar /> },
    { step: '03', title: 'Design', description: 'UI/UX design and prototyping', icon: <Palette /> },
    { step: '04', title: 'Development', description: 'Agile development process', icon: <Code /> },
    { step: '05', title: 'Testing', description: 'Quality assurance & testing', icon: <ShieldCheck /> },
    { step: '06', title: 'Launch', description: 'Deployment & training', icon: <Rocket /> },
  ];

    const successMetrics = [
    { metric: '2x', description: 'Average Business Growth', icon: <TrendingUp /> },
    { metric: '40%', description: 'Increase in Customer Reach', icon: <Globe /> },
    { metric: '60%', description: 'Reduction in Manual Work', icon: <Zap /> },
    { metric: '85%', description: 'Customer Satisfaction Rate', icon: <Star /> },
  ];

    // Portfolio Projects
  const portfolioProjects = [
    {
      title: 'Restaurant Management',
      category: 'Food & Beverage',
      description: 'Complete ordering and inventory system',
      features: ['Online Orders', 'Table Management', 'Inventory Tracking'],
      color: 'from-red-500 to-orange-500'
    },
    {
      title: 'Retail E-commerce',
      category: 'Retail',
      description: 'Multi-vendor marketplace platform',
      features: ['Product Catalog', 'Payment Gateway', 'Order Tracking'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Healthcare Portal',
      category: 'Healthcare',
      description: 'Patient management and appointment system',
      features: ['Appointment Booking', 'Patient Records', 'Billing System'],
      color: 'from-green-500 to-teal-500'
    },
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
                <img 
                  src={require('../assets/logo4.png')}
                  className="object-cover"
                  style={{ height: '90px', width: '200px' }}
                  alt="RM Tech Solution"
                />
              </Link>
            </div>

         {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {['Home','Showcase', "Features",'Industries','Services','Pricing', 'Portfolio', 'About'].map((item) => (
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
              {['Home', 'Services', 'Industries', 'Pricing', 'Portfolio', 'About', 'Contact'].map((item) => (
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
      <section id="home" className="relative pt-24 pb-32 md:pt-32 md:pb-48 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 transform -skew-y-6"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Content */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-full border border-blue-200/50 mb-6">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  🚀 2X Business Growth Guaranteed
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="block text-gray-900">From ₹1 Lakh to</span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                  10X Revenue Growth
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-10 max-w-lg">
                Complete <span className="font-semibold text-blue-600">CMS + E-commerce + Mobile App</span> solutions for small businesses. 
                Get your professional digital presence in 30 days or less.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-2xl text-lg font-semibold flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center">
                    Start Free 14-Day Trial <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
                
                <button className="group px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-700 rounded-2xl hover:border-blue-600 hover:text-blue-600 text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                  <a href="#showcase" className="flex items-center justify-center">
                    <Video className="mr-3 w-5 h-5" />
                    Watch Demo 
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">3 min</span>
                  </a>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-12">
                <div className="flex items-center">
                  <div className="flex -space-x-2 mr-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-white"></div>
                    ))}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">50+</div>
                    <div className="text-sm text-gray-500">Happy Clients</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="mr-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">100%</div>
                    <div className="text-sm text-gray-500">Success Rate</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="mr-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Award</div>
                    <div className="text-sm text-gray-500">Winning Team</div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-lg mx-auto lg:mx-0">
                {[
                  { value: '40%', label: 'Cost Saving', icon: <DollarSign className="w-5 h-5" />, color: 'from-green-500 to-teal-500' },
                  { value: '2X', label: 'Revenue Growth', icon: <TrendingUp className="w-5 h-5" />, color: 'from-blue-500 to-cyan-500' },
                  { value: '30 Days', label: 'Delivery Time', icon: <Clock className="w-5 h-5" />, color: 'from-purple-500 to-pink-500' },
                  { value: '24/7', label: 'Support', icon: <Headphones className="w-5 h-5" />, color: 'from-orange-500 to-red-500' },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${stat.color} text-white mb-3`}>
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Interactive Preview */}
            <div className="lg:w-1/2 relative">
              {/* Floating Dashboard Preview */}
              <div className="relative mx-auto max-w-lg">
                {/* Main Dashboard Card */}
                <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform hover:scale-105 transition-transform duration-500">
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                          <LayoutDashboard className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-bold">Live Preview</div>
                          <div className="text-gray-300 text-sm">CMS Dashboard</div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        { value: '₹2.5L', label: 'Monthly Revenue', trend: '↑ 24%' },
                        { value: '1.2K', label: 'Active Users', trend: '↑ 18%' },
                        { value: '98%', label: 'Satisfaction', trend: '↑ 5%' },
                      ].map((stat, idx) => (
                        <div key={idx} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 text-center">
                          <div className="text-xl font-bold text-white">{stat.value}</div>
                          <div className="text-xs text-gray-300">{stat.label}</div>
                          <div className="text-xs text-green-400">{stat.trend}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-6">
                    {/* Chart Preview */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-lg font-semibold text-gray-900">Revenue Growth</div>
                        <div className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                          +45% This Month
                        </div>
                      </div>
                      <div className="h-32 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                        {/* Simple Chart Visualization */}
                        <div className="flex items-end h-full space-x-2">
                          {[40, 60, 80, 100, 120, 140, 160].map((height, idx) => (
                            <div
                              key={idx}
                              className={`flex-1 rounded-t-lg transition-all duration-300 hover:opacity-80 ${
                                idx % 2 === 0 
                                  ? 'bg-gradient-to-t from-blue-500 to-blue-400' 
                                  : 'bg-gradient-to-t from-purple-500 to-purple-400'
                              }`}
                              style={{ height: `${height}px` }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Recent Activity */}
                    <div>
                      <div className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</div>
                      <div className="space-y-3">
                        {[
                          { icon: '📱', text: 'Mobile app installed', time: '2 min ago', color: 'bg-blue-100 text-blue-600' },
                          { icon: '💰', text: 'New order placed', time: '5 min ago', color: 'bg-green-100 text-green-600' },
                          { icon: '📈', text: 'Revenue milestone achieved', time: '10 min ago', color: 'bg-purple-100 text-purple-600' },
                        ].map((activity, idx) => (
                          <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.color} mr-3`}>
                              {activity.icon}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{activity.text}</div>
                              <div className="text-sm text-gray-500">{activity.time}</div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Mobile Preview */}
                <div className="absolute -bottom-8 -right-8 transform hover:scale-110 transition-transform duration-300">
                  <div className="relative bg-gray-900 rounded-3xl p-3 shadow-2xl border-2 border-white">
                    {/* Mobile Notch */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-5 bg-gray-900 rounded-b-xl"></div>
                    
                    {/* Mobile Screen */}
                    <div className="bg-white rounded-2xl w-40 h-80 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
                        <div className="text-center text-sm font-bold">Mobile App</div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg"></div>
                          <div className="ml-3">
                            <div className="font-medium text-gray-900">Order #1234</div>
                            <div className="text-xs text-gray-500">Successfully placed</div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="h-2 bg-gray-200 rounded-full"></div>
                          <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Badge */}
                <div className="absolute -top-4 -left-4">
                  <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    <span className="text-sm font-semibold">Live Preview</span>
                  </div>
                </div>
              </div>
              
              {/* Callout Cards */}
              <div className="absolute -left-20 top-1/4 hidden xl:block">
                <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 w-64 transform -rotate-3">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                    <div className="font-semibold text-gray-900">30-Day Delivery</div>
                  </div>
                  <div className="text-sm text-gray-600">Get your complete solution in just 30 days</div>
                </div>
              </div>
              
              <div className="absolute -right-20 bottom-1/4 hidden xl:block">
                <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 w-64 transform rotate-3">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                      <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <div className="font-semibold text-gray-900">100% Secure</div>
                  </div>
                  <div className="text-sm text-gray-600">Enterprise-grade security & SSL</div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex flex-col items-center animate-bounce">
              <ChevronDown className="w-6 h-6 text-gray-400" />
              <span className="text-sm text-gray-500 mt-2">Scroll to explore</span>
            </div>
          </div>
        </div>
      </section>
      

        <section id="showcase" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold mb-4">
              📱 App Showcase
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              See Our{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Solutions in Action
              </span>
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto mb-10">
              Preview how your web app, mobile app, and admin dashboard will look and function
            </p>
          </div>

          {/* Showcase Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { id: 'web', label: 'Web App', icon: <Monitor className="w-5 h-5" /> },
              { id: 'mobile', label: 'Mobile App', icon: <Smartphone className="w-5 h-5" /> },
              { id: 'cms', label: 'CMS Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
              { id: 'catalog', label: 'Catalog System', icon: <ShoppingBag className="w-5 h-5" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveShowcase(tab.id);
                  setAutoRotate(false);
                }}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
                  activeShowcase === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Auto-rotate control */}
          <div className="flex items-center justify-center mb-8">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {autoRotate ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause Auto-rotate
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Play Auto-rotate
                </>
              )}
            </button>
          </div>

          {/* Showcase Content */}
          <div className="relative">
            {/* Web App Showcase */}
            {activeShowcase === 'web' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Modern Web Application</h3>
                  <p className="text-gray-600 mb-6">
                    Responsive web applications that work seamlessly on all devices. 
                    Built with React, Tailwind CSS, and modern frameworks for optimal performance.
                  </p>
                  <div className="space-y-4 mb-8">
                    {[
                      'Responsive design for all screen sizes',
                      'Fast loading with optimized assets',
                      'SEO-friendly structure',
                      'User-friendly navigation',
                      'Secure payment integration',
                      'Real-time updates'
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all">
                    View Web Demo
                  </button>
                </div>
                
                <div className="relative">
                  {/* Web Browser Frame */}
                  <div className="bg-gray-800 rounded-t-xl p-3 shadow-2xl">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="flex-1 bg-gray-700 rounded px-4 py-2 text-gray-300 text-sm">
                        https://yourbusiness.rmtechsolution.com
                      </div>
                    </div>
                    
                    {/* Web App Mockup */}
                    <div className="bg-white rounded-lg overflow-hidden">
                      {/* Header */}
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
                        <div className="flex justify-between items-center">
                          <div className="text-xl font-bold">Business Store</div>
                          <div className="flex items-center space-x-4">
                            <HomeIcon className="w-5 h-5" />
                            <ShoppingBag className="w-5 h-5" />
                            <CartIcon className="w-5 h-5" />
                            <User className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Hero Section */}
                      <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Our Store</h2>
                        <p className="text-gray-600 mb-4">Discover amazing products at great prices</p>
                        <div className="flex space-x-2">
                          <div className="flex-1 h-10 bg-gray-200 rounded"></div>
                          <div className="w-20 h-10 bg-blue-600 rounded flex items-center justify-center text-white">
                            <Search className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Products Grid */}
                      <div className="p-6">
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-gray-100 rounded-lg p-4">
                              <div className="h-24 bg-gradient-to-r from-blue-400 to-purple-400 rounded mb-2"></div>
                              <div className="h-3 bg-gray-300 rounded mb-2"></div>
                              <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Featured Section */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-4 text-white">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-bold">Featured Product</div>
                              <div className="text-sm">Limited time offer</div>
                            </div>
                            <div className="px-4 py-2 bg-white text-blue-600 rounded-lg font-bold">
                              Shop Now
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile App Showcase */}
            {activeShowcase === 'mobile' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Native Mobile Applications</h3>
                  <p className="text-gray-600 mb-6">
                    iOS and Android apps with native performance. Push notifications, 
                    offline capabilities, and seamless user experience.
                  </p>
                  <div className="space-y-4 mb-8">
                    {[
                      'Native iOS & Android apps',
                      'Push notifications',
                      'Offline functionality',
                      'Camera & GPS integration',
                      'App Store ready',
                      'Cross-platform support'
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-4">
                    <button className="px-6 py-3 bg-black text-white rounded-xl hover:shadow-lg transition-all flex items-center">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.31-2.33 1.05-3.11z"/>
                      </svg>
                      iOS App
                    </button>
                    <button className="px-6 py-3 bg-green-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4483-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993 0 .5511-.4483.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-1.6747 2.8997C16.5901 7.0889 15.8533 7 15.047 7c-2.17 0-3.8732 1.2954-4.5487 3.2425C9.8262 8.2954 8.123 7 5.953 7c-.8063 0-1.5431.0889-2.2223.2566l-1.6747-2.8997a.416.416 0 00-.5676-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.4355 8.7354 2 9.8857 2 11.1589 2 15.6246 5.4354 19 9.9062 19c.8063 0 1.6116-.135 2.3808-.3376.6236-.1692 1.2089-.1692 1.8325 0 .7692.2026 1.5745.3376 2.3808.3376C18.5646 19 22 15.6246 22 11.1589c0-1.2732-.4355-2.4235-1.1185-3.8375"/>
                      </svg>
                      Android App
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  {/* Mobile Frame */}
                  <div className="relative bg-gray-900 rounded-3xl p-3 shadow-2xl w-72">
                    {/* Mobile Notch */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl"></div>
                    
                    {/* Mobile Screen */}
                    <div className="bg-white rounded-2xl overflow-hidden h-[500px]">
                      {/* Status Bar */}
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3">
                        <div className="flex justify-between items-center text-sm">
                          <div>9:41</div>
                          <div className="flex items-center space-x-1">
                            <div className="w-4 h-1 bg-white/80 rounded-full"></div>
                            <div className="w-4 h-1 bg-white/80 rounded-full"></div>
                            <div className="w-4 h-1 bg-white/80 rounded-full"></div>
                            <div className="w-4 h-1 bg-white/80 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* App Content */}
                      <div className="p-4">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                          <div className="text-xl font-bold text-gray-900">My Store</div>
                          <div className="flex items-center space-x-3">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <CartIcon className="w-5 h-5 text-gray-600" />
                          </div>
                        </div>
                        
                        {/* Search */}
                        <div className="flex items-center bg-gray-100 rounded-lg p-3 mb-6">
                          <Search className="w-5 h-5 text-gray-400 mr-2" />
                          <div className="text-gray-400">Search products...</div>
                        </div>
                        
                        {/* Categories */}
                        <div className="flex overflow-x-auto space-x-3 mb-6 pb-2">
                          {['All', 'Popular', 'New', 'Sale', 'Featured'].map((cat, idx) => (
                            <div
                              key={idx}
                              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                                idx === 0
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {cat}
                            </div>
                          ))}
                        </div>
                        
                        {/* Products */}
                        <div className="space-y-4">
                          {[1, 2].map((i) => (
                            <div key={i} className="flex bg-gray-50 rounded-xl p-3">
                              <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg mr-4"></div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 mb-1">Product Name</div>
                                <div className="text-sm text-gray-500 mb-2">Category • 4.5 ⭐</div>
                                <div className="flex justify-between items-center">
                                  <div className="font-bold text-blue-600">₹1,299</div>
                                  <div className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">
                                    Cart
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Bottom Navigation */}
                        <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-3">
                          <div className="flex justify-around">
                            {[
                              { icon: <HomeIcon className="w-6 h-6" />, label: 'Home' },
                              { icon: <ShoppingBag className="w-6 h-6" />, label: 'Shop' },
                              { icon: <CartIcon className="w-6 h-6" />, label: 'Cart' },
                              { icon: <User className="w-6 h-6" />, label: 'Profile' }
                            ].map((item, idx) => (
                              <div key={idx} className="flex flex-col items-center">
                                <div className={`${idx === 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                                  {item.icon}
                                </div>
                                <div className={`text-xs ${idx === 0 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                                  {item.label}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Home Button */}
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-700 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}

            {/* CMS Dashboard Showcase */}
            {activeShowcase === 'cms' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Powerful CMS Dashboard</h3>
                  <p className="text-gray-600 mb-6">
                    Complete content management system with intuitive interface. 
                    Manage posts, users, media, and settings with ease.
                  </p>
                  <div className="space-y-4 mb-8">
                    {[
                      'Drag & drop content editor',
                      'User role management',
                      'Media library with uploads',
                      'SEO optimization tools',
                      'Analytics dashboard',
                      'Scheduled publishing'
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
                  >
                    Try CMS Demo
                  </button>
                </div>
                
                <div className="relative">
                  {/* CMS Dashboard Frame */}
                  <div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
                    {/* Top Bar */}
                    <div className="bg-gray-800 p-4 flex justify-between items-center">
                      <div className="text-white font-bold">RM Tech Solution</div>
                      <div className="flex items-center space-x-4">
                        <Bell className="w-5 h-5 text-gray-300" />
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                          A
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex">
                      {/* Sidebar */}
                      <div className="w-16 bg-gray-800 min-h-[400px] py-4">
                        {[
                          { icon: <LayoutDashboard className="w-5 h-5" /> },
                          { icon: <FileText className="w-5 h-5" /> },
                          { icon: <ShoppingBag className="w-5 h-5" /> },
                          { icon: <Image className="w-5 h-5" /> },
                          { icon: <Users className="w-5 h-5" /> },
                          { icon: <SettingsIcon className="w-5 h-5" /> }
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center justify-center p-3 ${
                              idx === 0
                                ? 'text-blue-400 border-r-2 border-blue-400'
                                : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            {item.icon}
                          </div>
                        ))}
                      </div>
                      
                      {/* Main Content */}
                      <div className="flex-1 bg-gray-900 p-6">
                        <div className="mb-6">
                          <h2 className="text-xl font-bold text-white mb-2">Dashboard Overview</h2>
                          <div className="text-gray-400">Welcome back, Admin</div>
                        </div>
                        
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          {[
                            { label: 'Total Posts', value: '1,234', color: 'bg-blue-500' },
                            { label: 'Active Users', value: '567', color: 'bg-green-500' },
                            { label: 'Media Files', value: '8,901', color: 'bg-purple-500' },
                            { label: 'Categories', value: '23', color: 'bg-yellow-500' }
                          ].map((stat, idx) => (
                            <div key={idx} className="bg-gray-800 rounded-lg p-4">
                              <div className="text-gray-400 text-sm mb-1">{stat.label}</div>
                              <div className="text-2xl font-bold text-white">{stat.value}</div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Recent Activity */}
                        <div className="bg-gray-800 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                          <div className="space-y-3">
                            {[
                              'New post created: "Summer Sale 2024"',
                              'User "John Doe" registered',
                              'Media upload: 5 images added',
                              'Settings updated: SEO configuration'
                            ].map((activity, idx) => (
                              <div key={idx} className="flex items-center text-gray-300 text-sm">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                {activity}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Catalog System Showcase */}
            {activeShowcase === 'catalog' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Advanced Catalog System</h3>
                  <p className="text-gray-600 mb-6">
                    Complete product catalog management with inventory tracking, 
                    variant management, and bulk operations.
                  </p>
                  <div className="space-y-4 mb-8">
                    {[
                      'Unlimited product categories',
                      'Inventory management',
                      'Product variants & options',
                      'Bulk import/export',
                      'Advanced filtering',
                      'Order management'
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                    <button
                      onClick={() => navigate('/dashboard/catalogue')}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                      View Catalog Demo
                    </button>
                  </div>
                  
                  <div className="relative">
                    {/* Catalog Dashboard Frame */}
                    <div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
                      {/* Top Bar */}
                      <div className="bg-gray-800 p-4 flex justify-between items-center">
                        <div className="text-white font-bold">Product Catalog</div>
                        <div className="flex items-center space-x-4">
                          <div className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                            + Add Product
                          </div>
                          <Filter className="w-5 h-5 text-gray-300" />
                        </div>
                      </div>
                      
                      {/* Catalog Content */}
                      <div className="p-6">
                        {/* Filters */}
                        <div className="flex space-x-4 mb-6">
                          <div className="flex-1 bg-gray-800 rounded-lg p-3">
                            <div className="text-gray-400 text-sm mb-2">Search Products</div>
                            <div className="flex items-center">
                              <Search className="w-5 h-5 text-gray-500 mr-2" />
                              <div className="text-gray-500">Type to search...</div>
                            </div>
                          </div>
                          <div className="w-48 bg-gray-800 rounded-lg p-3">
                            <div className="text-gray-400 text-sm mb-2">Category</div>
                            <div className="text-gray-300">All Products</div>
                          </div>
                        </div>
                        
                        {/* Products Table */}
                        <div className="bg-gray-800 rounded-lg overflow-hidden">
                          {/* Table Header */}
                          <div className="grid grid-cols-12 gap-4 p-4 bg-gray-700 text-gray-300 text-sm">
                            <div className="col-span-1">#</div>
                            <div className="col-span-4">Product Name</div>
                            <div className="col-span-2">Category</div>
                            <div className="col-span-2">Price</div>
                            <div className="col-span-2">Stock</div>
                            <div className="col-span-1">Actions</div>
                          </div>
                          
                          {/* Table Rows */}
                          <div className="divide-y divide-gray-700">
                            {[
                              { name: 'Premium Laptop', category: 'Electronics', price: '₹89,999', stock: '12' },
                              { name: 'Wireless Headphones', category: 'Audio', price: '₹7,499', stock: '45' },
                              { name: 'Fitness Tracker', category: 'Wearables', price: '₹3,999', stock: '89' },
                              { name: 'Smart Watch', category: 'Wearables', price: '₹12,999', stock: '23' }
                            ].map((product, idx) => (
                              <div key={idx} className="grid grid-cols-12 gap-4 p-4 text-gray-300 hover:bg-gray-750">
                                <div className="col-span-1">{idx + 1}</div>
                                <div className="col-span-4 flex items-center">
                                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded mr-3"></div>
                                  {product.name}
                                </div>
                                <div className="col-span-2">
                                  <span className="px-2 py-1 bg-gray-700 rounded text-xs">{product.category}</span>
                                </div>
                                <div className="col-span-2 font-medium">{product.price}</div>
                                <div className="col-span-2">
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    parseInt(product.stock) > 20
                                      ? 'bg-green-900 text-green-300'
                                      : 'bg-yellow-900 text-yellow-300'
                                  }`}>
                                    {product.stock} in
                                  </span>
                                </div>
                                <div className="col-span-1 flex space-x-2">
                                  <button className="text-blue-400 hover:text-blue-300">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button className="text-green-400 hover:text-green-300">
                                    <FileText className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Pagination */}
                        <div className="flex justify-between items-center mt-6 text-gray-400">
                          <div>Showing 1-4 of 128 products</div>
                          <div className="flex space-x-2">
                            <button className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700">←</button>
                            <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
                            <button className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700">2</button>
                            <button className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700">3</button>
                            <button className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700">→</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
             
            )}
          </div>
          
          {/* Platform Support */}
          <div className="mt-16 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Full Platform Support</h3>
              <p className="text-gray-600">All solutions work seamlessly across devices</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: <Monitor className="w-8 h-8" />, label: 'Web', description: 'Desktop & Tablet' },
                { icon: <Smartphone className="w-8 h-8" />, label: 'Mobile', description: 'iOS & Android' },
                { icon: <TabletSmartphone className="w-8 h-8" />, label: 'Responsive', description: 'All Screen Sizes' },
                { icon: <Cloud className="w-8 h-8" />, label: 'Cloud', description: '24/7 Availability' }
              ].map((platform, idx) => (
                <div key={idx} className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="inline-flex p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white mb-4">
                    {platform.icon}
                  </div>
                  <div className="font-semibold text-gray-900">{platform.label}</div>
                  <div className="text-sm text-gray-500">{platform.description}</div>
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

        {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-6">
              🚀 2x Your Business Growth
            </span>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="block text-gray-900">Digital Solutions for</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Small Businesses
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Transform your business with custom web & mobile apps. From ₹1 Lakh - Get a professional online presence that drives growth and increases revenue.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-xl text-lg font-semibold flex items-center justify-center shadow-lg transition-all"
              >
                Start Free CMS Demo <ArrowRight className="ml-3 w-5 h-5" />
              </button>
              <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:border-blue-600 hover:text-blue-600 text-lg font-semibold transition-all">
                <a href="#pricing" className="flex items-center justify-center">
                  View Pricing <ChevronRight className="ml-2 w-5 h-5" />
                </a>
              </button>
            </div>

             {/* Success Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {successMetrics.map((metric, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white mb-3`}>
                    {metric.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{metric.metric}</div>
                  <div className="text-gray-600 text-sm">{metric.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

        {/* Industries We Serve */}
      <section id="industries" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-semibold mb-4">
              🏢 Industries We Serve
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Solutions for{' '}
              <span className="bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent">
                Every Business
              </span>
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">
              Custom digital solutions tailored for your industry needs
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="group relative"
              >
                <div className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${industry.color} mb-4`}>
                    <div className="text-white">{industry.icon}</div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{industry.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold mb-4">
              ⚡ Our Services
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Complete{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Digital Solutions
              </span>
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">
              End-to-end development services for your business growth
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative"
              >
                <div className="relative bg-white p-8 rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${service.color} mb-6`}>
                    <div className="text-white">{service.icon}</div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <div className={`w-12 h-1 bg-gradient-to-r ${service.color} rounded-full`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

        {/* Pricing Plans */}
      <section id="pricing" className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-600 rounded-full text-sm font-semibold mb-4">
              💰 Transparent Pricing
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choose Your{' '}
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Growth Plan
              </span>
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">
              Start with a basic website or get a complete digital ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative ${
                  plan.highlight
                    ? 'scale-105 shadow-2xl border-2 border-purple-500'
                    : 'shadow-lg'
                } bg-white rounded-3xl overflow-hidden`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 text-sm font-semibold">
                    🏆 Most Popular
                  </div>
                )}
                
                <div className="p-8 pt-12">
                  <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${plan.color} text-white text-sm font-semibold mb-4`}>
                    {plan.name}
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-5xl font-bold text-gray-900">{plan.price}</div>
                    <p className="text-gray-600 mt-2">{plan.description}</p>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        ) : (
                          <Close className="w-5 h-5 text-gray-300 mr-3 flex-shrink-0" />
                        )}
                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => navigate('/login')}
                    className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                      plan.highlight
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {plan.highlight ? 'Start Business Plan' : 'Get Started'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Need a custom solution?{' '}
              <a href="#contact" className="text-blue-600 font-semibold hover:underline">
                Contact us for a custom quote
              </a>
            </p>
          </div>
        </div>
      </section>

       {/* Our Process */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
              🔄 Our Process
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How We{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Work Together
              </span>
            </h2>
          </div>
          
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform -translate-y-1/2"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
              {processSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl font-bold mb-4`}>
                      {step.step}
                    </div>
                    <div className="text-blue-600 mb-3 mx-auto w-12 h-12 flex items-center justify-center">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      
      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-pink-100 text-pink-600 rounded-full text-sm font-semibold mb-4">
              🎨 Our Work
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Success{' '}
              <span className="bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
                Stories
              </span>
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">
              See how we've helped businesses transform digitally
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portfolioProjects.map((project, index) => (
              <div
                key={index}
                className="group relative"
              >
                <div className="relative bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <div className={`h-3 bg-gradient-to-r ${project.color}`}></div>
                  <div className="p-8">
                    <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${project.color} bg-opacity-10 text-gray-700 text-xs font-semibold mb-4`}>
                      {project.category}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{project.title}</h3>
                    <p className="text-gray-600 mb-6">{project.description}</p>
                    
                    <div className="space-y-3">
                      {project.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center">
                          <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8">
                      <span className="text-sm text-gray-500">Result:</span>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                        <span className="font-semibold text-green-600">2.5x revenue growth</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:border-blue-600 hover:text-blue-600 text-lg font-semibold transition-all">
              View More Case Studies
            </button>
          </div>
        </div>
      </section>

       {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold mb-4">
              ❓ FAQs
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Common{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600">
              Still have questions?{' '}
              <a href="#contact" className="text-blue-600 font-semibold hover:underline">
                Contact our team
              </a>
            </p>
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

  
      {/* CTA Section (Enhanced) */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-12 text-center">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-40 h-40 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-40 h-40 bg-white/10 rounded-full"></div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 relative z-10">
              Ready to 2X Your Business?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto relative z-10">
              Join 50+ businesses that have transformed with RM Tech Solution
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-white text-blue-600 rounded-2xl hover:shadow-2xl text-lg font-semibold flex items-center justify-center shadow-lg transition-all"
              >
                Start Free Trial <ArrowRight className="ml-3 w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-2xl hover:bg-white/10 text-lg font-semibold transition-all">
                <a href="#contact" className="flex items-center justify-center">
                  <Video className="mr-3 w-5 h-5" />
                  Book Free Consultation
                </a>
              </button>
            </div>
            
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-blue-100">Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-blue-100">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">99.9%</div>
                <div className="text-blue-100">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">2X</div>
                <div className="text-blue-100">Growth Guarantee</div>
              </div>
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
                {/* <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                  <Sparkles className="w-6 h-6 text-white" />
                </div> */}
                  <img 
                  src={require('../assets/logo4.png')}
                  className="object-cover"
                  style={{  height: '90px',width: '200px' }}
                />
                {/* <div>
                  <span className="text-2xl font-bold">RM Tech</span>
                  <span className="block text-sm text-gray-400">Solution</span>
                </div> */}
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