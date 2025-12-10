
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Save,
  X,
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Settings,
  Code,
  Eye,
  Palette,
  Hash,
  Calendar,
  CheckSquare,
  List,
  Paperclip,
  Grid,
  Star,
  Tag
} from 'lucide-react';

const CatalogueForm = () => {
  const { modelSlug, itemId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [model, setModel] = useState(null);
  const [item, setItem] = useState({});
  const [images, setImages] = useState([]);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    fetchModelAndItem();
  }, [modelSlug, itemId]);

  const fetchModelAndItem = async () => {
    setLoading(true);
    try {
      // Fetch model
      const mockModel = {
        id: 1,
        name: 'Electronics',
        slug: 'electronics',
        fields: [
          { name: 'Product Name', key: 'name', type: 'string', required: true },
          { name: 'Brand', key: 'brand', type: 'string', required: true },
          { name: 'SKU', key: 'sku', type: 'string', required: true, unique: true },
          { name: 'Price', key: 'price', type: 'price', required: true },
          { name: 'Compare Price', key: 'comparePrice', type: 'price', required: false },
          { name: 'Cost Price', key: 'costPrice', type: 'price', required: false },
          { name: 'Stock', key: 'stock', type: 'number', required: true },
          { name: 'Low Stock Threshold', key: 'lowStockThreshold', type: 'number', required: false },
          { name: 'Status', key: 'status', type: 'select', required: true, 
            options: ['active', 'draft', 'archived', 'out_of_stock'] 
          },
          { name: 'Category', key: 'category', type: 'string', required: true },
          { name: 'Tags', key: 'tags', type: 'array', required: false },
          { name: 'Images', key: 'images', type: 'gallery', required: true },
          { name: 'Description', key: 'description', type: 'richText', required: false },
          { name: 'Specifications', key: 'specifications', type: 'json', required: false },
          { name: 'Features', key: 'features', type: 'array', required: false },
          { name: 'Dimensions', key: 'dimensions', type: 'object', required: false },
          { name: 'Weight', key: 'weight', type: 'number', required: false },
          { name: 'Warranty', key: 'warranty', type: 'text', required: false },
          { name: 'SEO Title', key: 'seoTitle', type: 'string', required: false },
          { name: 'SEO Description', key: 'seoDescription', type: 'text', required: false },
          { name: 'SEO Keywords', key: 'seoKeywords', type: 'array', required: false },
        ],
      };
      setModel(mockModel);

      // Fetch item if editing
      if (itemId) {
        const mockItem = {
          id: parseInt(itemId),
          name: 'MacBook Pro 16"',
          brand: 'Apple',
          sku: 'MBP16-2024',
          price: 2499.99,
          comparePrice: 2799.99,
          costPrice: 2000.00,
          stock: 25,
          lowStockThreshold: 5,
          status: 'active',
          category: 'Laptops',
          tags: ['laptop', 'apple', 'pro', 'm3'],
          images: [
            'https://via.placeholder.com/600x600/3b82f6/ffffff?text=Front',
            'https://via.placeholder.com/600x600/10b981/ffffff?text=Back',
            'https://via.placeholder.com/600x600/8b5cf6/ffffff?text=Side',
          ],
          description: '<p>Professional laptop with M3 chip for ultimate performance.</p>',
          specifications: {
            processor: 'M3 Max',
            ram: '32GB',
            storage: '1TB SSD',
            display: '16.2" Liquid Retina XDR',
            graphics: '40-core GPU',
            battery: 'Up to 22 hours',
          },
          features: ['M3 Max chip', 'Liquid Retina XDR display', 'Up to 22-hour battery'],
          dimensions: { length: '35.57 cm', width: '24.81 cm', height: '1.68 cm' },
          weight: 2.1,
          warranty: '1 year limited warranty',
          seoTitle: 'Apple MacBook Pro 16" with M3 Chip - Ultimate Performance Laptop',
          seoDescription: 'Professional laptop with M3 chip, 32GB RAM, 1TB SSD. Perfect for developers and creatives.',
          seoKeywords: ['macbook', 'laptop', 'apple', 'm3', 'professional'],
          createdAt: '2024-01-15',
          updatedAt: '2024-01-20',
        };
        setItem(mockItem);
        setImages(mockItem.images || []);
      } else {
        // New item defaults
        const newItem = {
          name: '',
          brand: '',
          sku: '',
          price: 0,
          comparePrice: 0,
          costPrice: 0,
          stock: 0,
          lowStockThreshold: 10,
          status: 'draft',
          category: '',
          tags: [],
          images: [],
          description: '',
          specifications: {},
          features: [],
          dimensions: {},
          weight: 0,
          warranty: '',
          seoTitle: '',
          seoDescription: '',
          seoKeywords: [],
        };
        setItem(newItem);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...(item[field] || [])];
    newArray[index] = value;
    setItem(prev => ({ ...prev, [field]: newArray }));
  };

  const handleAddToArray = (field, defaultValue = '') => {
    setItem(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), defaultValue]
    }));
  };

  const handleRemoveFromArray = (field, index) => {
    const newArray = [...(item[field] || [])];
    newArray.splice(index, 1);
    setItem(prev => ({ ...prev, [field]: newArray }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
    }));
    setImages([...images, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleReorderImages = (fromIndex, toIndex) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setImages(newImages);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Validate required fields
      const requiredFields = model.fields.filter(f => f.required);
      const missingFields = requiredFields.filter(f => !item[f.key]);
      
      if (missingFields.length > 0) {
        alert(`Please fill in required fields: ${missingFields.map(f => f.name).join(', ')}`);
        setSaving(false);
        return;
      }

      // Prepare data
      const itemData = {
        ...item,
        images: images.map(img => img.preview || img),
        updatedAt: new Date().toISOString(),
      };

      if (itemId) {
        console.log('Updating item:', itemData);
        // Update API call
      } else {
        itemData.createdAt = new Date().toISOString();
        console.log('Creating item:', itemData);
        // Create API call
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(itemId ? 'Item updated successfully!' : 'Item created successfully!');
      navigate(`/dashboard/catalogue/${modelSlug}`);
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save item: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const renderFieldInput = (field) => {
    const value = item[field.key] || '';
    const fieldType = field.type || 'string';

    switch (fieldType) {
      case 'string':
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={`Enter ${field.name.toLowerCase()}`}
          />
        );

      case 'richText':
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={`Enter ${field.name.toLowerCase()}`}
          />
        );

      case 'number':
      case 'price':
        return (
          <input
            type="number"
            step={fieldType === 'price' ? '0.01' : '1'}
            value={value}
            onChange={(e) => handleInputChange(field.key, parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={`Enter ${field.name.toLowerCase()}`}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select {field.name.toLowerCase()}</option>
            {field.options?.map(option => (
              <option key={option} value={option}>
                {option.replace(/_/g, ' ').toUpperCase()}
              </option>
            ))}
          </select>
        );

      case 'boolean':
        return (
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleInputChange(field.key, e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            <span className="ml-2">Yes</span>
          </label>
        );

      case 'array':
        return (
          <div className="space-y-2">
            {(value || []).map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange(field.key, index, e.target.value)}
                  className="flex-1 px-3 py-1 border border-gray-300 rounded"
                  placeholder={`Enter ${field.name.toLowerCase()} item`}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFromArray(field.key, index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddToArray(field.key, '')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + Add {field.name.toLowerCase()} item
            </button>
          </div>
        );

      case 'json':
      case 'object':
        return (
          <textarea
            value={JSON.stringify(value, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleInputChange(field.key, parsed);
              } catch {
                // Keep as string if invalid JSON
                handleInputChange(field.key, e.target.value);
              }
            }}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            placeholder={`Enter ${field.name.toLowerCase()} as JSON`}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );

      case 'gallery':
        return (
          <div className="space-y-4">
            {/* Image Upload Area */}
            <label className="block">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="text-lg text-gray-600">Drop images here or click to upload</div>
                <div className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 10MB each</div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </label>

            {/* Image Gallery */}
            {images.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    {images.length} image{images.length !== 1 ? 's' : ''} uploaded
                  </span>
                  <button
                    type="button"
                    onClick={() => setImages([])}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove All
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="relative group border rounded-lg overflow-hidden"
                    >
                      <img
                        src={img.preview || img}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="p-1 bg-red-600 text-white rounded"
                            title="Remove"
                          >
                            <X size={14} />
                          </button>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => handleReorderImages(index, index - 1)}
                              className="p-1 bg-blue-600 text-white rounded"
                              title="Move Left"
                            >
                              <ArrowLeft size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="absolute top-1 right-1">
                        {index === 0 && (
                          <span className="px-1 py-0.5 text-xs bg-blue-600 text-white rounded">
                            Main
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={`Enter ${field.name.toLowerCase()}`}
          />
        );
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: <Tag size={18} /> },
    { id: 'pricing', label: 'Pricing & Stock', icon: <Hash size={18} /> },
    { id: 'media', label: 'Media', icon: <ImageIcon size={18} /> },
    { id: 'details', label: 'Details', icon: <List size={18} /> },
    { id: 'seo', label: 'SEO', icon: <LinkIcon size={18} /> },
    { id: 'advanced', label: 'Advanced', icon: <Settings size={18} /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return model?.fields
          .filter(f => ['name', 'brand', 'sku', 'category', 'status', 'description'].includes(f.key))
          .map(field => (
            <div key={field.key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {field.name} {field.required && <span className="text-red-500">*</span>}
              </label>
              {renderFieldInput(field)}
            </div>
          ));

      case 'pricing':
        return model?.fields
          .filter(f => ['price', 'comparePrice', 'costPrice', 'stock', 'lowStockThreshold'].includes(f.key))
          .map(field => (
            <div key={field.key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {field.name} {field.required && <span className="text-red-500">*</span>}
              </label>
              {renderFieldInput(field)}
            </div>
          ));

      case 'media':
        const mediaField = model?.fields.find(f => f.key === 'images');
        return mediaField ? (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {mediaField.name} {mediaField.required && <span className="text-red-500">*</span>}
            </label>
            {renderFieldInput(mediaField)}
          </div>
        ) : null;

      case 'details':
        return model?.fields
          .filter(f => ['specifications', 'features', 'dimensions', 'weight', 'warranty'].includes(f.key))
          .map(field => (
            <div key={field.key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {field.name} {field.required && <span className="text-red-500">*</span>}
              </label>
              {renderFieldInput(field)}
            </div>
          ));

      case 'seo':
        return model?.fields
          .filter(f => ['seoTitle', 'seoDescription', 'seoKeywords'].includes(f.key))
          .map(field => (
            <div key={field.key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {field.name} {field.required && <span className="text-red-500">*</span>}
              </label>
              {renderFieldInput(field)}
            </div>
          ));

      case 'advanced':
        const advancedFields = model?.fields.filter(f => 
          !['name', 'brand', 'sku', 'category', 'status', 'description', 
            'price', 'comparePrice', 'costPrice', 'stock', 'lowStockThreshold',
            'images', 'specifications', 'features', 'dimensions', 'weight', 'warranty',
            'seoTitle', 'seoDescription', 'seoKeywords'].includes(f.key)
        );
        return advancedFields?.map(field => (
          <div key={field.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.name} {field.required && <span className="text-red-500">*</span>}
            </label>
            {renderFieldInput(field)}
          </div>
        ));

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link
            to={`/dashboard/catalogue/${modelSlug}`}
            className="text-blue-600 hover:text-blue-800 mr-3"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {itemId ? `Edit ${model?.name} Item` : `Create New ${model?.name} Item`}
            </h1>
            <p className="text-gray-600">
              {itemId ? 'Update item details' : 'Add new item to your catalogue'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Tabs */}
        <div className="border-b">
          <nav className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              {renderTabContent()}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Status Card */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-medium text-gray-900 mb-3">Status</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Publication Status
                    </label>
                    <select
                      value={item.status || 'draft'}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={item.featured || false}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                      Featured Product
                    </label>
                  </div>
                </div>
              </div>

              {/* Organization Card */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-medium text-gray-900 mb-3">Organization</h3>
                <div className="space-y-3">
                  {model?.fields
                    .filter(f => ['category', 'tags'].includes(f.key))
                    .map(field => (
                      <div key={field.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.name}
                        </label>
                        {renderFieldInput(field)}
                      </div>
                    ))}
                </div>
              </div>

              {/* Actions Card */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-medium text-gray-900 mb-3">Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                  >
                    <Save size={16} className="mr-2" />
                    {saving ? 'Saving...' : (itemId ? 'Update Item' : 'Create Item')}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/dashboard/catalogue/${modelSlug}`)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  {itemId && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this item?')) {
                          // Handle delete
                          navigate(`/dashboard/catalogue/${modelSlug}`);
                        }
                      }}
                      className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                    >
                      Delete Item
                    </button>
                  )}
                </div>
              </div>

              {/* Preview Card */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-medium text-gray-900 mb-3">Preview</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">SKU:</span>
                    <span className="font-medium">{item.sku || 'Not set'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">${item.price?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Stock:</span>
                    <span className="font-medium">{item.stock || 0} units</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogueForm;