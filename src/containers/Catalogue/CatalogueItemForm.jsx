import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, Save, X, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCatalogItem,
  updateCatalogItem,
  getCatalogItems,
  createItemVariant,
  getItemVariants,
  setGetItemsVariantsResponse,
  updateItemVariant
} from "../../redux/actions/catalogActions";

/* ---------------- TAB CONFIG ---------------- */
const TABS = [
  "Basic Info",
  "Pricing & Stock",
  "Media",
  "Details",
  "SEO",
  "Variants", // ✅ ADDED
  "Advanced",
];

const CatalogueItemForm = () => {
  const { modelId, itemId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const { items, loading,getItemsVariantsResponse } = useSelector((state) => state.catalog);

  const [activeTab, setActiveTab] = useState("Basic Info");
  const [tagInput, setTagInput] = useState("");

  console.log(getItemsVariantsResponse,"getItemsVariantsResponse");
  
  /* ---------------- MAIN FORM ---------------- */
  const [form, setForm] = useState({
    merchantId: token,
    catalogueModelId: modelId,

    name: "",
    brand: "",
    sku: "",
    category: modelId,
    description: "",

    price: "",
    comparePrice: "",
    costPrice: "",
    stock: "",
    lowStockThreshold: 10,

    images: [],

    specifications: "",
    features: "",
    dimensions: "",
    weight: "",
    warranty: "",

    seoTitle: "",
    seoDescription: "",

    tags: [],

    status: "draft",
    featured: false,
    organization: "",
  });

  /* ---------------- VARIANTS ---------------- */
  const [variants, setVariants] = useState([
    {
      variantName: "",
      quantityValue: "",
      quantityUnit: "g",
      price: "",
      comparePrice: "",
      stock: "",
      sku: "",
      status: "active",
      merchantId: token,
    },
  ]);

  /* ---------------- LOAD ITEM ---------------- */
  useEffect(() => {
    if (itemId) dispatch(getCatalogItems({ modelId ,merchantId: token }));
    if (itemId) dispatch(getItemVariants({ itemId, merchantId: token }));
  }, [dispatch, itemId, modelId]);

  useEffect(() => {
    if (itemId && items?.length) {
      const existing = items.find((i) => String(i.id) === String(itemId));
      if (existing) {
        setForm((p) => ({
  ...p,
  ...existing,

  comparePrice: existing.compare_price ?? "",
  costPrice: existing.cost_price ?? "",
  seoTitle: existing.seo_title ?? "",
  seoDescription: existing.seo_description ?? "",
}));
        setVariants(existing.variants || variants);
      }
    }
  }, [items, itemId]);

  const update = (key, value) =>
    setForm((p) => ({ ...p, [key]: value }));

  /* ---------------- TAGS ---------------- */
  const addTag = () => {
    if (!tagInput.trim()) return;
    if (form.tags.includes(tagInput)) return;
    update("tags", [...form.tags, tagInput.trim()]);
    setTagInput("");
  };

  const removeTag = (tag) => {
    update("tags", form.tags.filter((t) => t !== tag));
  };

  /* ---------------- VARIANT HELPERS ---------------- */
  const addVariant = () => {
    setVariants((p) => [
      ...p,
      {
        variantName: "",
        quantityValue: "",
        quantityUnit: "g",
        price: "",
        comparePrice: "",
        stock: "",
        sku: "",
        status: "active",
      },
    ]);
  };

  const updateVariant = (index, key, value) => {
    setVariants((p) =>
      p.map((v, i) => (i === index ? { ...v, [key]: value } : v))
    );
  };

  const removeVariant = (index) => {
    setVariants((p) => p.filter((_, i) => i !== index));
  };

useEffect(() => {
  if (Array.isArray(getItemsVariantsResponse)) {
    setVariants(
      getItemsVariantsResponse.map((v) => ({
        id: v.id,

        variantName: v.variant_name ?? v.variantName ?? "",
        quantityValue: v.quantity_value ?? v.quantityValue ?? "",
        quantityUnit: v.quantity_unit ?? v.quantityUnit ?? "g",

        price: v.price ?? "",
        comparePrice: v.compare_price ?? v.comparePrice ?? "",
        costPrice: v.cost_price ?? "",

        stock: v.stock ?? "",
        sku: v.sku ?? "",
        status: v.status ?? "active",

        merchantId: token,
      }))
    );
  }
}, [getItemsVariantsResponse, token]);



  /* ---------------- SUBMIT ---------------- */
const handleSubmit = async () => {
  try {
    let currentItemId = itemId;

    /* ---------- ITEM ---------- */
    if (!itemId) {
      const res = await dispatch(createCatalogItem(form));
      if (!res?.success || !res?.data?.id) {
        alert("Item creation failed");
        return;
      }
      currentItemId = res.data.id;
    } else {
      await dispatch(updateCatalogItem({ id: itemId, data: form }));
    }

    /* ---------- VARIANTS ---------- */
    for (const v of variants) {
      if (!v.price) continue; // skip empty rows

      if (v.id) {
        // ✅ UPDATE VARIANT
        await dispatch(
          updateItemVariant({
            variantId: v.id,
            itemId: currentItemId,
            merchantId: Number(form.merchantId),
            variantName: v.variantName,
            quantityValue: v.quantityValue,
            quantityUnit: v.quantityUnit,
            price: v.price,
            comparePrice: v.comparePrice,
            stock: v.stock,
            sku: v.sku,
            status: v.status,
          })
        );
      } else {
        // ✅ CREATE NEW VARIANT
        await dispatch(
          createItemVariant({
            ...v,
            itemId: currentItemId,
            merchantId: Number(form.merchantId),
          })
        );
      }
    }

    /* ---------- REFRESH ---------- */
    await dispatch(getCatalogItems({ modelId ,merchantId: token }));
    navigate(`/dashboard/catalogue/${modelId}`);

  } catch (err) {
    console.error(err);
    alert("Something went wrong while saving item");
  }
};



  const handleImageUpload = async (files) => {
  const uploadedImages = [];

  for (let file of files) {
    const fd = new FormData();
    fd.append("image", file);
    fd.append("merchantId", Number(form.merchantId)); 

    const res = await fetch(
      "https://api.rmtechsolution.com/uploadCmsImage",
      {
        method: "POST",
        body: fd,
      }
    );

    const json = await res.json();

    if (!json.success || !json.imageUrl) {
      alert("Image upload failed");
      return;
    }

    uploadedImages.push(json.imageUrl);
  }

  setForm((prev) => ({
    ...prev,
    images: [...prev.images, ...uploadedImages],
  }));
};


  /* ---------------- TAB CONTENT ---------------- */
  const renderTab = () => {
    switch (activeTab) {
      case "Basic Info":
        return (
          <>
            <Input label="Product Name *" value={form.name} onChange={(v) => update("name", v)} />
            <Input label="Brand *" value={form.brand} onChange={(v) => update("brand", v)} />
            <Input label="SKU *" value={form.sku} onChange={(v) => update("sku", v)} />
            <Textarea label="Description" value={form.description} onChange={(v) => update("description", v)} />
          </>
        );

      case "Pricing & Stock":
        return (
          <>
            <Input label="Price *" type="number" value={form.price} onChange={(v) => update("price", v)} />
            <Input label="Compare Price" type="number" value={form.comparePrice} onChange={(v) => update("comparePrice", v)} />
            <Input label="Cost Price" type="number" value={form.costPrice} onChange={(v) => update("costPrice", v)} />
            <Input label="Stock *" type="number" value={form.stock} onChange={(v) => update("stock", v)} />
            <Input label="Low Stock Threshold" type="number" value={form.lowStockThreshold} onChange={(v) => update("lowStockThreshold", v)} />
          </>
        );

     case "Media":
  return (
    <div
      className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer"
      onClick={() => document.getElementById("item-image-upload").click()}
    >
      <Upload className="mx-auto mb-2" />
      <p className="text-gray-600">Drop images here or click to upload</p>

      <input
        id="item-image-upload"
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => handleImageUpload(e.target.files)}
      />

      {/* IMAGE PREVIEW */}
      {form.images.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mt-6">
          {form.images.map((img, i) => (
            <div key={i} className="relative">
              <img
                src={img}
                alt="item"
                className="h-24 w-full object-cover rounded"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setForm((p) => ({
                    ...p,
                    images: p.images.filter((_, x) => x !== i),
                  }));
                }}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

      case "Details":
        return (
          <>
            <Textarea label="Specifications" value={form.specifications} onChange={(v) => update("specifications", v)} />
            <Textarea label="Features" value={form.features} onChange={(v) => update("features", v)} />
            <Textarea label="Dimensions" value={form.dimensions} onChange={(v) => update("dimensions", v)} />
            <Input label="Weight" value={form.weight} onChange={(v) => update("weight", v)} />
            <Input label="Warranty" value={form.warranty} onChange={(v) => update("warranty", v)} />
          </>
        );

      case "SEO":
        return (
          <>
            <Input label="SEO Title" value={form.seoTitle} onChange={(v) => update("seoTitle", v)} />
            <Textarea label="SEO Description" value={form.seoDescription} onChange={(v) => update("seoDescription", v)} />
          </>
        );

      case "Variants":
        return (
          <div className="space-y-4">
            {variants.map((v, i) => (
              <div key={i} className="border rounded-lg p-4 bg-gray-50 space-y-3">
                <div className="flex justify-between">
                  <h4 className="font-semibold">Variant {i + 1}</h4>
                  {variants.length > 1 && (
                    <button onClick={() => removeVariant(i)} className="text-red-600 text-sm">
                      Remove
                    </button>
                  )}
                </div>

                <Input label="Variant Name" value={v.variantName} onChange={(val) => updateVariant(i, "variantName", val)} />

                <div className="grid grid-cols-3 gap-4">
                  <Input label="Quantity" type="number" value={v.quantityValue} onChange={(val) => updateVariant(i, "quantityValue", val)} />
                  <Input label="SKU" value={v.sku} onChange={(val) => updateVariant(i, "sku", val)} />
                  <div style={{ display: "grid" }}>
                    <span>Units</span>
                    <select
                      value={v.quantityUnit}
                      onChange={(e) => updateVariant(i, "quantityUnit", e.target.value)}
                      className="pl-5 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                      <option value="ml">ml</option>
                      <option value="l">l</option>
                      <option value="pcs">pcs</option>
                    </select>
                  </div>
                </div>


                <div className="grid grid-cols-3 gap-4">
                  <Input label="Price" type="number" value={v.price} onChange={(val) => updateVariant(i, "price", val)} />
                  <Input label="Compare Price" type="number" value={v.comparePrice} onChange={(val) => updateVariant(i, "comparePrice", val)} />
                  <Input label="Stock" type="number" value={v.stock} onChange={(val) => updateVariant(i, "stock", val)} />
                  <div className="grid">
                    <span className="text-sm font-medium mb-1">Status</span>
                    <select
                      value={v.status}
                      onChange={(e) =>
                        updateVariant(i, "status", e.target.value)
                      }
                      className="pl-5 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="outOfStock">Out of Stock</option>
                    </select>
                  </div>
                </div>

              </div>
            ))}

            <button onClick={addVariant} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl flex items-center">
              <Plus size={14} /> Add Variant
            </button>
          </div>
        );

      case "Advanced":
        return (
          <>
            <label className="block text-sm font-medium mb-2">Tags</label>

            <div className="flex gap-2 mb-3">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter tag and press Add"
              />
              <button onClick={addTag} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl flex items-center">
                <Plus size={14} /> Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <span key={tag} className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {tag}
                  <button onClick={() => removeTag(tag)}>
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  if (loading) return <div className="py-10 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <Link to={`/dashboard/catalogue/${modelId}`} 
        onClick={() => dispatch(setGetItemsVariantsResponse(null))}
        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl">
          {"<"}
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{itemId ? "Edit" : "Create New"} Item</h1>
          <p className="text-gray-500">Add new item to your catalogue</p>
        </div>
      </div>

      {/* TABS */}
      <div className="bg-white rounded-xl border">
        <div className="flex border-b">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-6 py-3 text-sm font-medium ${activeTab === t ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-6 p-6">
          <div className="col-span-8 space-y-4">{renderTab()}</div>

          <div className="col-span-4 space-y-4">
            <Card title="Status">
              <select value={form.status} onChange={(e) => update("status", e.target.value)} className="w-full border rounded px-3 py-2">
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
                <option value="outOfStock">Out of stock</option>
              </select>
            </Card>

            <Card title="Organization">
              <Input
                label="Merchant ID"
                value={form.merchantId}
                onChange={() => { }}
                disabled
              />

              <Input
                label="Catalogue Model ID"
                value={form.catalogueModelId}
                onChange={() => { }}
                disabled
              />
            </Card>

            <Card title="Actions">
              <button onClick={handleSubmit} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-xl flex justify-center gap-2"
                style={{ alignItems: "center" }}
              >
                <Save size={16} /> {itemId ? "Update Item" : "Create Item"}
              </button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- SMALL COMPONENTS ---------------- */
const Input = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-5 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
    />
  </div>
);

const Textarea = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <textarea
      rows={4}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-5 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
    />
  </div>
);

const Card = ({ title, children }) => (
  <div className="bg-gray-50 border rounded-lg p-4">
    <h3 className="font-semibold mb-3">{title}</h3>
    {children}
  </div>
);

export default CatalogueItemForm;
