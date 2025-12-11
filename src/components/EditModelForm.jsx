import React, { useState, useEffect } from "react";
import { Trash2, Edit } from "lucide-react";

const EditModelForm = ({ model, onClose }) => {
  const [formData, setFormData] = useState({
    merchantId: "",
    modelName: "",
    modelSlug: "",
    singletonModel: 0,
    fields: [],
  });

  const [editIndex, setEditIndex] = useState(null);
  const [editField, setEditField] = useState(null);

  console.log(formData,"formDataformData");
  

  useEffect(() => {
    if (model) {
      setFormData({
        merchantId: model.merchantId,
        modelName: model.modelName,
        modelSlug: model.modelSlug,
        singletonModel: model.singletonModel,
        fields: model.fields || [],
      });
    }
  }, [model]);

  const renderDynamicField = (field, setField) => {
    switch (field.fieldType) {
      case "string":
        return (
          <input
            className="border p-2 rounded w-full"
            value={field.fieldValue}
            onChange={(e) => setField({ ...field, fieldValue: e.target.value })}
          />
        );
      case "text":
        return (
          <textarea
            className="border p-2 rounded w-full"
            value={field.fieldValue}
            onChange={(e) => setField({ ...field, fieldValue: e.target.value })}
          />
        );
      case "number":
        return (
          <input
            type="number"
            className="border p-2 rounded w-full"
            value={field.fieldValue}
            onChange={(e) => setField({ ...field, fieldValue: e.target.value })}
          />
        );
      case "boolean":
        return (
          <select
            className="border p-2 rounded w-full"
            value={field.fieldValue}
            onChange={(e) => setField({ ...field, fieldValue: e.target.value })}
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
            className="border p-2 rounded h-10"
            value={field.fieldValue || "#000000"}
            onChange={(e) => setField({ ...field, fieldValue: e.target.value })}
          />
        );
      case "image":
        return (
          <input
            type="file"
            className="border p-2 rounded"
            accept="image/*"
            onChange={(e) =>
              setField({
                ...field,
                fieldValue: e.target.files[0]?.name || "",
              })
            }
          />
        );
      default:
        return null;
    }
  };

  const handleSaveField = () => {
    const updated = [...formData.fields];
    updated[editIndex] = editField;

    setFormData({ ...formData, fields: updated });
    setEditIndex(null);
    setEditField(null);
  };

  const handleDeleteField = (idx) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // you can dispatch update API here
    console.log("UPDATED MODEL:", formData);

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-3xl rounded-lg p-6 space-y-6"
      >
        <h2 className="text-xl font-semibold">Edit Model</h2>

        {/* BASIC INFO (READ ONLY) */}
        <div className="grid grid-cols-3 gap-4 opacity-60 cursor-not-allowed">
          <input className="border p-2 rounded" value={formData.merchantId} disabled />
          <input className="border p-2 rounded" value={formData.modelName} disabled />
          <input className="border p-2 rounded" value={formData.modelSlug} disabled />
        </div>

        {/* FIELD LIST */}
        <div className="mt-4 space-y-2">
          {formData.singletonModel === 1 ? (
            /* TABLE FORMAT */
            <div className="border rounded-lg">
              <div className="grid grid-cols-3 p-3 bg-gray-100 font-semibold border-b">
                <div>Field Name</div>
                <div>Field Type</div>
                <div className="text-right pr-4">Actions</div>
              </div>

              {formData.fields.map((field, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-3 p-3 border-b items-center"
                >
                  <div>{field.fieldName}</div>
                  <div>{field.fieldValue}</div>
                  <div>{field.fieldType}</div>

                  <div className="flex justify-end gap-3 pr-4">
                    <button
                      type="button"
                      className="text-blue-600 p-2 hover:bg-blue-100 rounded"
                      onClick={() => {
                        setEditIndex(idx);
                        setEditField(field);
                      }}
                    >
                      <Edit size={18} />
                    </button>

                    <button
                      type="button"
                      className="text-red-600 p-2 hover:bg-red-100 rounded"
                      onClick={() => handleDeleteField(idx)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* NORMAL MODE */
            formData.fields.map((field, idx) => (
              <div key={idx} className="border p-3 rounded flex justify-between">
                <div>
                  <b>Name:- {field.fieldName}</b> — Value:- {field.fieldValue} - {field.fieldType}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    className="text-blue-600 p-2 hover:bg-blue-100 rounded"
                    onClick={() => {
                      setEditIndex(idx);
                      setEditField(field);
                    }}
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    type="button"
                    className="text-red-600 p-2 hover:bg-red-100 rounded"
                    onClick={() => handleDeleteField(idx)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* EDIT POPUP */}
        {editIndex !== null && (
          <div className="bg-gray-100 p-4 rounded-lg mt-4 space-y-3">
            <h3 className="font-semibold">Edit Field</h3>

            <input
              className="border p-2 rounded w-full"
              value={editField.fieldName}
              onChange={(e) =>
                setEditField({ ...editField, fieldName: e.target.value })
              }
            />

            <input
              className="border p-2 rounded w-full"
              value={editField.fieldKey}
              onChange={(e) =>
                setEditField({ ...editField, fieldKey: e.target.value })
              }
            />

            <select
              className="border p-2 rounded w-full"
              value={editField.fieldType}
              onChange={(e) =>
                setEditField({ ...editField, fieldType: e.target.value })
              }
            >
              <option value="string">String</option>
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="color">Color</option>
              <option value="image">Image</option>
            </select>

            {renderDynamicField(editField, setEditField)}

            <div className="flex gap-3">
              <button
                type="button"
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleSaveField}
              >
                Save
              </button>

              <button
                type="button"
                className="px-4 py-2 rounded border"
                onClick={() => {
                  setEditField(null);
                  setEditIndex(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* FOOTER BUTTONS */}
        <div className="flex justify-end gap-3 mt-5">
          <button type="button" onClick={onClose} className="border px-4 py-2 rounded">
            Close
          </button>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditModelForm;
