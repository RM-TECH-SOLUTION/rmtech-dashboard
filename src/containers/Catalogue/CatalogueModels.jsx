import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Copy,
  Database,
  Package,
  Layers,
  Download,
  Upload,
  Filter,
  Search,
  Grid,
  List,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import {
  getCatalogModels,
  deleteCatalogModel,
  getCatalogItems
} from "../../redux/actions/catalogActions";
import { useNavigate } from "react-router-dom";

import CatalogueModelForm from "./CatalogueModelForm";

const CatalogueModels = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  console.log(user, "useruserusergggg");


  // ✅ CORRECT SELECTOR
  const { models, loading } = useSelector((state) => state.catalog);

  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedStat, setSelectedStat] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modelFilter, setModelFilter] = useState("all");
  const [itemCounts, setItemCounts] = useState({});





  /* ---------------- FETCH MODELS ---------------- */
  useEffect(() => {
    dispatch(getCatalogModels(token));
  }, [dispatch]);

  /* ---------------- ACTIONS ---------------- */
  const handleDeleteModel = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this catalogue model? All items will be lost."
      )
    ) {
      dispatch(deleteCatalogModel({ id })).then(() => {
        dispatch(getCatalogModels(token));
      });
    }
  };

  const handleDuplicateModel = () => {
    alert("Duplicate API not implemented yet");
  };

  /* ---------------- FILTER ---------------- */
  const filteredModels = (models || []).filter((model) => {
    const matchesSearch =
      model.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || model.status === statusFilter;

    const matchesModel =
      modelFilter === "all" || model.slug === modelFilter;

    return matchesSearch && matchesStatus && matchesModel;
  });

  useEffect(() => {
    if (!models?.length) return;

    models.forEach((model) => {
      dispatch(
        getCatalogItems({
          catalogueModelId: model.id,
          merchantId: token
        })
      ).then((res) => {
        if (res?.success && Array.isArray(res.data)) {
          setItemCounts((prev) => ({
            ...prev,
            [model.id]: res.data.length
          }));
        }
      });
    });
  }, [models, dispatch, token]);


  console.log(itemCounts, "itemCountsitemCounts");



  if (models.length <= 0) {

    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-xl font-semibold text-gray-900 mb-2">Merchant Inactive</p>
        <p className="text-gray-600 mb-6">The catalogue model you're looking for doesn't exist.</p>
      </div>
    )

  }

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Catalogue Models
          </h1>
          <p className="text-gray-600">
            Define structures for your products and items
          </p>
        </div>

        <div className="flex space-x-3 mt-4 md:mt-0">
          {/* <button className="flex items-center px-4 py-2 border rounded-lg">
            <Upload size={18} className="mr-2" /> Import
          </button>
          <button className="flex items-center px-4 py-2 border rounded-lg">
            <Download size={18} className="mr-2" /> Export
          </button> */}

          {/* ✅ POPUP TRIGGER */}
          <button
            onClick={() => setShowCreate(true)}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl flex items-center"
          >
            <Plus size={18} className="mr-2" /> New Catalogue
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          label="Total Models"
          value={models?.length || 0}
          icon={<Database size={32} className="text-blue-500" />}
        />

        <StatCard
          label="Total Items"
          value={Object.values(itemCounts).reduce((s, c) => s + c, 0)}
          icon={<Package size={32} className="text-green-500" />}
        />

        <StatCard
          label="Active Models"
          value={models.filter(m => (itemCounts[m.id] || 0) > 0).length}
          icon={<CheckCircle size={32} className="text-green-500" />}
        />

        <StatCard
          label="Inactive Models"
          value={models.filter(m => (itemCounts[m.id] || 0) === 0).length}
          icon={<XCircle className="text-red-500" size={32} />}
        />

      </div>

      {/* TOOLBAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="flex space-x-3">
            <select
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="all">All Models</option>

              {models?.map((model) => (
                <option key={model.id} value={model.slug}>
                  {model.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

          </div>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">
          Loading models...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map((model) => (


            <div
              key={model.id}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex justify-between mb-4"
                style={{ justifyContent: "left" }}
              >
                <img
                  src={model.image}
                  alt="img"
                  style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 100, marginRight: 15 }}
                />
                <div>
                  <h3 className="text-lg font-semibold line-clamp-1">{model.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{model.slug}</p>
                </div>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-1">
                {model.description || "No description"}
              </p>

              <div className="flex justify-between text-sm text-gray-500 mb-4 line-clamp-1">
                <span>{itemCounts[model.id] || 0} items</span>
                <span
                  className={`px-2 py-1 text-xs line-clamp-1`}
                  style={{ fontWeight: "bold", fontSize: 15, color: model.status != "active" ? "red" : "green" }}
                >
                  {itemCounts[model.id] == 0 ? "inactive" : "active"}
                </span>
              </div>


              <div className="flex justify-between border-t pt-4">
                <button
                  onClick={() =>
                    navigate(`/dashboard/catalogue/${model.id}`)
                  }
                  className="px-1.5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl flex items-center"
                >
                  <span style={{ fontSize: 12, fontWeight: "bold" }}>Manage Items</span>
                </button>
                <button
                  onClick={() => {
                    if (itemCounts[model.id] == 0) {
                      handleDeleteModel(model.id)
                    } else {
                      window.confirm(
                        "First delete your items."
                      )
                    }
                  }}
                  className="p-1 text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ CREATE MODEL POPUP */}
      {showCreate && (
        <CatalogueModelForm
          onClose={() => {
            setShowCreate(false);
            dispatch(getCatalogModels(token));
          }}
        />
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon, onClick, active }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer bg-white p-6 rounded-xl border transition
      ${active ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"}
    `}
  >
    <div className="flex justify-between">
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-gray-500">{label}</div>
      </div>
      {icon}
    </div>
  </div>
);


export default CatalogueModels;
