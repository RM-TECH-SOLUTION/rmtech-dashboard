import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  Upload,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Package,
  Tag,
  Star,
  ShoppingCart,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  MoreVertical,
  Copy,
  MoveVertical,
  AlertCircle,
  RefreshCw} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  getCatalogItems,
  deleteCatalogueItem,

} from "../../redux/actions/catalogActions";

const CatalogueItems = () => {
  const { modelId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, loading ,models} = useSelector((state) => state.catalog);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");
  const [statusFilter, setStatusFilter] = useState("all");
const [itemsFilter, setItemsFilter] = useState("all");
const [selectedItem, setSelectedItem] = useState("all");
const [selectedCatalogue,setSelectedCatalogue] = useState({})

const itemOptions = Array.from(
  new Set((items || []).map((item) => item.name))
);

  console.log(models,modelId,"tokentokentokenhhhhyyy",selectedCatalogue);

useEffect(() => {
  if (models?.length && modelId) {
    const selectedModel = models.find(
      (m) => String(m.id) === String(modelId)
    );

    if (selectedModel) {
      setSelectedCatalogue(selectedModel); 
    }
  }
}, [models, modelId]);

  useEffect(() => {
    dispatch(getCatalogItems({ catalogueModelId:modelId,merchantId:token }));
  }, [dispatch, modelId,token]);



const filtered = (items || []).filter((item) => {
  const matchesSearch =
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku?.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesStatus =
    statusFilter === "all" ||
    (statusFilter === "inStock" && item.stock > 0) ||
    (statusFilter === "outOfStock" && item.stock <= 0);

  const matchesItem =
    selectedItem === "all" || item.name === selectedItem;

  return matchesSearch && matchesStatus && matchesItem;
});

  const totalItems = items?.length || 0;

const totalValue = (items || []).reduce(
  (sum, item) => sum + Number(item.price || 0),
  0
);

const inStockCount = (items || []).filter(
  (item) => Number(item.stock) > 0
).length;

const outOfStockCount = totalItems - inStockCount;


  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"
      style={{justifyContent:"space-between"}}
      >
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:10}}>
        <div>
        <Link
          to={`/dashboard/catalogue`}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl flex items-center"
        >
           <span>{"<"}</span>
        </Link>
        </div>
        <div>
        <h1 className="text-3xl font-bold capitalize">
          {selectedCatalogue.name} Items
        </h1>
        <p className="text-gray-600">Manage your items</p>
        </div>
        </div>
        <Link
          to={`/dashboard/catalogue/${modelId}/create`}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl flex items-center"
        >
          <Plus size={16} className="inline mr-2" />
          New Item
        </Link>
      </div>

      {/* SUMMARY CARDS */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          label="Total Items"
          value={totalItems || 0}
          icon={<Package className="text-blue-500" size={32} />}
        />
        <StatCard
          label="Total Value"
          value= {totalValue}
          icon={ <Tag className="text-green-500" size={32} />}
        />
        <StatCard
          label="In Stock"
          value={inStockCount}
          icon={<CheckCircle className="text-green-500" size={32} />}
        />
        <StatCard
          label="Out of Stock"
          value={outOfStockCount}
          icon={ <XCircle className="text-red-500" size={32} />}
        />
      </div>

<div className="bg-white p-4 rounded-xl shadow-sm border">
     <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
      <Search
                    size={20}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
      <input
        placeholder="Search items..."
        className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      </div>

      <div className="flex flex-col md:flex-row gap-3">
  {/* STATUS DROPDOWN */}
  <select
  value={selectedItem}
  onChange={(e) => setSelectedItem(e.target.value)}
  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
>
  <option value="all">All Items</option>
  {itemOptions.map((name) => (
    <option key={name} value={name}>
      {name}
    </option>
  ))}
</select>
  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
  >
    <option value="all">All Status</option>
    <option value="inStock">In Stock</option>
    <option value="outOfStock">Out of Stock</option>
  </select>

</div>
</div>
</div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
     {filtered.map((item) => {
  const inStock = item.stock > 0;

  console.log(item,"itemitemyuyuyuy");
  

  return (
    <div
      key={item.id}
      className="bg-white rounded-xl border shadow-sm hover:shadow-md transition overflow-hidden"
    >
      {/* IMAGE AREA */}
      <div className="h-40 bg-gray-100 relative flex items-center justify-center">
        {/* STOCK BADGE */}
        {/* <span
          className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full font-medium
            ${inStock
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"}
          `}
        >
          {inStock ? "In Stock" : "Out of Stock"}
        </span> */}

        {/* IMAGE PLACEHOLDER */}
         <ImageSlider images={item.images || []} />
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg truncate">
            {item.name}
          </h3>
          <span className="font-bold text-lg">
            ₹{item.price}
          </span>
        </div>

        <p className="text-sm text-gray-500">
          {item.brand || "—"}
        </p>

        <p className="text-xs text-gray-400">
          SKU: {item.sku}
        </p>

        {/* RATING + STOCK */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-sm flex items-center gap-1"
          style={{color:inStock ? "green" :"red"}}
          >
             {inStock ? "In Stock" : "Out of Stock"}
          </span>

          <span className="text-sm text-gray-500">
            Stock: {item.stock}
          </span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="p-3 flex gap-2 border-t">
        <button
          onClick={() =>
            navigate(
              `/dashboard/catalogue/${modelId}/edit/${item.id}`
            )
          }
          className="w-full bg-blue-600 text-white py-2 rounded-xl flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600"
        >
          Edit
        </button>

        <button
     onClick={() => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      dispatch(
        deleteCatalogueItem({
          itemId: item.id,
          merchantId: token,
        })
      ).then(() => {
        alert("Item deleted successfully");
      });
    }
  }}
          className="p-2 border rounded-lg text-red-600 hover:bg-red-50"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
})}

      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border">
    <div className="flex justify-between"
    style={{justifyContent:"space-between"}}
    >
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-gray-500">{label}</div>
      </div>
      {icon}
    </div>
  </div>
);

const ImageSlider = ({ images = [] }) => {
  const [index, setIndex] = useState(0);

  if (!images.length) {
    return (
      <span className="text-gray-400 text-sm">No Image</span>
    );
  }

  const prev = (e) => {
    e.stopPropagation();
    setIndex((p) => (p === 0 ? images.length - 1 : p - 1));
  };

  const next = (e) => {
    e.stopPropagation();
    setIndex((p) => (p === images.length - 1 ? 0 : p + 1));
  };

  return (
    <div className="relative w-full h-full">
      <img
        src={images[index]}
        alt="item"
        className="h-full w-full object-cover"
      />

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full px-2 py-1 text-xs"
          >
            ‹
          </button>

          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full px-2 py-1 text-xs"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
};


export default CatalogueItems;
