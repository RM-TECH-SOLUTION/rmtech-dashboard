import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateCMSData } from "../redux/actions/cmsActions";

const EditSingletonModelForm = ({ model, onClose,deleteCms }) => {
  const dispatch = useDispatch();

  // -------------------------------
  // Extract structure (field names, types, keys)
  // -------------------------------
  const structureFields = model.fields[0].fields.map((f) => ({
    fieldKey: f.fieldKey,
    fieldName: f.fieldName,
    fieldType: f.fieldType,
  }));

  // -------------------------------
  // Extract rows
  // -------------------------------
  const formattedRows = model.fields.map((row) => {
    const obj = {};
    row.fields.forEach((f) => {
      obj[f.fieldKey] = f.fieldValue;
    });
    return obj;
  });

  const [rows, setRows] = useState(formattedRows);

  // -------------------------------
  // Update a cell
  // -------------------------------
  const updateCell = (rowIndex, fieldKey, value) => {
    const updated = [...rows];
    updated[rowIndex][fieldKey] = value;
    setRows(updated);
  };

  // -------------------------------
  // DELETE a row
  // -------------------------------
  const handleDeleteRow = async (rowIndex) => {
    const singletonIndex = rowIndex + 1;

    // 🔥 CALL DELETE API
    await deleteCms({
      data: [
        {
          merchantId: 1,
          modelSlug: model.modelSlug,
          singletonModel: 1,
          singletonModelIndex: singletonIndex,
        },
      ],
    });

    // 🔥 REMOVE FROM UI
    setRows((prev) => prev.filter((_, i) => i !== rowIndex));
  };

  // -------------------------------
  // Submit → UPDATE API
  // -------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = [];

    rows.forEach((rowValues, rowIndex) => {
      const index = rowIndex + 1;

      structureFields.forEach((field) => {
        payload.push({
          merchantId: model.merchantId,
          modelSlug: model.modelSlug,
          modelName: model.modelName,
          fieldName: field.fieldName,
          fieldKey: field.fieldKey,
          fieldType: field.fieldType,
          fieldValue: rowValues[field.fieldKey],
          singletonModel: 1,
          singletonModelIndex: index,
          merchantId:1
        });
      });
    });

    // CALL UPDATE API
    await dispatch(updateCMSData({ data: payload }));

    onClose();
  };

  // -------------------------------
  // Render input based on field type
  // -------------------------------
  const renderInput = (field, rowIndex) => {
    const value = rows[rowIndex][field.fieldKey];

    switch (field.fieldType) {
      case "text":
        return (
          <textarea
            className="border p-2 rounded w-full"
            value={value}
            onChange={(e) => updateCell(rowIndex, field.fieldKey, e.target.value)}
          />
        );

      case "color":
        return (
          <input
            type="color"
            className="border rounded h-10"
            value={value}
            onChange={(e) => updateCell(rowIndex, field.fieldKey, e.target.value)}
          />
        );

      case "image":
        return (
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              updateCell(rowIndex, field.fieldKey, e.target.files?.[0]?.name || "")
            }
          />
        );

      default:
        return (
          <input
            type="text"
            className="border p-2 rounded w-full"
            value={value}
            onChange={(e) => updateCell(rowIndex, field.fieldKey, e.target.value)}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-4xl rounded-lg p-6 space-y-6"
      >
        <h2 className="text-2xl font-bold">Edit Singleton Model</h2>
        <h2 className="text-2xl font-bold">{model.modelName}</h2>


              <div
  className="mt-4 space-y-2 overflow-y-auto"
  style={{ maxHeight: "400px", paddingRight: "6px" }}
>
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="border p-4 rounded-lg bg-gray-50 mb-4 relative"
          >
            {/* DELETE ROW BUTTON */}
            <button
              type="button"
            onClick={() => handleDeleteRow(rowIndex)}
              className="absolute top-3 right-3 text-red-600 hover:text-red-800"
            >
              <Trash2 size={20} />
            </button>

            <h3 className="font-semibold mb-3">Row {rowIndex + 1}</h3>

            <div className="grid grid-cols-2 gap-4">
              {structureFields.map((field) => (
                <div key={field.fieldKey}>
                  <label className="block text-sm font-medium mb-1">
                    {field.fieldName}
                  </label>
                  {renderInput(field, rowIndex)}
                </div>
              ))}
            </div>
          </div>
        ))}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border rounded-xl"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center shadow-lg"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSingletonModelForm;
