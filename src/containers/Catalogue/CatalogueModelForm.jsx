import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import { useDispatch } from "react-redux";
import { createCatalogModel } from "../../redux/actions/catalogActions";

const CatalogueModelForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("token");

  // ✅ NEW: store selected file (NO UI CHANGE)
  const [imageFile, setImageFile] = useState(null);

  const [form, setForm] = useState({
    merchantId: token || "",
    name: "",
    slug: "",
    description: "",
    status: "active",
    image: null, // used only for preview + final payload
  });

  /* ---------------- IMAGE SELECT (NO UPLOAD HERE) ---------------- */

  const handleImageUpload = (file) => {
    if (!file) return;

    // store file for later upload
    setImageFile(file);

    // preview only (same UI behaviour)
    setForm((prev) => ({
      ...prev,
      image: URL.createObjectURL(file),
    }));
  };

  const removeImage = () => {
    setImageFile(null);
    setForm((prev) => ({
      ...prev,
      image: null,
    }));
  };

  /* ---------------- UPLOAD IMAGE BEFORE SUBMIT ---------------- */

  const uploadImageBeforeCreate = async () => {
    if (!imageFile) return null;

    const fd = new FormData();
    fd.append("image", imageFile);
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
      throw new Error("Image upload failed");
    }

    return json.imageUrl;
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    if (!form.merchantId || !form.name || !form.slug) {
      alert("Merchant ID, catalogue name and slug are required");
      return;
    }

    setSaving(true);
    try {
      let uploadedImageUrl = null;

      // ✅ upload image FIRST
      if (imageFile) {
        uploadedImageUrl = await uploadImageBeforeCreate();
      }

      // ✅ create catalogue with uploaded image
      await dispatch(
        createCatalogModel({
          ...form,
          image: uploadedImageUrl,
        })
      );

      alert("Catalogue model created successfully");
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to create catalogue model");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- UI (UNCHANGED) ---------------- */

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-bold">Create Catalogue</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">

          {/* MERCHANT ID */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Merchant ID *
            </label>
            <input
              value={form.merchantId}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-100"
            />
          </div>

          {/* CATALOGUE NAME */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Catalogue Name *
            </label>
            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* SLUG */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Slug *
            </label>
            <input
              value={form.slug}
              onChange={(e) =>
                setForm({ ...form, slug: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* STATUS */}
          {/* <div>
            <label className="block text-sm font-medium mb-1">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div> */}

          {/* SINGLE IMAGE */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Catalogue Image
            </label>

            {!form.image ? (
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer"
                onClick={() =>
                  document.getElementById("catalogue-image-upload").click()
                }
              >
                <Upload className="mx-auto mb-2" />
                <p className="text-gray-500 text-sm">
                  Click to upload image
                </p>

                <input
                  id="catalogue-image-upload"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    handleImageUpload(e.target.files[0])
                  }
                />
              </div>
            ) : (
              <div className="relative w-40">
                <img
                  src={form.image}
                  alt="catalogue"
                  className="h-28 w-full object-cover rounded"
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl flex items-center"
          >
            {saving ? "Saving..." : "Create Catalogue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CatalogueModelForm;
