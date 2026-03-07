import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateCMSData } from "../redux/actions/cmsActions";

const EditSingletonModelForm = ({ model, onClose, deleteCms }) => {
  const dispatch = useDispatch();

  // -------------------------------
  // Extract structure
  // -------------------------------
  const structureFields = model.fields[0].fields.map((f) => ({
    fieldKey: f.fieldKey,
    fieldName: f.fieldName,
    fieldType: f.fieldType,
  }));

  // -------------------------------
  // Extract rows (KEEP IMAGE URL)
  // -------------------------------
  const formattedRows = model.fields.map((row) => {
    const obj = {
      singletonModelIndex: row.fields[0].singletonModelIndex,
    };

    row.fields.forEach((f) => {
      obj[f.fieldKey] = f.fieldValue; // URL stays here
    });

    return obj;
  });

  const [rows, setRows] = useState(formattedRows);

  // -------------------------------
  // Update text/color/etc
  // -------------------------------
  const updateCell = (rowIndex, key, value) => {
    setRows((prev) => {
      const copy = [...prev];
      copy[rowIndex] = { ...copy[rowIndex], [key]: value };
      return copy;
    });
  };

  // -------------------------------
  // Store image FILE separately
  // -------------------------------
  const updateImageFile = (rowIndex, key, file) => {
    setRows((prev) => {
      const copy = [...prev];
      copy[rowIndex] = {
        ...copy[rowIndex],
        [`${key}__file`]: file, // ✅ file stored separately
      };
      return copy;
    });
  };

  // -------------------------------
  // DELETE ROW
  // -------------------------------
  const handleDeleteRow = async (singletonModelIndex) => {
    await deleteCms({
      data: [
        {
          merchantId: model.merchantId,
          modelSlug: model.modelSlug,
          singletonModel: 1,
          singletonModelIndex,
        },
      ],
    });

    setRows((prev) =>
      prev.filter((r) => r.singletonModelIndex !== singletonModelIndex)
    );
  };

  // -------------------------------
  // SUBMIT
  // -------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = [];

    for (const row of rows) {
      for (const field of structureFields) {
        let fieldValue = row[field.fieldKey];
        const newFile = row[`${field.fieldKey}__file`];

        // IMAGE UPDATE
        if (field.fieldType === "image" && newFile instanceof File) {
          const fd = new FormData();
          fd.append("image", newFile);
          fd.append("merchantId", model.merchantId);

          // ✅ OLD IMAGE URL (string)
          if (typeof fieldValue === "string") {
            fd.append("oldImageUrl", fieldValue);
          }

          const res = await fetch(
            "https://api.rmtechsolution.com/uploadCmsImage",
            { method: "POST", body: fd }
          );

          const json = await res.json();
          if (!json.success) {
            alert("Image upload failed");
            return;
          }

          fieldValue = json.imageUrl; // new URL
        }

        payload.push({
          merchantId: model.merchantId,
          modelSlug: model.modelSlug,
          modelName: model.modelName,
          fieldName: field.fieldName,
          fieldKey: field.fieldKey,
          fieldType: field.fieldType,
          fieldValue,
          singletonModel: 1,
          singletonModelIndex: row.singletonModelIndex,
        });
      }
    }

    await dispatch(updateCMSData({ data: payload }));
    onClose();
  };

  // -------------------------------
  // RENDER INPUT
  // -------------------------------
  const renderInput = (field, rowIndex) => {
    const value = rows[rowIndex][field.fieldKey];

    if (field.fieldType === "image") {
      const file = rows[rowIndex][`${field.fieldKey}__file`];
      const url = rows[rowIndex][field.fieldKey];

      let preview = "";

      if (file instanceof File) {
        preview = URL.createObjectURL(file); // ✅ NEW IMAGE PREVIEW
      } else if (typeof url === "string" && url.length > 0) {
        preview = url; // ✅ OLD IMAGE
      }

      return (
        <div className="space-y-2">
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-32 h-32 object-cover rounded border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          )}

          <input
            type="file"
            accept="image/*"
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            onChange={(e) =>
              updateImageFile(
                rowIndex,
                field.fieldKey,
                e.target.files?.[0]
              )
            }
          />
        </div>
      );
    }


    if (field.fieldType === "color") {
      return (
        <input
          type="color"
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          value={value || "#000000"}
          onChange={(e) =>
            updateCell(rowIndex, field.fieldKey, e.target.value)
          }
        />
      );
    }

    if (field.fieldType === "text") {
      return (
        <textarea
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          value={value || ""}
          onChange={(e) =>
            updateCell(rowIndex, field.fieldKey, e.target.value)
          }
        />
      );
    }

    return (
      <input
        type="text"
        className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        value={value || ""}
        onChange={(e) =>
          updateCell(rowIndex, field.fieldKey, e.target.value)
        }
      />
    );
  };

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-2 sm:p-6 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-5xl rounded-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto space-y-6"
      >
        <h2 className="text-xl sm:text-2xl font-bold sticky top-0 bg-white py-2">Edit Singleton Model</h2>

         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 opacity-60 cursor-not-allowed">
          <input className="border p-2 rounded text-sm" value={model.merchantId} disabled />
          <input className="border p-2 rounded text-sm" value={model.modelName} disabled />
          <input className="border p-2 rounded text-sm" value={model.modelSlug} disabled />
        </div>

        <div className="space-y-4">
          {rows.map((row, rowIndex) => (
            <div
              key={row.singletonModelIndex}
              className="border p-3 sm:p-4 rounded-lg bg-gray-50 relative"
            >
              <button
                type="button"
                onClick={() =>
                  handleDeleteRow(row.singletonModelIndex)
                }
                className="absolute top-2 sm:top-3 right-2 sm:right-3 text-red-600 flex-shrink-0"
              >
                <Trash2 size={18} />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pr-10">
                {structureFields.map((field) => (
                  <div key={field.fieldKey}>
                    <label className="block text-xs sm:text-sm font-medium mb-1">
                      {field.fieldName}
                    </label>
                    {renderInput(field, rowIndex)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 sticky bottom-0 bg-white pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 sm:px-6 py-2 border rounded-xl text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-xl text-sm sm:text-base"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSingletonModelForm;
