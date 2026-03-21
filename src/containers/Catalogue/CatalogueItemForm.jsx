import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, Save, X, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Barcode from "react-barcode";
import JsBarcode from "jsbarcode";
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

  const { items, loading, getItemsVariantsResponse } = useSelector((state) => state.catalog);

  const [activeTab, setActiveTab] = useState("Basic Info");
  const [tagInput, setTagInput] = useState("");

  console.log(getItemsVariantsResponse, "getItemsVariantsResponse");

  /* ---------------- MAIN FORM ---------------- */
  const [form, setForm] = useState({
    merchantId: token,
    catalogueModelId: modelId,

    name: "",
    brand: "",
    sku: "",
    barcode: "",
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
      barcode: "",
      status: "active",
      merchantId: token,
    },
  ]);

  /* ---------------- LOAD ITEM ---------------- */
  useEffect(() => {
    if (itemId) dispatch(getCatalogItems({ modelId, merchantId: token }));
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
        barcode: "",
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
          barcode: v.barcode ?? "",
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
        const isEmpty =
          !v.variantName &&
          !v.quantityValue &&
          !v.price &&
          !v.sku &&
          !v.barcode;

        if (isEmpty) continue;

        if (v.id) {
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
              barcode: v.barcode,
              status: v.status,
            })
          );
        } else {
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
      await dispatch(getCatalogItems({ modelId, merchantId: token }));
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


  // 🔹 SKU Generator
  const generateSKU = (name = "", category = "") => {
    const prefix = (category || "ITEM").slice(0, 3).toUpperCase();
    const namePart = name.replace(/\s/g, "").slice(0, 4).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);

    return `${prefix}-${namePart}-${random}`;
  };

  // 🔹 Barcode Generator (EAN-13 style)
  const generateBarcode = () => {
    return String(
      Math.floor(1000000000000 + Math.random() * 9000000000000)
    );
  };

  const handleThermalPrint = () => {
    const printWindow = window.open("", "", "width=300,height=600");

    const barcodesHTML = variants
      .filter(v => v.barcode)
      .map(v => `
      <div style="margin-bottom:15px;text-align:center;">
        <div style="font-weight:bold;">
          ${v.variantName || form.name}
        </div>

        <div>SKU: ${v.sku || "-"}</div>

        <svg class="barcode" data-value="${v.barcode}"></svg>

        <div style="font-size:10px;margin-top:2px;">
          ${v.barcode}
        </div>

        <hr/>
      </div>
    `)
      .join("");

    printWindow.document.write(`
    <html>
      <head>
        <title>Thermal Print</title>

        <!-- ✅ LOAD JsBarcode INSIDE PRINT WINDOW -->
        <script src="https://cdn.jsdelivr.net/npm/jsbarcode"></script>
      </head>

      <body style="width:220px;font-family:monospace;font-size:12px;">

        <h3 style="text-align:center;">RM Tech</h3>
        <hr/>

        ${barcodesHTML}

        <script>
          window.onload = function () {

            // render all barcodes
            document.querySelectorAll(".barcode").forEach(el => {
              const value = el.getAttribute("data-value");

              JsBarcode(el, value, {
                format: "CODE128",
                width: 2,
                height: 50,
                displayValue: false
              });
            });

            // wait for render then print
            setTimeout(() => {
              window.print();
            }, 500);
          };
        </script>

      </body>
    </html>
  `);

    printWindow.document.close();
  };

  const verifyBarcode = async (barcode, variantIndex = null) => {
    if (!barcode) return;

    try {
      const res = await fetch("https://api.rmtechsolution.com/checkBarcode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ barcode }),
      });

      const data = await res.json();

      if (data?.exists) {
        alert("Barcode already exists! New generated one applied.");

        // ✅ ITEM BARCODE
        if (variantIndex === null) {
          update("barcode", data.newBarcode);
        }
        // ✅ VARIANT BARCODE
        else {
          updateVariant(variantIndex, "barcode", data.newBarcode);
        }
      }
    } catch (err) {
      console.error("Barcode check failed", err);
    }
  };


const printSingleBarcode = async ({ name, sku, barcode }) => {

  console.log(barcode,"ghgahgsyuagsha");
  

  try {
    await fetch("http://localhost:5000/print-barcode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, sku, barcode }),
    });
  } catch (err) {
    console.error("Barcode print error:", err);
  }
};

  /* ---------------- TAB CONTENT ---------------- */
  const renderTab = () => {
    switch (activeTab) {
      case "Basic Info":
        return (
          <>
            <Input label="Product Name *" value={form.name} onChange={(v) => update("name", v)} />
            <Input label="Brand *" value={form.brand} onChange={(v) => update("brand", v)} />
            <Input
              label="SKU *"
              value={form.sku}
              onChange={(v) => update("sku", v)}
            />

            <div className="flex gap-2 mt-2"
            >
              <button
                type="button"
                onClick={() =>
                  update("sku", generateSKU(form.name, form.category))
                }
                className="px-3 py-1 bg-gray-200 rounded text-sm"
              >
                Generate SKU
              </button>
            </div>

            {/* 🔹 Barcode */}
            <div className={`flex flex-col col-span-1 sm:col-span-2 lg:col-span-3 
    ${itemId ? "opacity-50 pointer-events-none" : ""}`}>


              <Input
                label="Barcode"
                value={form.barcode}
                onChange={(v) => {
                  update("barcode", v);
                  verifyBarcode(v); // 🔥 check immediately
                }}
              />

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    const newCode = generateBarcode();
                    update("barcode", newCode);
                    verifyBarcode(newCode);
                  }}
                  className="px-3 py-1 bg-gray-200 rounded text-sm"
                >
                  Generate Barcode
                </button>
              </div>

              {/* 🔹 Barcode Preview */}
              {form.barcode && (
                <div className="mt-3">
                  <Barcode value={form.barcode} height={50} />
                </div>
              )}
            </div>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
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
          <div className="space-y-4 overflow-x-hidden">
            <Input label="SEO Title" value={form.seoTitle} onChange={(v) => update("seoTitle", v)} />
            <Textarea label="SEO Description" value={form.seoDescription} onChange={(v) => update("seoDescription", v)} />
          </div>
        );

      case "Variants":
        return (
          <div className="space-y-4">
            {variants.map((v, i) => (
              <div
                key={i}
                className="border rounded-xl p-4 bg-gray-50 space-y-4"
              >
                {console.log(v, "hasjajsggy")
                }
                {/* HEADER */}
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Variant {i + 1}</h4>
                  {variants.length > 1 && (
                    <button
                      onClick={() => removeVariant(i)}
                      className="text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* VARIANT NAME */}
                <Input
                  label="Variant Name"
                  value={v.variantName}
                  onChange={(val) => updateVariant(i, "variantName", val)}
                />

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                  {/* QUANTITY */}
                  <Input
                    label="Quantity"
                    type="number"
                    value={v.quantityValue}
                    onChange={(val) => updateVariant(i, "quantityValue", val)}
                  />

                  {/* UNIT */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Units</label>
                    <select
                      value={v.quantityUnit}
                      onChange={(e) =>
                        updateVariant(i, "quantityUnit", e.target.value)
                      }
                      className="pl-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                      <option value="ml">ml</option>
                      <option value="l">l</option>
                      <option value="pcs">pcs</option>
                    </select>
                  </div>

                  {/* SKU */}
                  <div className={`flex flex-col ${itemId ? "opacity-50 pointer-events-none" : ""}`}>
                    <Input
                      label="SKU"
                      value={v.sku}
                      onChange={(val) => updateVariant(i, "sku", val)}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateVariant(
                          i,
                          "sku",
                          generateSKU(v.variantName, form.name)
                        )
                      }
                      className="mt-1 text-xs bg-gray-200 px-2 py-1 rounded"
                    >
                      Auto Generate
                    </button>
                  </div>

                  {/* BARCODE */}

                  <div className={`flex flex-col col-span-1 sm:col-span-2 lg:col-span-3 
    ${itemId ? "opacity-50 pointer-events-none" : ""}`}>
                    <Input
                      label="Barcode"
                      value={v.barcode}
                      onChange={(val) => {
                        updateVariant(i, "barcode", val);
                        verifyBarcode(val, i);
                      }}
                    />

                    {!itemId &&
                      <React.Fragment>
                        <div className="flex gap-2 mt-1">
                          <button
                            type="button"
                            onClick={() => {
                              const newCode = generateBarcode();
                              updateVariant(i, "barcode", newCode);
                              verifyBarcode(newCode, i);
                            }}
                            className="text-xs bg-gray-200 px-2 py-1 rounded"
                          >
                            Generate Barcode
                          </button>
                        </div>


                        {/* BARCODE PREVIEW */}
                        {v.barcode && (
                          <div className="mt-3 flex justify-center bg-white p-2 rounded">
                            <div id={`barcode-${i}`}>
                              <Barcode value={v.barcode} height={60} width={2} />
                            </div>
                          </div>
                        )}
                      </React.Fragment>}
                  </div>

                </div>

                {/* PRICING */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Input
                    label="Price"
                    type="number"
                    value={v.price}
                    onChange={(val) => updateVariant(i, "price", val)}
                  />
                  <Input
                    label="Compare Price"
                    type="number"
                    value={v.comparePrice}
                    onChange={(val) => updateVariant(i, "comparePrice", val)}
                  />
                  <Input
                    label="Stock"
                    type="number"
                    value={v.stock}
                    onChange={(val) => updateVariant(i, "stock", val)}
                  />

                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Status</label>
                    <select
                      value={v.status}
                      onChange={(e) =>
                        updateVariant(i, "status", e.target.value)
                      }
                      className="pl-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="outOfStock">Out of Stock</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {/* ADD VARIANT */}
            {!itemId && (
              <button
                onClick={addVariant}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl flex items-center gap-2"
              >
                <Plus size={14} /> Add Variant
              </button>
            )}
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
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 px-2 sm:px-4">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Link to={`/dashboard/catalogue/${modelId}`}
          onClick={() => dispatch(setGetItemsVariantsResponse(null))}
          className="px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl w-fit text-sm sm:text-base">
          {"<"}
        </Link>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {itemId ? "Edit" : "Create New"} Item
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Add new item to your catalogue
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="bg-white rounded-xl border overflow-x-auto">
        <div className="flex border-b min-w-max md:min-w-full">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3 sm:px-4 md:px-6 py-3 text-xs sm:text-sm font-medium whitespace-nowrap ${activeTab === t ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 p-3 sm:p-4 md:p-6">
          <div className="lg:col-span-2 space-y-4">{renderTab()}</div>

          <div className="space-y-4">
            <Card title="Status">
              <select value={form.status} onChange={(e) => update("status", e.target.value)} className="w-full border rounded px-3 py-2 text-xs sm:text-sm">
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
                <option value="outOfStock">Out of stock</option>
              </select>
            </Card>
            <div className="print-area">
              <Card title="Barcodes">

                {/* ITEM BARCODE */}
                {form.barcode && (
                  <div className="mb-5 text-center border-b pb-4">
                    <p className="text-xs text-gray-500 mb-1">Item</p>

                    {form.sku && (
                      <p className="text-sm font-medium mb-1">
                        SKU: {form.sku}
                      </p>
                    )}

                    <div className="bg-white p-2 rounded border inline-block">
                      <div id="barcode-item">
                        <Barcode value={form.barcode} height={60} width={2} />
                      </div>
                    </div>

                    <p className="text-xs mt-1 break-all">{form.barcode}</p>

                    {/* ✅ PRINT BUTTON */}
                    <button
                    className="w-full mt-3 bg-black text-white py-2 rounded text-sm"
  onClick={() =>
    printSingleBarcode({
      name: form.name,
      sku: form.sku,
      barcode: form.barcode,
    })
  }
>
  Print Label
</button>
                  </div>
                )}

                {/* VARIANT BARCODES */}
                {variants.map((v, i) =>
                  v.barcode ? (
                    <div key={i} className="mb-5 text-center border-b pb-4 last:border-none">

                      <p className="text-xs text-gray-500 mb-1">
                        {v.variantName || `Variant ${i + 1}`}
                      </p>

                      {v.sku && (
                        <p className="text-sm font-medium mb-1">
                          SKU: {v.sku}
                        </p>
                      )}

                      <div className="bg-white p-2 rounded border inline-block">
                        <div id={`barcode-${i}`}>
                          <Barcode value={v.barcode} height={60} width={2} />
                        </div>
                      </div>

                      <p className="text-xs mt-1 break-all">{v.barcode}</p>

                      {/* ✅ PRINT BUTTON */}
                     <button
                     className="w-full mt-3 bg-black text-white py-2 rounded text-sm"
  onClick={() =>
    printSingleBarcode({
      name: v.variantName || form.name,
                            sku: v.sku,
                            barcode: v.barcode,
    })
  }
>
  Print Label
</button>
                    </div>
                  ) : null
                )}

                {/* PRINT BUTTON */}
                {/* {(form.barcode || variants.some(v => v.barcode)) && (
                  <>
                    <button
                      onClick={() => window.print()}
                      className="w-full mt-3 bg-black text-white py-2 rounded text-sm"
                    >
                      All Print Labels
                    </button>
                  </>
                )} */}

              </Card>
            </div>

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
              <button onClick={handleSubmit} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-xl flex justify-center gap-2 items-center text-sm sm:text-base">
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
    <label className="block text-xs sm:text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-3 sm:pl-5 pr-3 sm:pr-12 py-2 sm:py-3 border rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none break-all"
    />
  </div>
);

const Textarea = ({ label, value, onChange }) => (
  <div>
    <label className="block text-xs sm:text-sm font-medium mb-1">{label}</label>
    <textarea
      rows={4}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-3 sm:pl-5 pr-3 sm:pr-12 py-2 sm:py-3 border rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
    />
  </div>
);

const Card = ({ title, children }) => (
  <div className="bg-gray-50 border rounded-lg p-3 sm:p-4">
    <h3 className="font-semibold mb-3 text-sm">{title}</h3>
    {children}
  </div>
);

export default CatalogueItemForm;
