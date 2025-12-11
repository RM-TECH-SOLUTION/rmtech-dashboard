import React, { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCMSData } from "../redux/actions/cmsActions";

import ModelCard from "./ModelCard";

// IMPORT ALL FORMS
import CreateModelForm from "./CreateModelForm";
import EditModelForm from "./EditModelForm";
import SingletonModelForm from "./SingletonModelForm";

const ContentModelsComponent = () => {
  const dispatch = useDispatch();
  const cmsData = useSelector((state) => state.cms.data);

  const [models, setModels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // modal mode → "create" | "singleton" | "edit" | null
  const [mode, setMode] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [singletonBase, setSingletonBase] = useState(null);

  // ---- Fetch CMS data whenever modal closes/opens ----
  useEffect(() => {
    dispatch(fetchCMSData());
  }, [dispatch, mode]);

  // ---- Convert API response into UI friendly ----
  useEffect(() => {
    if (Array.isArray(cmsData) && cmsData.length > 0) {
      const formatted = cmsData.map((item, index) => ({
        id: index + 1,
        merchantId: item.merchantId,
        modelName: item.modelName,
        modelSlug: item.modelSlug,
        singletonModel: Number(item.singletonModel) === 1,
        fields: Object.values(item.cms).map((field, i) => ({
          id: i + 1,
          fieldName: field.fieldName,
          fieldKey: field.fieldKey,
          fieldType: field.fieldType,
          fieldValue: field.fieldValue,
        })),
      }));
      setModels(formatted);
    }
  }, [cmsData]);

  const filtered = models.filter(
    (m) =>
      m.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.modelSlug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const closeForm = () => {
    setMode(null);
    setSelectedModel(null);
    setSingletonBase(null);
  };

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
            setMode("create");
          }}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center shadow-lg"
        >
          <Plus size={18} className="mr-2" />
          New Model
        </button>
      </div>

      {/* SEARCH BAR */}
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
              setMode("edit");
            }}
          />
        ))}
      </div>

      {/* ------------------------------------------------------------ */}
      {/* MODALS CONDITIONAL */}
      {/* ------------------------------------------------------------ */}

      {/* Create Normal Model */}
      {mode === "create" && (
        <CreateModelForm
          onClose={closeForm}
          onSelectSingleton={(base) => {
            // When user checks "singleton" inside CreateModelForm
            setSingletonBase(base);
            // setMode("singleton");
          }}
          setMode ={setMode}
        />
      )}

      {/* Create Singleton Model */}
      {mode === "singleton" && (
        <SingletonModelForm
          baseData={singletonBase}
          onClose={closeForm}
          setMode ={setMode}
        />
      )}

      {/* Edit Model */}
      {mode === "edit" && selectedModel && (
        <EditModelForm
          model={selectedModel}
          onClose={closeForm}
        />
      )}
    </div>
  );
};

export default ContentModelsComponent;
