import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { addCMSData } from "../redux/actions/cmsActions";

const SingletonModelForm = ({ baseData, onClose ,setMode}) => {
  const dispatch = useDispatch();

  // baseData contains merchantId, modelName, modelSlug
  const [formData, setFormData] = useState({
    ...baseData,
    fields: [],   // structure fields
    rows: [],     // table rows
  });

  const [newField, setNewField] = useState({
    fieldName: "",
    fieldKey: "",
    fieldType: "string",
  });

  // Add structure field (columns)
  const handleAddField = () => {
    if (!newField.fieldName || !newField.fieldKey) {
      alert("Field Name & Field Key required");
      return;
    }

    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, { ...newField }],
      rows: [], // clear rows because the structure changed
    }));

    setNewField({ fieldName: "", fieldKey: "", fieldType: "string" });
  };

  // Add row
  const addRow = () => {
    const row = {};
    formData.fields.forEach(f => (row[f.fieldKey] = ""));
    setFormData(prev => ({
      ...prev,
      rows: [...prev.rows, row],
    }));
  };

  // Update cell
  const updateCell = (rowIndex, key, value) => {
    const updated = [...formData.rows];
    updated[rowIndex][key] = value;
    setFormData(prev => ({
      ...prev,
      rows: updated,
    }));
  };

  // Delete row
  const deleteRow = (rowIndex) => {
    setFormData(prev => ({
      ...prev,
      rows: prev.rows.filter((_, i) => i !== rowIndex),
    }));
  };

  // Render dynamic input
  const renderCell = (field, rowIndex) => {
    const value = formData.rows[rowIndex][field.fieldKey];

    switch (field.fieldType) {
      case "string":
        return (
          <input
            className="border p-2 rounded w-full"
            value={value}
            onChange={(e) =>
              updateCell(rowIndex, field.fieldKey, e.target.value)
            }
          />
        );

      case "text":
        return (
          <textarea
            className="border p-2 rounded w-full"
            value={value}
            onChange={(e) =>
              updateCell(rowIndex, field.fieldKey, e.target.value)
            }
          />
        );

      case "number":
        return (
          <input
            type="number"
            className="border p-2 rounded w-full"
            value={value}
            onChange={(e) =>
              updateCell(rowIndex, field.fieldKey, e.target.value)
            }
          />
        );

      case "boolean":
        return (
          <select
            className="border p-2 rounded w-full"
            value={value}
            onChange={(e) =>
              updateCell(rowIndex, field.fieldKey, e.target.value)
            }
          >
            <option value="">Select</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        );

      case "color":
        return (
          <input
            type="color"
            className="border p-2 rounded h-10 w-full"
            value={value || "#000000"}
            onChange={(e) =>
              updateCell(rowIndex, field.fieldKey, e.target.value)
            }
          />
        );

      case "image":
        return (
          <input
            type="file"
            accept="image/*"
            className="border p-2 rounded"
            onChange={(e) =>
              updateCell(
                rowIndex,
                field.fieldKey,
                e.target.files?.[0]?.name || ""
              )
            }
          />
        );

      default:
        return null;
    }
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = [];

    // Convert table rows → CMS format
    formData.rows.forEach((row) => {
      Object.keys(row).forEach((key) => {
        const field = formData.fields.find((f) => f.fieldKey === key);

        payload.push({
          merchantId: Number(formData.merchantId),
          modelSlug: formData.modelSlug,
          modelName: formData.modelName,
          fieldName: field.fieldName,
          fieldKey: key,
          fieldType: field.fieldType,
          fieldValue: row[key],
          singletonModel: 1,
        });
      });
    });

    dispatch(addCMSData(payload));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-4xl rounded-lg p-6 space-y-6"
      >
        <h2 className="text-2xl font-bold">Singleton Model</h2>

        {/* BASIC INFO READ ONLY */}
        <div className="grid grid-cols-3 gap-4">
          <input
            className="border p-2 rounded"
            placeholder="Merchant ID"
            value={formData.merchantId}
            onChange={(e) =>
              setFormData({ ...formData, merchantId: e.target.value })
            }
          />

          <input
            className="border p-2 rounded"
            placeholder="Model Name"
            value={formData.modelName}
            onChange={(e) =>
              setFormData({ ...formData, modelName: e.target.value })
            }
          />

          <input
            className="border p-2 rounded"
            placeholder="Model Slug"
            value={formData.modelSlug}
            onChange={(e) =>
              setFormData({ ...formData, modelSlug: e.target.value })
            }
          />
        </div>

            {/* <div className="flex items-center gap-2">
  <input
    type="checkbox"
    checked={formData.singletonModel === 1}
    onChange={(e) => {
      const isSingleton = e.target.checked;

      setFormData({
        ...formData,
        singletonModel: isSingleton ? 1 : 0,
      });

      setMode(isSingleton ? "create" : "singleton");
    }}
    className="w-4 h-4"
  />
  <label>Create Model</label>
</div> */}
          <button
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center shadow-lg"
          onClick={() => {
            setFormData({ ...formData, singletonModel: 0 });
              setMode("create");
          }}
        >
          ← Create Model
        </button>

        {/* ADD STRUCTURE FIELD */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Add Table Columns</h3>

          <div className="grid grid-cols-3 gap-3">
            <input
              className="border p-2 rounded"
              placeholder="Field Name"
              value={newField.fieldName}
              onChange={(e) =>
                setNewField({ ...newField, fieldName: e.target.value })
              }
            />

            <input
              className="border p-2 rounded"
              placeholder="Field Key"
              value={newField.fieldKey}
              onChange={(e) =>
                setNewField({ ...newField, fieldKey: e.target.value })
              }
            />

            <select
              className="border p-2 rounded"
              value={newField.fieldType}
              onChange={(e) =>
                setNewField({ ...newField, fieldType: e.target.value })
              }
            >
              <option value="string">String</option>
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="color">Color</option>
              <option value="image">Image</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleAddField}
            style={{marginTop:20}}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center shadow-lg"
          >
            Add Column
          </button>
        </div>

        {/* TABLE UI */}
        {formData.fields.length > 0 && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Table Rows</h3>

            {/* Table Header */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3 font-semibold border-b pb-2">
              {formData.fields.map((f) => (
                <div key={f.fieldKey}>{f.fieldName}</div>
              ))}
              <div>Actions</div>
            </div>

            {/* Table Rows */}
            {formData.rows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3 py-2 border-b items-center"
              >
                {formData.fields.map((f) => (
                  <div key={f.fieldKey}>{renderCell(f, rowIndex)}</div>
                ))}

                <button
                  type="button"
                  onClick={() => deleteRow(rowIndex)}
                  className="text-red-600"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addRow}
              style={{marginTop:20}}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center shadow-lg"
            >
              + Add Row
            </button>
          </div>
        )}

        {/* FOOTER */}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-6 py-2 border rounded-xl">
            Cancel
          </button>
          <button type="submit" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center shadow-lg">
            Save Model
          </button>
        </div>
      </form>
    </div>
  );
};

export default SingletonModelForm;
