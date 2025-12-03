
import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  Code,
  Database,
  Layers,
  Search,
  Filter,
  Upload,
  Download,
  Palette,
  Image as ImageIcon,
  Text,
  CheckSquare,
  Type,
  Hash
} from 'lucide-react';

const ContentModels = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showJsonView, setShowJsonView] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Load models from localStorage
  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = () => {
    const savedModels = localStorage.getItem('contentModels');
    if (savedModels) {
      setModels(JSON.parse(savedModels));
    } else {
      // Default models
      const defaultModels = [
        {
          id: 1,
          name: 'Home Banners',
          slug: 'homeBanners',
          description: 'Manage hero banners for homepage',
          icon: '🎨',
          fields: [
            { id: 1, name: 'Banner Image', key: 'image', type: 'image', required: true },
            { id: 2, name: 'Title', key: 'title', type: 'text', required: true },
            { id: 3, name: 'Subtitle', key: 'subtitle', type: 'text', required: false },
            { id: 4, name: 'Button Text', key: 'buttonText', type: 'text', required: false },
            { id: 5, name: 'Button Link', key: 'buttonLink', type: 'text', required: false },
            { id: 6, name: 'Active', key: 'isActive', type: 'boolean', required: true, defaultValue: true }
          ]
        },
        {
          id: 2,
          name: 'Home Page Settings',
          slug: 'homePageSettings',
          description: 'Global settings for homepage',
          icon: '⚙️',
          singletonInApi: true,
          fields: [
            { id: 1, name: 'Top Left Icon', key: 'topLeftIcon', type: 'image', required: false },
            { id: 2, name: 'Bottom Right Icon', key: 'bottomRightIcon', type: 'image', required: false },
            { id: 3, name: 'Title', key: 'title', type: 'string', required: true },
            { id: 4, name: 'Description', key: 'description', type: 'text', required: true },
            { id: 5, name: 'Box Background', key: 'boxBackground', type: 'color', required: true, defaultValue: '#3b82f6' },
            { id: 6, name: 'Box Text', key: 'boxText', type: 'color', required: true, defaultValue: '#ffffff' },
            { id: 7, name: 'Favicon', key: 'favicon', type: 'image', required: false },
            { id: 8, name: 'Icon', key: 'icon', type: 'image', required: false },
            { id: 9, name: 'Button Title', key: 'buttonTitle', type: 'text', required: false },
            { id: 10, name: 'Button Path', key: 'buttonPath', type: 'text', required: false },
            { id: 11, name: 'Disable Button', key: 'disableButton', type: 'boolean', required: false, defaultValue: false }
          ]
        },
        {
          id: 3,
          name: 'Testimonials',
          slug: 'testimonials',
          description: 'Customer testimonials and reviews',
          icon: '💬',
          fields: [
            { id: 1, name: 'Customer Name', key: 'customerName', type: 'string', required: true },
            { id: 2, name: 'Position', key: 'position', type: 'string', required: false },
            { id: 3, name: 'Company', key: 'company', type: 'string', required: false },
            { id: 4, name: 'Avatar', key: 'avatar', type: 'image', required: false },
            { id: 5, name: 'Rating', key: 'rating', type: 'number', required: true, min: 1, max: 5 },
            { id: 6, name: 'Testimonial Text', key: 'text', type: 'text', required: true },
            { id: 7, name: 'Featured', key: 'featured', type: 'boolean', required: false }
          ]
        },
        {
          id: 4,
          name: 'Services',
          slug: 'services',
          description: 'List of services offered',
          icon: '🛠️',
          fields: [
            { id: 1, name: 'Service Name', key: 'name', type: 'string', required: true },
            { id: 2, name: 'Icon', key: 'icon', type: 'image', required: false },
            { id: 3, name: 'Description', key: 'description', type: 'text', required: true },
            { id: 4, name: 'Features', key: 'features', type: 'array', required: false, itemType: 'string' },
            { id: 5, name: 'Price', key: 'price', type: 'number', required: false },
            { id: 6, name: 'Display Order', key: 'order', type: 'number', required: true }
          ]
        }
      ];
      setModels(defaultModels);
      localStorage.setItem('contentModels', JSON.stringify(defaultModels));
    }
  };

  const saveModels = (updatedModels) => {
    localStorage.setItem('contentModels', JSON.stringify(updatedModels));
    setModels(updatedModels);
  };

  const handleCreateModel = () => {
    const newModel = {
      id: Date.now(),
      name: 'New Content Model',
      slug: 'new-content-model',
      description: '',
      icon: '📄',
      fields: []
    };
    setSelectedModel(newModel);
    setShowForm(true);
  };

  const handleEditModel = (model) => {
    setSelectedModel(model);
    setShowForm(true);
  };

  const handleDeleteModel = (id) => {
    if (window.confirm('Are you sure you want to delete this model? All associated content will be lost.')) {
      const updatedModels = models.filter(model => model.id !== id);
      saveModels(updatedModels);
      setSelectedModel(null);
    }
  };

  const handleDuplicateModel = (model) => {
    const duplicatedModel = {
      ...model,
      id: Date.now(),
      name: `${model.name} (Copy)`,
      slug: `${model.slug}-copy-${Date.now()}`
    };
    const updatedModels = [...models, duplicatedModel];
    saveModels(updatedModels);
  };

  const handleSaveModel = (updatedModel) => {
    const updatedModels = models.map(model => 
      model.id === updatedModel.id ? updatedModel : model
    );
    if (!models.find(m => m.id === updatedModel.id)) {
      updatedModels.push(updatedModel);
    }
    saveModels(updatedModels);
    setShowForm(false);
    setSelectedModel(null);
  };

  const handleExportJson = () => {
    const modelsForExport = models.map(({ id, icon, ...rest }) => rest);
    const jsonData = {
      models: modelsForExport,
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const dataStr = JSON.stringify(jsonData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'content-models.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportJson = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (importedData.models && Array.isArray(importedData.models)) {
          const importedModels = importedData.models.map((model, index) => ({
            ...model,
            id: Date.now() + index,
            icon: model.icon || '📄'
          }));
          saveModels([...models, ...importedModels]);
          alert(`Successfully imported ${importedModels.length} models`);
        } else {
          throw new Error('Invalid format');
        }
      } catch (error) {
        alert('Error importing JSON file. Please check the format.');
      }
    };
    reader.readAsText(file);
  };

  const fieldTypeIcons = {
    string: <Type size={16} className="text-blue-500" />,
    text: <Text size={16} className="text-green-500" />,
    number: <Hash size={16} className="text-purple-500" />,
    boolean: <CheckSquare size={16} className="text-red-500" />,
    image: <ImageIcon size={16} className="text-yellow-500" />,
    color: <Palette size={16} className="text-pink-500" />,
    array: <Layers size={16} className="text-indigo-500" />,
    date: <Calendar size={16} className="text-orange-500" />
  };

  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Models</h1>
          <p className="text-gray-600">Define and manage your content structures</p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <label className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <Upload size={18} className="mr-2" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </label>
          <button
            onClick={handleExportJson}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download size={18} className="mr-2" />
            Export JSON
          </button>
          <button
            onClick={handleCreateModel}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} className="mr-2" />
            New Model
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search models by name, description, or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <Filter size={18} className="mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map((model) => (
          <div
            key={model.id}
            className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">{model.icon}</div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{model.name}</h3>
                    <p className="text-sm text-gray-500">{model.slug}</p>
                  </div>
                </div>
                {model.singletonInApi && (
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                    Singleton
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-4">{model.description}</p>

              <div className="mb-4">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Database size={14} className="mr-2" />
                  <span>{model.fields.length} fields</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {model.fields.slice(0, 4).map((field, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                    >
                      {field.key}
                    </span>
                  ))}
                  {model.fields.length > 4 && (
                    <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">
                      +{model.fields.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditModel(model)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDuplicateModel(model)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    title="Duplicate"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={() => setSelectedModel(model)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                    title="View JSON"
                  >
                    <Code size={16} />
                  </button>
                </div>
                <button
                  onClick={() => handleDeleteModel(model.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredModels.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No content models found</h3>
          <p className="text-gray-600 mb-6">Create your first content model to get started</p>
          <button
            onClick={handleCreateModel}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} className="mr-2" />
            Create New Model
          </button>
        </div>
      )}

      {/* JSON View Modal */}
      {selectedModel && showJsonView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">JSON View: {selectedModel.name}</h3>
                <button
                  onClick={() => setShowJsonView(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 overflow-auto">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-[60vh]">
                {JSON.stringify(selectedModel, null, 2)}
              </pre>
            </div>
            <div className="p-6 border-t">
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => navigator.clipboard.writeText(JSON.stringify(selectedModel, null, 2))}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Copy JSON
                </button>
                <button
                  onClick={() => setShowJsonView(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Model Form Modal */}
      {showForm && (
        <ModelForm
          model={selectedModel}
          onSave={handleSaveModel}
          onCancel={() => {
            setShowForm(false);
            setSelectedModel(null);
          }}
        />
      )}
    </div>
  );
};

// Model Form Component
const ModelForm = ({ model, onSave, onCancel }) => {
  const [formData, setFormData] = useState(model || {
    id: Date.now(),
    name: '',
    slug: '',
    description: '',
    icon: '📄',
    singletonInApi: false,
    fields: []
  });

  const [newField, setNewField] = useState({
    name: '',
    key: '',
    type: 'string',
    required: false,
    defaultValue: ''
  });

  const fieldTypes = [
    { value: 'string', label: 'String', icon: <Type size={16} /> },
    { value: 'text', label: 'Text (Long)', icon: <Text size={16} /> },
    { value: 'number', label: 'Number', icon: <Hash size={16} /> },
    { value: 'boolean', label: 'Boolean', icon: <CheckSquare size={16} /> },
    { value: 'image', label: 'Image', icon: <ImageIcon size={16} /> },
    { value: 'color', label: 'Color', icon: <Palette size={16} /> },
    { value: 'array', label: 'Array', icon: <Layers size={16} /> },
    { value: 'date', label: 'Date', icon: <Calendar size={16} /> }
  ];

  const icons = ['📄', '🎨', '⚙️', '💬', '🛠️', '📊', '📱', '💻', '🌐', '🎯', '✨', '🔧', '📈'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFieldInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewField(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddField = () => {
    if (!newField.name || !newField.key) {
      alert('Field name and key are required');
      return;
    }

    const field = {
      id: Date.now(),
      name: newField.name,
      key: newField.key,
      type: newField.type,
      required: newField.required,
      defaultValue: newField.defaultValue
    };

    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, field]
    }));

    setNewField({
      name: '',
      key: '',
      type: 'string',
      required: false,
      defaultValue: ''
    });
  };

  const handleRemoveField = (id) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== id)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">
            {model ? 'Edit Content Model' : 'Create Content Model'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[70vh]">
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {icons.map(icon => (
                    <button
                      type="button"
                      key={icon}
                      onClick={() => setFormData(prev => ({ ...prev, icon }))}
                      className={`p-2 text-xl rounded-lg border ${
                        formData.icon === icon
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Home Banners"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., home-banners"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Describe what this model is used for..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="singletonInApi"
                name="singletonInApi"
                checked={formData.singletonInApi}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="singletonInApi" className="ml-2 text-sm text-gray-700">
                Singleton Model (Only one instance exists)
              </label>
            </div>

            {/* Fields Section */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-medium mb-4">Fields</h4>

              {/* Add New Field */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Field Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newField.name}
                      onChange={handleFieldInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="e.g., Banner Image"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Key
                    </label>
                    <input
                      type="text"
                      name="key"
                      value={newField.key}
                      onChange={handleFieldInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="e.g., bannerImage"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      name="type"
                      value={newField.type}
                      onChange={handleFieldInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      {fieldTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleAddField}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Add Field
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="required"
                      checked={newField.required}
                      onChange={handleFieldInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Required</span>
                  </label>
                  {newField.type !== 'boolean' && (
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Default Value
                      </label>
                      <input
                        type="text"
                        name="defaultValue"
                        value={newField.defaultValue}
                        onChange={handleFieldInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Optional"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Fields List */}
              <div className="space-y-3">
                {formData.fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center justify-between p-3 bg-white border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-gray-400">#{index + 1}</div>
                      <div>
                        <div className="font-medium">{field.name}</div>
                        <div className="text-sm text-gray-500">
                          {field.key} • {field.type}
                          {field.required && ' • Required'}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveField(field.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                {formData.fields.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    No fields added yet. Add your first field above.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="p-6 border-t">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {model ? 'Update Model' : 'Create Model'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Missing Calendar icon component
const Calendar = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

export default ContentModels;