import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Database,
  Package,
  Layers,
  Search,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import {
  getCatalogModels,
  deleteCatalogModel,
  getCatalogItems,
} from "../../redux/actions/catalogActions";

import {
  getMerchant,
  setMerchantStatus
} from "../../redux/actions/cmsActions";

import { useNavigate } from "react-router-dom";

import CatalogueModelForm from "./CatalogueModelForm";
import CreateMainCatalogueForm from "./CreateMainCatalogueForm";

const CatalogueModels = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const { models, loading } = useSelector((state) => state.catalog);

  const merchantData = useSelector(
    (state) => state.cms.merchantList || []
  );

  const merchantStatus = useSelector(
    (state) => state.cms.merchantStatus || {}
  );

  const [searchTerm, setSearchTerm] = useState("");

  const [showCreate, setShowCreate] = useState(false);

  const [showMainCatalogPopup, setShowMainCatalogPopup] =
    useState(false);

  const [editingMainCatalogue, setEditingMainCatalogue] = useState(null);

  const [editingModel, setEditingModel] = useState(null);

  const [itemCounts, setItemCounts] = useState({});

  const [mainCatalogues, setMainCatalogues] = useState([]);

  const [mainCatalogFilter, setMainCatalogFilter] =
    useState("all");

  const [selectedMainCatalogue, setSelectedMainCatalogue] =
    useState(null);

  /* FETCH MODELS */

  useEffect(() => {

    dispatch(getMerchant());

    dispatch(getCatalogModels(token));

  }, [dispatch, token]);

  /* FETCH MAIN CATALOGUES */

  useEffect(() => {

    const fetchMainCatalogues = async () => {

      try {

        const res = await fetch(
          `https://api.rmtechsolution.com/getMainCatalogues?merchantId=${token}`
        );

        const json = await res.json();

        if (json.success) {
          setMainCatalogues(json.data);
        }

      } catch (err) {

        console.error("Main catalogue fetch error", err);

      }

    };

    fetchMainCatalogues();

  }, [token]);

  /* MERCHANT STATUS */

  useEffect(() => {

    if (merchantData) {

      const merchantDatas = merchantData.find(
        (list) => list.merchantId == token
      );

      if (merchantDatas) {
        dispatch(setMerchantStatus(merchantDatas));
      }

    }

  }, [merchantData, dispatch, token]);

  /* ITEM COUNTS */

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

  /* DELETE MODEL */

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

  /* FILTER MODELS */

  const filteredModels = (models || []).filter((model) => {

    const matchesSearch =
      model.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.slug?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMainCatalog =
      mainCatalogFilter === "all" ||
      model.main_catalogue_id == mainCatalogFilter;

    return matchesSearch && matchesMainCatalog;

  });

  /* MERCHANT INACTIVE */

  if (merchantStatus?.status === "inactive") {

    return (

      <div className="text-center py-12">

        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />

        <p className="text-xl font-semibold text-gray-900 mb-2">
          Merchant Inactive
        </p>

        <p className="text-gray-600">
          The catalogue model you're looking for doesn't exist.
        </p>

      </div>

    );

  }

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

          <button
            onClick={() => setShowMainCatalogPopup(true)}
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl flex items-center"
          >
            <Layers size={18} className="mr-2" />
            New Main Catalogue
          </button>

          <button
            onClick={() => {
              setSelectedMainCatalogue(null);
              setEditingModel(null);
              setShowCreate(true);
            }}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl flex items-center"
          >
            <Plus size={18} className="mr-2" />
            New Catalogue
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
          icon={<XCircle size={32} className="text-red-500" />}
        />

      </div>

      {/* MAIN CATALOGUES */}

      <div className="flex gap-3 overflow-x-auto pb-2">

        <button
          onClick={() => {
            setMainCatalogFilter("all");
            setSelectedMainCatalogue(null);
          }}
          className={`px-4 py-3 rounded-xl border whitespace-nowrap transition ${
            mainCatalogFilter === "all"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white hover:border-blue-400"
          }`}
        >

          <div className="font-semibold">
            All Catalogues
          </div>

          <div className="text-xs opacity-70">
            View all
          </div>

        </button>

        {mainCatalogues.map((cat) => (

          <div
            key={cat.id}
            onClick={() => {
              setEditingMainCatalogue(cat);
            }}
            className={`min-w-fit px-5 py-3 rounded-xl border cursor-pointer transition ${
              mainCatalogFilter == cat.id
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-600"
                : "bg-white hover:border-blue-400"
            }`}
          >

            <div className="font-semibold whitespace-nowrap">
              {cat.name}
            </div>

            <div className="text-xs opacity-70 mt-1">
              Click to edit catalogue
            </div>

          </div>

        ))}

      </div>

      {/* SEARCH */}

      <div className="bg-white p-4 rounded-xl shadow-sm border">

        {/* SEARCH + FILTER */}

<div className="bg-white p-4 rounded-xl shadow-sm border">

  <div className="flex flex-col md:flex-row gap-4">

    {/* SEARCH */}

    <div className="flex-1 relative">

      <Search
        size={20}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        placeholder="Search catalogue..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-12 py-3 border rounded-lg"
      />

    </div>

    {/* DROPDOWN FILTER */}

    <select
      value={mainCatalogFilter}
      onChange={(e) => {

        setMainCatalogFilter(e.target.value);

        if (e.target.value === "all") {

          setSelectedMainCatalogue(null);

        } else {

          const selectedCat = mainCatalogues.find(
            (cat) => cat.id == e.target.value
          );

          setSelectedMainCatalogue(selectedCat || null);

        }

      }}
      className="px-4 py-3 border rounded-lg min-w-[240px]"
    >

      <option value="all">
        All Main Catalogues
      </option>

      {mainCatalogues.map((cat) => (

        <option
          key={cat.id}
          value={cat.id}
        >
          {cat.name}
        </option>

      ))}

    </select>

  </div>

</div>

      </div>

      {/* MODELS GRID */}

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

              <div className="flex items-center mb-4">

                <img
                  src={model.image}
                  alt="img"
                  className="w-12 h-12 rounded-full mr-3 object-cover"
                />

                <div>

                  <h3 className="text-lg font-semibold">
                    {model.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {model.slug}
                  </p>

                </div>

              </div>

              <p className="text-gray-600 mb-4 line-clamp-1">
                {model.description || "No description"}
              </p>

              <div className="flex justify-between text-sm text-gray-500 mb-4">

                <span>{itemCounts[model.id] || 0} items</span>

                <span
                  className={`font-bold ${
                    itemCounts[model.id] == 0
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {itemCounts[model.id] == 0
                    ? "inactive"
                    : "active"}
                </span>

              </div>
              <span>ID:- {model.id}</span>

              <div className="flex justify-between border-t pt-4">

                      <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingModel(model);
                      setShowCreate(true);
                    }}
                    className="px-3 py-2 border rounded-xl text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/dashboard/catalogue/${model.id}`)
                    }
                    className="px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm"
                  >
                    Manage Items
                  </button>
                </div>

                <button
                  onClick={() => {

                    if (itemCounts[model.id] == 0) {
                      handleDeleteModel(model.id);
                    } else {
                      alert("First delete your items.");
                    }

                  }}
                  className="text-red-600"
                >
                  <Trash2 size={18} />
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* POPUPS */}

      {showMainCatalogPopup && (

        <CreateMainCatalogueForm
          onClose={() => setShowMainCatalogPopup(false)}
        />

      )}

      {editingMainCatalogue && (

        <CreateMainCatalogueForm
          mainCatalogue={editingMainCatalogue}
          onClose={() => {
            setEditingMainCatalogue(null);
            // Refresh main catalogues
            const fetchMainCatalogues = async () => {
              try {
                const res = await fetch(
                  `https://api.rmtechsolution.com/getMainCatalogues?merchantId=${token}`
                );
                const json = await res.json();
                if (json.success) {
                  setMainCatalogues(json.data);
                }
              } catch (err) {
                console.error("Main catalogue fetch error", err);
              }
            };
            fetchMainCatalogues();
          }}
        />

      )}

      {showCreate && (

        <CatalogueModelForm
          selectedMainCatalogue={selectedMainCatalogue}
          selectedModel={editingModel}
          onClose={() => {
            setShowCreate(false);
            setEditingModel(null);
            dispatch(getCatalogModels(token));
          }}
        />

      )}

    </div>

  );

};

const StatCard = ({ label, value, icon }) => (

  <div className="bg-white p-6 rounded-xl border">

    <div className="flex justify-between">

      <div>

        <div className="text-2xl font-bold">
          {value}
        </div>

        <div className="text-gray-500">
          {label}
        </div>

      </div>

      {icon}

    </div>

  </div>

);

export default CatalogueModels;