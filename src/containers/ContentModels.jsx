
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
import { addCMSData, fetchCMSData } from "../redux/actions/cmsActions"
import { useDispatch, useSelector } from "react-redux";


const ContentModels = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showJsonView, setShowJsonView] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const cmsData = useSelector((state) => state.cms.data);

  useEffect(() => {
    dispatch(fetchCMSData());
  }, [!showForm]);

  const convertCMSResponseToUI = (cmsArray) => {
    if (!cmsArray || !Array.isArray(cmsArray)) return [];

    return cmsArray.map((item, index) => {
      const fields = Object.values(item.cms || {}).map((field, i) => ({
        id: i + 1,
        name: field.fieldName,
        key: field.fieldKey,
        type: field.fieldType,
        value: field.fieldValue,
      }));

      return {
        id: index + 1,
        name: item.modelName,
        slug: item.modelSlug,
        description: "",
        icon: "📄",
        singletonInApi: Number(item.singletonModel) === 1,
        fields,
      };
    });
  };


  useEffect(() => {
    if (cmsData && cmsData.length > 0) {
      const list = convertCMSResponseToUI(cmsData);
      setModels(list);
    }
  }, [cmsData]);

  // Filter search
  const filteredModels = models.filter((model) =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

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
  const dispatch = useDispatch();

  const [formData, setFormData] = useState(model || {
    merchantId: "",
    modelName: "",
    modelSlug: "",
    description: "",
    icon: "📄",
    singletonModel: 0,
    fields: []
  });


  console.log(formData.fields, "formDataformDatahhhh");


  const [newField, setNewField] = useState({
    merchantId: "",
    modelName: "",
    modelSlug: "",
    fieldName: "",
    fieldKey: "",
    fieldType: "string",
    fieldValue: "",
    singletonModel: 0,
  });

  // Update Input Handler
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // auto-fill slug from modelName
    if (name === "modelName") {
      const generatedSlug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      setFormData(prev => ({
        ...prev,
        modelName: value,
        modelSlug: prev.modelSlug || generatedSlug
      }));

      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // New field input change
  const handleFieldInputChange = (e) => {
    const { name, value } = e.target;
    setNewField(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add Field
  const handleAddField = () => {
    if (!newField.fieldName || !newField.fieldKey) {
      alert("Field name & key required");
      return;
    }

    const field = {
      merchantId: formData.merchantId,
      modelName: formData.modelName,
      modelSlug: formData.modelSlug,
      singletonModel: formData.singletonModel ? 1 : 0,
      fieldName: newField.fieldName,
      fieldKey: newField.fieldKey,
      fieldType: newField.fieldType,
      fieldValue: newField.fieldValue
    };

    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, field]
    }));

    setNewField({
      fieldName: "",
      fieldKey: "",
      fieldType: "string",
      fieldValue: ""
    });
  };


  // Remove Field
  const handleRemoveField = (id) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(f => f.id !== id)
    }));
  };

  // ✅ Convert form data into EXACT API FORMAT
  const createApiPayload = () => {
    return formData.fields.map(field => ({
      merchantId: Number(formData.merchantId),
      modelSlug: formData.modelSlug,
      modelName: formData.modelName,
      fieldName: field.fieldName,
      fieldKey: field.fieldKey,
      fieldType: field.fieldType,
      fieldValue: field.fieldValue || "",
      singletonModel: formData.singletonModel ? 1 : 0
    }));
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = formData.fields;

    console.log("FINAL PAYLOAD SENDING TO REDUX:", payload);

    // 🚀 THIS IS THE FIX
    dispatch(addCMSData(payload));

    onSave(formData);
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">

        {/* HEADER */}
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">
            {model ? "Edit Content Model" : "Create Content Model"}
          </h3>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[70vh]">

          <div className="p-6 space-y-6">

            {/* BASIC INPUTS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div>
                <label className="block text-sm font-medium">Merchant ID *</label>
                <input
                  type="text"
                  name="merchantId"
                  placeholder="Merchant ID"
                  value={formData.merchantId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Model Name *</label>
                <input
                  type="text"
                  name="modelName"
                  placeholder="Model Name"
                  value={formData.modelName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Model Slug *</label>
                <input
                  type="text"
                  name="modelSlug"
                  placeholder="Model Slug"
                  value={formData.modelSlug}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

            </div>

            {/* SINGLETON CHECKBOX */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="singletonModel"
                checked={formData.singletonModel}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
              <label className="ml-2 text-sm">Singleton Model (Only one allowed)</label>
            </div>

            {/* ADD FIELD UI */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-medium mb-4">Fields</h4>

              <div className="bg-gray-50 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">

                <input
                  type="text"
                  name="fieldName"
                  value={newField.fieldName}
                  onChange={handleFieldInputChange}
                  placeholder="Field Name"
                  className="px-3 py-2 border rounded-lg text-sm"
                />

                <input
                  type="text"
                  name="fieldKey"
                  value={newField.fieldKey}
                  onChange={handleFieldInputChange}
                  placeholder="Field Key"
                  className="px-3 py-2 border rounded-lg text-sm"
                />

                <select
                  name="fieldType"
                  value={newField.fieldType}
                  onChange={handleFieldInputChange}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="string">String</option>
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                  <option value="image">Color</option>
                </select>

                <input
                  type="text"
                  name="fieldValue"
                  value={newField.fieldValue}
                  onChange={handleFieldInputChange}
                  placeholder="Field Value"
                  className="px-3 py-2 border rounded-lg text-sm"
                />

                <button
                  type="button"
                  onClick={handleAddField}
                  className="col-span-1 px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Add Field
                </button>

              </div>

              {/* FIELD LIST */}
              <div>
                {formData.fields.map((field, i) => (
                  <div key={field.id} className="p-3 border rounded-lg flex justify-between">
                    <div>
                      <b>{field.fieldName}</b> — {field.fieldKey} ({field.fieldType})
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveField(field.id)}
                      className="text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

            </div>

          </div>

          {/* ACTION BUTTONS */}
          <div className="p-6 border-t flex justify-end space-x-4">
            <button type="button" onClick={onCancel} className="px-6 py-2 border rounded-lg">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg">
              Save Model
            </button>
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