
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';

const ContentItemForm = () => {
  const { modelSlug, itemId } = useParams();
  const navigate = useNavigate();
  const [model, setModel] = useState(null);
  const [item, setItem] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [modelSlug, itemId]);

  const loadData = () => {
    // Load model
    const savedModels = localStorage.getItem('contentModels');
    if (savedModels) {
      const models = JSON.parse(savedModels);
      const foundModel = models.find(m => m.slug === modelSlug);
      setModel(foundModel);
      
      // Load item if editing
      if (itemId) {
        const savedItems = localStorage.getItem(`contentItems_${modelSlug}`);
        if (savedItems) {
          const items = JSON.parse(savedItems);
          const foundItem = items.find(i => i.id === parseInt(itemId));
          setItem(foundItem || {});
        }
      }
    }
    setLoading(false);
  };

  const handleChange = (fieldKey, value) => {
    setItem(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (model) {
      const requiredFields = model.fields.filter(f => f.required);
      const missingFields = requiredFields.filter(f => !item[f.key]);
      
      if (missingFields.length > 0) {
        alert(`Please fill in required fields: ${missingFields.map(f => f.name).join(', ')}`);
        return;
      }
    }
    
    // Save item
    const savedItems = localStorage.getItem(`contentItems_${modelSlug}`);
    let items = savedItems ? JSON.parse(savedItems) : [];
    
    if (itemId) {
      // Update existing
      items = items.map(i => i.id === parseInt(itemId) ? { ...i, ...item } : i);
    } else {
      // Create new
      const newItem = {
        id: Date.now(),
        ...item,
        createdAt: new Date().toISOString().split('T')[0]
      };
      items.push(newItem);
    }
    
    localStorage.setItem(`contentItems_${modelSlug}`, JSON.stringify(items));
    navigate(`/content-models/${modelSlug}`);
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
        <Link to="/content-models" className="text-blue-600 hover:text-blue-800">
          ← Back to Models
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 md:px-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center mb-4">
          <Link
            to={`/content-models/${modelSlug}`}
            className="text-blue-600 hover:text-blue-800 mr-3 flex-shrink-0"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center min-w-0">
            <div className="text-xl sm:text-2xl mr-2 sm:mr-3 flex-shrink-0">{model.icon}</div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                {itemId ? `Edit ${model.name}` : `Create ${model.name}`}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                {itemId ? 'Update item details' : 'Add new content item'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 max-h-[90vh] overflow-y-auto space-y-6">
        {model.fields.map(field => (
          <div key={field.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.name} {field.required && <span className="text-red-500">*</span>}
            </label>
            <FieldInput
              field={field}
              value={item[field.key] || field.defaultValue || ''}
              onChange={(value) => handleChange(field.key, value)}
            />
          </div>
        ))}

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 pt-4 sm:pt-6 border-t sticky bottom-0 bg-white">
          <Link
            to={`/content-models/${modelSlug}`}
            className="px-4 sm:px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center sm:justify-start text-sm sm:text-base"
          >
            <X size={18} className="mr-2" />
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center sm:justify-start text-sm sm:text-base"
          >
            <Save size={18} className="mr-2" />
            {itemId ? 'Update Item' : 'Create Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

const FieldInput = ({ field, value, onChange }) => {
  // FieldInput component from previous code
  // (Use the same FieldInput component from ContentItems container)
};

export default ContentItemForm;