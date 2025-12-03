
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Image as ImageIcon
} from 'lucide-react';

const ContentItems = () => {
  const { modelSlug } = useParams();
  const [model, setModel] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModelAndItems();
  }, [modelSlug]);

  const loadModelAndItems = () => {
    // Load model
    const savedModels = localStorage.getItem('contentModels');
    if (savedModels) {
      const models = JSON.parse(savedModels);
      const foundModel = models.find(m => m.slug === modelSlug);
      setModel(foundModel);
      
      // Load items for this model
      const savedItems = localStorage.getItem(`contentItems_${modelSlug}`);
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      } else {
        // Create some sample items
        const sampleItems = createSampleItems(foundModel);
        setItems(sampleItems);
        localStorage.setItem(`contentItems_${modelSlug}`, JSON.stringify(sampleItems));
      }
    }
    setLoading(false);
  };

  const createSampleItems = (model) => {
    if (!model) return [];
    
    const sampleData = {
      'home-banners': [
        {
          id: 1,
          title: 'Welcome to RM Tech Solution',
          subtitle: 'Innovative technology solutions',
          image: 'https://via.placeholder.com/800x400/3b82f6/ffffff?text=Banner+1',
          buttonText: 'Get Started',
          buttonLink: '/contact',
          isActive: true,
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          title: 'Web Development Services',
          subtitle: 'Modern web applications',
          image: 'https://via.placeholder.com/800x400/10b981/ffffff?text=Banner+2',
          buttonText: 'Learn More',
          buttonLink: '/services',
          isActive: true,
          createdAt: '2024-01-14'
        }
      ],
      'testimonials': [
        {
          id: 1,
          customerName: 'John Smith',
          position: 'CTO',
          company: 'TechCorp',
          avatar: 'https://via.placeholder.com/100/3b82f6/ffffff?text=JS',
          rating: 5,
          text: 'Excellent service! Highly recommended.',
          featured: true,
          createdAt: '2024-01-15'
        }
      ],
      'services': [
        {
          id: 1,
          name: 'Web Development',
          icon: '💻',
          description: 'Custom web applications',
          features: ['React', 'Node.js', 'MongoDB'],
          price: 2999,
          order: 1,
          createdAt: '2024-01-15'
        }
      ]
    };

    return sampleData[model.slug] || [];
  };

  const handleDeleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const updatedItems = items.filter(item => item.id !== id);
      setItems(updatedItems);
      localStorage.setItem(`contentItems_${modelSlug}`, JSON.stringify(updatedItems));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Model not found</h3>
        <p className="text-gray-600 mb-6">The content model you're looking for doesn't exist.</p>
        <Link to="/content-models" className="text-blue-600 hover:text-blue-800">
          ← Back to Models
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <div className="flex items-center mb-2">
            <Link to="/content-models" className="text-blue-600 hover:text-blue-800 mr-3">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center">
              <div className="text-2xl mr-3">{model.icon}</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{model.name}</h1>
                <p className="text-gray-600">{model.singletonInApi ? 'Singleton Model' : 'Content Items'}</p>
              </div>
            </div>
          </div>
        </div>
        {!model.singletonInApi && (
          <Link
            to={`/content-models/${modelSlug}/create`}
            className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} className="mr-2" />
            New Item
          </Link>
        )}
      </div>

      {/* Singleton Model View */}
      {model.singletonInApi && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Singleton Configuration</h3>
          {items.length > 0 ? (
            <SingletonForm model={model} item={items[0]} />
          ) : (
            <SingletonForm model={model} />
          )}
        </div>
      )}

      {/* List View for non-singleton models */}
      {!model.singletonInApi && (
        <>
          {/* Search and Filter */}
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search items..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                <Filter size={18} className="mr-2" />
                Filter
              </button>
            </div>
          </div>

          {/* Items Grid/Table */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ID
                    </th>
                    {model.fields.slice(0, 3).map(field => (
                      <th key={field.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {field.name}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-500">#{item.id}</td>
                      {model.fields.slice(0, 3).map(field => (
                        <td key={field.key} className="px-6 py-4">
                          <FieldValue field={field} value={item[field.key]} />
                        </td>
                      ))}
                      <td className="px-6 py-4 text-gray-500">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-2" />
                          {item.createdAt}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {item.isActive !== undefined ? (
                          item.isActive ? (
                            <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                              <CheckCircle size={12} className="mr-1" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                              <XCircle size={12} className="mr-1" />
                              Inactive
                            </span>
                          )
                        ) : (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                            N/A
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Link
                            to={`/content-models/${modelSlug}/edit/${item.id}`}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const FieldValue = ({ field, value }) => {
  if (!value) return <span className="text-gray-400">-</span>;

  switch (field.type) {
    case 'image':
      return (
        <div className="flex items-center">
          <ImageIcon size={16} className="mr-2 text-gray-400" />
          <span className="text-sm text-gray-600">Image</span>
        </div>
      );
    case 'boolean':
      return value ? (
        <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
          ✓ Yes
        </span>
      ) : (
        <span className="inline-flex items-center px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
          ✗ No
        </span>
      );
    case 'color':
      return (
        <div className="flex items-center">
          <div
            className="w-4 h-4 rounded mr-2 border"
            style={{ backgroundColor: value }}
          />
          <span className="text-sm">{value}</span>
        </div>
      );
    case 'array':
      return (
        <span className="text-sm text-gray-600">
          {Array.isArray(value) ? `${value.length} items` : 'Array'}
        </span>
      );
    default:
      return (
        <span className="text-gray-900">
          {typeof value === 'string' && value.length > 30
            ? `${value.substring(0, 30)}...`
            : String(value)}
        </span>
      );
  }
};

const SingletonForm = ({ model, item }) => {
  const [formData, setFormData] = useState(item || {});

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field.key]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save to localStorage
    const items = [formData];
    localStorage.setItem(`contentItems_${model.slug}`, JSON.stringify(items));
    alert('Configuration saved successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {model.fields.map(field => (
        <div key={field.key} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {field.name} {field.required && <span className="text-red-500">*</span>}
          </label>
          <FieldInput
            field={field}
            value={formData[field.key] || field.defaultValue || ''}
            onChange={(value) => handleChange(field, value)}
          />
        </div>
      ))}
      <div className="pt-4">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save Configuration
        </button>
      </div>
    </form>
  );
};

const FieldInput = ({ field, value, onChange }) => {
  switch (field.type) {
    case 'text':
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          rows={4}
        />
      );
    case 'boolean':
      return (
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
          />
          <span className="ml-2">{field.name}</span>
        </label>
      );
    case 'image':
      return (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  onChange(reader.result);
                };
                reader.readAsDataURL(file);
              }
            }}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {value && (
            <div className="mt-2">
              <img src={value} alt="Preview" className="max-w-xs rounded-lg" />
            </div>
          )}
        </div>
      );
    case 'color':
      return (
        <div className="flex items-center space-x-4">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-12"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="#000000"
          />
        </div>
      );
    case 'array':
      return (
        <div>
          <input
            type="text"
            value={Array.isArray(value) ? value.join(', ') : ''}
            onChange={(e) => onChange(e.target.value.split(',').map(s => s.trim()))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Comma separated values"
          />
        </div>
      );
    case 'date':
      return (
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      );
    default:
      return (
        <input
          type={field.type === 'number' ? 'number' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          placeholder={`Enter ${field.name.toLowerCase()}`}
        />
      );
  }
};

export default ContentItems;