import React, { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCMSData } from "../redux/actions/cmsActions";

import ModelCard from "./ModelCard";
import ModelForm from "./ModelForm";

const ContentModelsComponent = () => {
  const dispatch = useDispatch();
  const cmsData = useSelector((state) => state.cms.data);

  const [models, setModels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModel, setSelectedModel] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch CMS list on mount OR when closing modal
  useEffect(() => {
    dispatch(fetchCMSData());
  }, [dispatch, showForm]);

  // Convert API → UI list
  useEffect(() => {
    if (Array.isArray(cmsData) && cmsData.length > 0) {
      const formatted = cmsData.map((item, index) => ({
        id: index + 1,
        name: item.modelName,
        slug: item.modelSlug,
        singletonInApi: Number(item.singletonModel) === 1,
        fields: Object.values(item.cms).map((field, i) => ({
          id: i + 1,
          name: field.fieldName,
          key: field.fieldKey,
          type: field.fieldType,
          value: field.fieldValue,
        })),
      }));
      setModels(formatted);
    }
  }, [cmsData]);

  const filtered = models.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Content Models</h1>
          <p className="text-gray-600">Manage your CMS model structures</p>
        </div>

        <button
          onClick={() => {
            setSelectedModel(null);
            setShowForm(true);
          }}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} className="mr-2" />
          New Model
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white border p-4 rounded-xl">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            placeholder="Search models…"
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* MODEL GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((m) => (
          <ModelCard
            key={m.id}
            model={m}
            onEdit={() => {
              setSelectedModel(m);
              setShowForm(true);
            }}
          />
        ))}
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <ModelForm
          model={selectedModel}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default ContentModelsComponent;
