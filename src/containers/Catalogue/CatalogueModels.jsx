
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  Database,
  ShoppingBag,
  Package,
  Layers,
  Settings,
  Download,
  Upload,
  Filter,
  Search,
  Grid,
  List,
  Star,
  Tag,
  Hash,
  Palette,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  MoreVertical,
  ChevronRight
} from 'lucide-react';

const CatalogueModels = () => {
//   const dispatch = useAppDispatch();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    setLoading(true);
    try {
      // Mock data - in real app, fetch from API
      const mockModels = [
        {
          id: 1,
          name: 'Electronics',
          slug: 'electronics',
          description: 'Electronic devices and accessories',
          icon: '💻',
          itemCount: 245,
          fields: [
            { name: 'Product Name', type: 'string', required: true },
            { name: 'Brand', type: 'string', required: true },
            { name: 'Model', type: 'string', required: false },
            { name: 'SKU', type: 'string', required: true, unique: true },
            { name: 'Price', type: 'number', required: true },
            { name: 'Stock', type: 'number', required: true },
            { name: 'Specifications', type: 'json', required: false },
            { name: 'Images', type: 'gallery', required: false },
            { name: 'Warranty', type: 'text', required: false },
            { name: 'Features', type: 'array', required: false },
          ],
          status: 'active',
          createdAt: '2024-01-15',
          updatedAt: '2024-01-20',
        },
        {
          id: 2,
          name: 'Clothing',
          slug: 'clothing',
          description: 'Fashion and apparel items',
          icon: '👕',
          itemCount: 128,
          fields: [
            { name: 'Product Name', type: 'string', required: true },
            { name: 'Brand', type: 'string', required: true },
            { name: 'Size', type: 'string', required: true },
            { name: 'Color', type: 'string', required: true },
            { name: 'Material', type: 'string', required: false },
            { name: 'Price', type: 'number', required: true },
            { name: 'Stock', type: 'number', required: true },
            { name: 'Images', type: 'gallery', required: true },
            { name: 'Care Instructions', type: 'text', required: false },
          ],
          status: 'active',
          createdAt: '2024-01-10',
          updatedAt: '2024-01-18',
        },
        {
          id: 3,
          name: 'Books',
          slug: 'books',
          description: 'Books and publications',
          icon: '📚',
          itemCount: 89,
          fields: [
            { name: 'Title', type: 'string', required: true },
            { name: 'Author', type: 'string', required: true },
            { name: 'ISBN', type: 'string', required: true, unique: true },
            { name: 'Publisher', type: 'string', required: false },
            { name: 'Publication Date', type: 'date', required: false },
            { name: 'Pages', type: 'number', required: false },
            { name: 'Price', type: 'number', required: true },
            { name: 'Stock', type: 'number', required: true },
            { name: 'Cover Image', type: 'image', required: true },
            { name: 'Description', type: 'text', required: true },
          ],
          status: 'active',
          createdAt: '2024-01-05',
          updatedAt: '2024-01-15',
        },
        {
          id: 4,
          name: 'Furniture',
          slug: 'furniture',
          description: 'Home and office furniture',
          icon: '🛋️',
          itemCount: 56,
          fields: [
            { name: 'Product Name', type: 'string', required: true },
            { name: 'Dimensions', type: 'string', required: true },
            { name: 'Material', type: 'string', required: true },
            { name: 'Color', type: 'string', required: true },
            { name: 'Assembly Required', type: 'boolean', required: false },
            { name: 'Weight', type: 'number', required: false },
            { name: 'Price', type: 'number', required: true },
            { name: 'Stock', type: 'number', required: true },
            { name: 'Images', type: 'gallery', required: true },
            { name: 'Assembly Instructions', type: 'file', required: false },
          ],
          status: 'active',
          createdAt: '2024-01-12',
          updatedAt: '2024-01-19',
        },
      ];
      setModels(mockModels);
    } catch (error) {
      console.error('Error fetching models:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateModel = () => {
    setShowCreateModal(true);
  };

  const handleDeleteModel = (id) => {
    if (window.confirm('Are you sure you want to delete this catalogue model? All items will be lost.')) {
      setModels(models.filter(model => model.id !== id));
    }
  };

  const handleDuplicateModel = (model) => {
    const duplicated = {
      ...model,
      id: Date.now(),
      name: `${model.name} (Copy)`,
      slug: `${model.slug}-copy`,
      itemCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setModels([...models, duplicated]);
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
          <h1 className="text-3xl font-bold text-gray-900">Catalogue Models</h1>
          <p className="text-gray-600">Define structures for your products and items</p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Upload size={18} className="mr-2" />
            Import
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download size={18} className="mr-2" />
            Export
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{models.length}</div>
              <div className="text-gray-500">Total Models</div>
            </div>
            <Database className="text-blue-500" size={32} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">
                {models.reduce((sum, model) => sum + model.itemCount, 0)}
              </div>
              <div className="text-gray-500">Total Items</div>
            </div>
            <Package className="text-green-500" size={32} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">
                {models.reduce((sum, model) => sum + model.fields.length, 0)}
              </div>
              <div className="text-gray-500">Total Fields</div>
            </div>
            <Layers className="text-purple-500" size={32} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">
                {models.filter(m => m.status === 'active').length}
              </div>
              <div className="text-gray-500">Active Models</div>
            </div>
            <CheckCircle className="text-green-500" size={32} />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
              <Filter size={18} className="mr-2" />
              Filter
            </button>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Models Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map((model) => (
            <div
              key={model.id}
              className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="text-3xl mr-3">{model.icon}</div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{model.name}</h3>
                      <p className="text-sm text-gray-500">{model.slug}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    model.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {model.status}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{model.description}</p>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span>{model.fields.length} fields</span>
                    <span>{model.itemCount} items</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {model.fields.slice(0, 3).map((field, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        title={field.name}
                      >
                        {field.name}
                      </span>
                    ))}
                    {model.fields.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">
                        +{model.fields.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex space-x-2">
                    <Link
                      to={`/dashboard/catalogue/${model.slug}`}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Manage Items
                    </Link>
                    <button
                      onClick={() => setSelectedModel(model)}
                      className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      <Settings size={16} />
                    </button>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleDuplicateModel(model)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                      title="Duplicate"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteModel(model.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fields</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredModels.map((model) => (
                <tr key={model.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{model.icon}</div>
                      <div>
                        <div className="font-medium text-gray-900">{model.name}</div>
                        <div className="text-sm text-gray-500">{model.slug}</div>
                        <div className="text-sm text-gray-400">{model.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <span className="font-medium">{model.fields.length}</span> fields
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <span className="font-medium">{model.itemCount}</span> items
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      model.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {model.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {model.createdAt}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Link
                        to={`/dashboard/catalogue/${model.slug}`}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Manage
                      </Link>
                      <button
                        onClick={() => setSelectedModel(model)}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                      >
                        <Settings size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {filteredModels.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No catalogue models found</h3>
          <p className="text-gray-600 mb-6">Create your first catalogue model to start managing products</p>
          <button
            onClick={handleCreateModel}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} className="mr-2" />
            Create New Model
          </button>
        </div>
      )}

      {/* Create Model Modal */}
      {showCreateModal && (
        <CreateModelModal
          onClose={() => setShowCreateModal(false)}
          onCreate={(newModel) => {
            setModels([...models, newModel]);
            setShowCreateModal(false);
          }}
        />
      )}

      {/* Edit Model Modal */}
      {selectedModel && (
        <EditModelModal
          model={selectedModel}
          onClose={() => setSelectedModel(null)}
          onUpdate={(updatedModel) => {
            setModels(models.map(m => m.id === updatedModel.id ? updatedModel : m));
            setSelectedModel(null);
          }}
        />
      )}
    </div>
  );
};

// Create Model Modal Component
const CreateModelModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '📦',
    fields: [],
  });

  const icons = ['📦', '💻', '👕', '📚', '🛋️', '📱', '👟', '🎮', '🍽️', '🏷️', '🔧', '🎨', '🧴', '📷'];

  const fieldTypes = [
    { value: 'string', label: 'Text', icon: <Tag size={16} /> },
    { value: 'number', label: 'Number', icon: <Hash size={16} /> },
    { value: 'boolean', label: 'Yes/No', icon: <CheckCircle size={16} /> },
    { value: 'text', label: 'Long Text', icon: <Layers size={16} /> },
    { value: 'image', label: 'Image', icon: <ImageIcon size={16} /> },
    { value: 'gallery', label: 'Image Gallery', icon: <Grid size={16} /> },
    { value: 'price', label: 'Price', icon: <Star size={16} /> },
    { value: 'color', label: 'Color', icon: <Palette size={16} /> },
    { value: 'date', label: 'Date', icon: <Calendar size={16} /> },
    { value: 'file', label: 'File', icon: <Paperclip size={16} /> },
    { value: 'array', label: 'List', icon: <List size={16} /> },
    { value: 'json', label: 'JSON', icon: <Code size={16} /> },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newModel = {
      ...formData,
      id: Date.now(),
      itemCount: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onCreate(newModel);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Create Catalogue Model</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon
              </label>
              <div className="flex flex-wrap gap-2">
                {icons.map(icon => (
                  <button
                    type="button"
                    key={icon}
                    onClick={() => setFormData({...formData, icon})}
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
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., Electronics"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., electronics"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Describe what this model is used for..."
            />
          </div>
          
          <div className="pt-6 border-t">
            <h4 className="text-lg font-medium mb-4">Fields</h4>
            <div className="space-y-4">
              {formData.fields.map((field, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={field.name}
                      onChange={(e) => {
                        const newFields = [...formData.fields];
                        newFields[index].name = e.target.value;
                        setFormData({...formData, fields: newFields});
                      }}
                      className="w-full px-3 py-1 border border-gray-300 rounded"
                      placeholder="Field name"
                    />
                  </div>
                  <select
                    value={field.type}
                    onChange={(e) => {
                      const newFields = [...formData.fields];
                      newFields[index].type = e.target.value;
                      setFormData({...formData, fields: newFields});
                    }}
                    className="px-3 py-1 border border-gray-300 rounded"
                  >
                    {fieldTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const newFields = formData.fields.filter((_, i) => i !== index);
                      setFormData({...formData, fields: newFields});
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => setFormData({
                  ...formData,
                  fields: [...formData.fields, { name: '', type: 'string' }]
                })}
                className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-500"
              >
                + Add Field
              </button>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Model
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Model Modal (similar structure)
const EditModelModal = ({ model, onClose, onUpdate }) => {
  const [formData, setFormData] = useState(model);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      ...formData,
      updatedAt: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Edit Catalogue Model</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Similar form fields as CreateModelModal */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Model
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Missing icon components
const Calendar = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const Paperclip = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
  </svg>
);

const Code = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

export default CatalogueModels;