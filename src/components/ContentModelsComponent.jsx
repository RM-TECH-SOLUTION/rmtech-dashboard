import React, { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCMSData, updateCMSData, deleteCms, deleteModel,uploadCmsImage } from "../redux/actions/cmsActions";
import ModelCard from "./ModelCard";
import CreateModelForm from "./CreateModelForm";
import EditModelForm from "./EditModelForm";
import SingletonModelForm from "./SingletonModelForm";
import EditSingletonModelForm from "./EditSingletonModelForm";

const ContentModelsComponent = () => {
  const dispatch = useDispatch();
  const cmsData = useSelector((state) => state.cms.data);
  const deleteModelData = useSelector((state) => state.cms.deleteModelData);
  const [models, setModels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mode, setMode] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [singletonBase, setSingletonBase] = useState(null);
  const [selectedModelName, setSelectedModelName] = useState("ALL");


  console.log(deleteModelData, "deleteModelDatahhhh");


  // ---- Fetch CMS data whenever modal closes/opens ----
  useEffect(() => {
    dispatch(fetchCMSData());
  }, [dispatch, mode]);

  // ---- Convert API response into UI friendly ----
  useEffect(() => {
    if (!Array.isArray(cmsData) || cmsData.length === 0) return;

    const formatted = cmsData.map((item, index) => {
      let fields = [];

      // ------------------------------------------------------------------
      // CASE 1 → NON-SINGLETON MODEL (cms is object)
      // ------------------------------------------------------------------
      if (!item.singletonModel && typeof item.cms === "object" && !Array.isArray(item.cms)) {
        fields = Object.values(item.cms).map((field, i) => ({
          id: i + 1,
          fieldName: field.fieldName,
          fieldKey: field.fieldKey,
          fieldType: field.fieldType,
          fieldValue: field.fieldValue,
        }));
      }

      // ------------------------------------------------------------------
      // CASE 2 → SINGLETON MODEL (cms is array)
      // ------------------------------------------------------------------
      if (item.singletonModel && Array.isArray(item.cms)) {
        fields = item.cms.map((rowObj, rowIndex) => {
          return {
            index: rowIndex + 1,
            fields: Object.values(rowObj).map((f, i) => ({
              id: i + 1,
              fieldName: f.fieldName,
              fieldKey: f.fieldKey,
              fieldType: f.fieldType,
              fieldValue: f.fieldValue,
              singletonModelIndex: f.singletonModelIndex
            }))
          };
        });
      }

      return {
        id: index + 1,
        merchantId: item.merchantId,
        modelName: item.modelName,
        modelSlug: item.modelSlug,
        singletonModel: Number(item.singletonModel) === 1,
        fields: fields,
      };
    });

    setModels(formatted);
  }, [cmsData]);


  const modelNameOptions = [
    "ALL",
    ...Array.from(new Set(models.map(m => m.modelName)))
  ];


  const filtered = models.filter((m) => {
    const matchesSearch =
      m.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.modelSlug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDropdown =
      selectedModelName === "ALL" || m.modelName === selectedModelName;

    return matchesSearch && matchesDropdown;
  });


  const closeForm = () => {
    setMode(null);
    setSelectedModel(null);
    setSingletonBase(null);
  };

  console.log(filtered, "cmsDatacmsDataggg");


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
        {/* FILTER BAR */}
        <div className="bg-white border p-4 rounded-xl flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              placeholder="Search models…"
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Model Name Filter */}
          <select
            value={selectedModelName}
            onChange={(e) => setSelectedModelName(e.target.value)}
            className="border px-4 py-2 rounded-lg min-w-[200px]"
          >
            {modelNameOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

      </div>


      {/* MODEL GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((m) => (
          <ModelCard
            key={m.id}
            model={m}
            onEdit={(model, mode) => {
              setSelectedModel(model);
              setMode(mode);
            }}
            onEditSingelton={(model, mode) => {
              setSelectedModel(model);
              setMode(mode);
            }}
            deleteModel={(data) => { dispatch(deleteModel(data)) }}
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
          setMode={setMode}
          uploadCmsImage={(data) => dispatch(uploadCmsImage(data))}
        />
      )}

      {/* Create Singleton Model */}
      {mode === "singleton" && (
        <SingletonModelForm
          baseData={singletonBase}
          onClose={closeForm}
          setMode={setMode}

        />
      )}

      {/* Edit Model */}
      {mode === "edit" && selectedModel && (
        <EditModelForm
          model={selectedModel}
          onClose={closeForm}
          updateCMSData={(data) => {
            dispatch(updateCMSData(data))
          }
          }
          deleteCms={(data) => { dispatch(deleteCms(data)) }}
        />
      )}
      {mode === "editSingelton" && selectedModel && (
        <EditSingletonModelForm
          model={selectedModel}
          onClose={closeForm}
          updateCMSData={(data) => {
            dispatch(updateCMSData(data))
          }
          }
          deleteCms={(data) => { dispatch(deleteCms(data)) }}
        />
      )}
    </div>
  );
};

export default ContentModelsComponent;
