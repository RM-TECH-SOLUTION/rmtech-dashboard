import React, { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchCMSData,
  updateCMSData,
  deleteCms,
  deleteModel,
  uploadCmsImage,
  createMerchant,
  getMerchant,
} from "../redux/actions/cmsActions";

import ModelCard from "./ModelCard";
import CreateModelForm from "./CreateModelForm";
import EditModelForm from "./EditModelForm";
import SingletonModelForm from "./SingletonModelForm";
import EditSingletonModelForm from "./EditSingletonModelForm";
import CreateMerchantForm from "./CreateMerchantForm";

const ContentModelsComponent = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
console.log(token,typeof token,"tokentokentokentoken");
const user = JSON.parse(localStorage.getItem("user"));
console.log(user,"user tokentokentoken");


  // -----------------------------
  // REDUX STATE
  // -----------------------------
  const cmsData = useSelector((state) => state.cms.data);
  const merchantData = useSelector((state) => state.cms.merchantList || []);

  // -----------------------------
  // LOCAL STATE
  // -----------------------------
  const [models, setModels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mode, setMode] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [singletonBase, setSingletonBase] = useState(null);
  const [selectedModelName, setSelectedModelName] = useState("ALL");
  const [selectedMerchantId, setSelectedMerchantId] = useState("ALL");

  // -----------------------------
  // FETCH MERCHANT LIST (ONCE)
  // -----------------------------
  useEffect(() => {
    dispatch(getMerchant()); // fetch all merchants
  }, [dispatch]);

  // -----------------------------
  // FETCH CMS BASED ON MERCHANT
  // -----------------------------
  useEffect(() => {
    if (selectedMerchantId === "ALL") {
      if (token == "0") {
        dispatch(fetchCMSData()); 
      }else{
        dispatch(fetchCMSData(token)); 
      }
    } else {
      dispatch(fetchCMSData(selectedMerchantId)); 
    }
  }, [dispatch, selectedMerchantId, mode,]);

  // -----------------------------
  // FORMAT CMS DATA FOR UI
  // -----------------------------
  useEffect(() => {
    if (!Array.isArray(cmsData)) return;

    const formatted = cmsData.map((item, index) => {
      let fields = [];

      // NON-SINGLETON
      if (!item.singletonModel && item.cms && typeof item.cms === "object") {
        fields = Object.values(item.cms).map((field, i) => ({
          id: i + 1,
          fieldName: field.fieldName,
          fieldKey: field.fieldKey,
          fieldType: field.fieldType,
          fieldValue: field.fieldValue,
        }));
      }

      // SINGLETON
      if (item.singletonModel && Array.isArray(item.cms)) {
        fields = item.cms.map((rowObj, rowIndex) => ({
          index: rowIndex + 1,
          fields: Object.values(rowObj).map((f, i) => ({
            id: i + 1,
            fieldName: f.fieldName,
            fieldKey: f.fieldKey,
            fieldType: f.fieldType,
            fieldValue: f.fieldValue,
            singletonModelIndex: f.singletonModelIndex,
          })),
        }));
      }

      return {
        id: index + 1,
        merchantId: item.merchantId,
        modelName: item.modelName,
        modelSlug: item.modelSlug,
        singletonModel: Number(item.singletonModel) === 1,
        fields,
      };
    });

    setModels(formatted);
  }, [cmsData]);

  // -----------------------------
  // FILTERS (SEARCH + MODEL NAME)
  // -----------------------------
  const modelNameOptions = [
    "ALL",
    ...Array.from(new Set(models.map((m) => m.modelName))),
  ];

  const filteredModels = models.filter((m) => {
    const searchMatch =
      m.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.modelSlug.toLowerCase().includes(searchTerm.toLowerCase());

    const modelMatch =
      selectedModelName === "ALL" || m.modelName === selectedModelName;

    return searchMatch && modelMatch;
  });

  // -----------------------------
  // CLOSE MODALS
  // -----------------------------
  const closeForm = () => {
    setMode(null);
    setSelectedModel(null);
    setSingletonBase(null);
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Content Models</h1>
          <p className="text-gray-600">Manage CMS models by merchant</p>
        </div>
        {token == "0" &&
        <div className="flex gap-3">
          <button
            onClick={() => setMode("create")}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl flex items-center"
          >
            <Plus size={18} className="mr-2" />
            New Model
          </button>

          <button
            onClick={() => setMode("createMerchant")}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Create Merchant
          </button>
        </div>}
      </div>

      {/* FILTER BAR */}
      <div className="bg-white border p-4 rounded-xl flex flex-col md:flex-row gap-4">
        {/* SEARCH */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            placeholder="Search models…"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* MERCHANT FILTER */}
        <select
          value={selectedMerchantId}
          onChange={(e) => setSelectedMerchantId(e.target.value)}
          className="border px-4 py-2 rounded-lg min-w-[220px]"
        >
          <option value="ALL">All Merchants</option>
          {token == "0" ? merchantData.map((m) => (
            <option key={m.merchantId} value={m.merchantId}>
              {m.merchantName} ({m.merchantId})
            </option>
          )) :
          merchantData.filter((list)=>list.merchantId == token).map((m) => (
            <option key={m.merchantId} value={m.merchantId}>
              {m.merchantName} ({m.merchantId})
            </option>
          ))
          
          }
        </select>

        {/* MODEL FILTER */}
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

      {/* MODEL GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map((m) => (
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
            deleteModel={(data) => dispatch(deleteModel(data))}
          />
        ))}
      </div>

      {/* MODALS */}
      {mode === "create" && (
        <CreateModelForm
          onClose={closeForm}
          setMode={setMode}
          uploadCmsImage={(data) => dispatch(uploadCmsImage(data))}
        />
      )}

      {mode === "singleton" && (
        <SingletonModelForm
          baseData={singletonBase}
          onClose={closeForm}
          setMode={setMode}
          uploadCmsImage={(data) => dispatch(uploadCmsImage(data))}
        />
      )}

      {mode === "edit" && selectedModel && (
        <EditModelForm
          model={selectedModel}
          onClose={closeForm}
          updateCMSData={(data) => dispatch(updateCMSData(data))}
          deleteCms={(data) => dispatch(deleteCms(data))}
        />
      )}

      {mode === "editSingelton" && selectedModel && (
        <EditSingletonModelForm
          model={selectedModel}
          onClose={closeForm}
          updateCMSData={(data) => dispatch(updateCMSData(data))}
          deleteCms={(data) => dispatch(deleteCms(data))}
          uploadCmsImage={(data) => dispatch(uploadCmsImage(data))}
        />
      )}

      {mode === "createMerchant" && (
        <CreateMerchantForm
          onClose={closeForm}
          onSubmit={(data) =>
            dispatch(createMerchant(data)).then(() => {
              alert("Merchant created successfully");
              closeForm();
            })
          }
        />
      )}
    </div>
  );
};

export default ContentModelsComponent;
