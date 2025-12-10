import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCMSData } from "../redux/actions/cmsActions";
import { Trash2 } from "lucide-react";

const ModelForm = ({ model, onClose }) => {
  const dispatch = useDispatch();

  // Detect Edit Mode
  const isEdit = Boolean(model);

  const [formData, setFormData] = useState({
    merchantId: "",
    modelName: "",
    modelSlug: "",
    singletonModel: 0,
    fields: [],
  });

  // Prefill when editing
  useEffect(() => {
    if (isEdit) {
      setFormData({
        merchantId: model.merchantId || "",
        modelName: model.modelName || "",
        modelSlug: model.modelSlug || "",
        singletonModel: model.singletonModel || 0,
        fields: model.fields || [],
      });
    }
  }, [model]);

  const [newField, setNewField] = useState({
    fieldName: "",
    fieldKey: "",
    fieldType: "string",
    fieldValue: "",
  });

  // Add Field (ONLY when creating model)
  const handleAddField = () => {
    if (!newField.fieldName || !newField.fieldKey) {
      alert("Field Name & Field Key required");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, { ...newField }],
    }));

    setNewField({
      fieldName: "",
      fieldKey: "",
      fieldType: "string",
      fieldValue: "",
    });
  };

  // Submit Form
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = formData.fields.map((f) => ({
      merchantId: Number(formData.merchantId),
      modelSlug: formData.modelSlug,
      modelName: formData.modelName,
      fieldName: f.fieldName,
      fieldKey: f.fieldKey,
      fieldType: f.fieldType,
      fieldValue: f.fieldValue || "",
      singletonModel: formData.singletonModel ? 1 : 0,
    }));

    dispatch(addCMSData(payload));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-3xl rounded-lg p-6 space-y-6"
      >
        <h2 className="text-xl font-semibold">
          {isEdit ? "Edit Model" : "Create New Model"}
        </h2>

        {/* BASIC INFO */}
        <div className="grid grid-cols-3 gap-4">

          <input
            className="border p-2 rounded"
            placeholder="Merchant ID"
            value={formData.merchantId}
            disabled={isEdit}           // Disable during edit
            onChange={(e) =>
              setFormData({ ...formData, merchantId: e.target.value })
            }
          />

          <input
            className="border p-2 rounded"
            placeholder="Model Name"
            value={formData.modelName}
            disabled={isEdit}          // Disable during edit
            onChange={(e) =>
              setFormData({ ...formData, modelName: e.target.value })
            }
          />

          <input
            className="border p-2 rounded"
            placeholder="Model Slug"
            value={formData.modelSlug}
            disabled={isEdit}          // Disable during edit
            onChange={(e) =>
              setFormData({ ...formData, modelSlug: e.target.value })
            }
          />
        </div>

        {/* SINGLETON CHECKBOX */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.singletonModel === 1}
            disabled={isEdit}          // disable when editing
            onChange={(e) =>
              setFormData({
                ...formData,
                singletonModel: e.target.checked ? 1 : 0,
              })
            }
            className="w-4 h-4"
          />
          <label className="text-sm font-medium">
            Singleton Model (Only one entry allowed)
          </label>
        </div>

        {/* ONLY SHOW ADD-FIELD UI IN CREATE MODE */}
        {!isEdit && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Add Fields</h3>

            <div className="grid grid-cols-4 gap-3">
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

              {/* Dynamic Default UI */}
              {newField.fieldType === "string" && (
                <input
                  className="border p-2 rounded"
                  placeholder="Default Value"
                  value={newField.fieldValue}
                  onChange={(e) =>
                    setNewField({ ...newField, fieldValue: e.target.value })
                  }
                />
              )}

              {newField.fieldType === "text" && (
                <textarea
                  className="border p-2 rounded"
                  placeholder="Default Text"
                  value={newField.fieldValue}
                  onChange={(e) =>
                    setNewField({ ...newField, fieldValue: e.target.value })
                  }
                />
              )}

              {newField.fieldType === "number" && (
                <input
                  type="number"
                  className="border p-2 rounded"
                  placeholder="Default Number"
                  value={newField.fieldValue}
                  onChange={(e) =>
                    setNewField({ ...newField, fieldValue: e.target.value })
                  }
                />
              )}

              {newField.fieldType === "boolean" && (
                <select
                  className="border p-2 rounded"
                  value={newField.fieldValue}
                  onChange={(e) =>
                    setNewField({ ...newField, fieldValue: e.target.value })
                  }
                >
                  <option value="">Select</option>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              )}

              {newField.fieldType === "color" && (
                <input
                  type="color"
                  className="border p-2 rounded h-10"
                  value={newField.fieldValue || "#000000"}
                  onChange={(e) =>
                    setNewField({ ...newField, fieldValue: e.target.value })
                  }
                />
              )}

              {newField.fieldType === "image" && (
                <input
                  type="file"
                  accept="image/*"
                  className="border p-2 rounded"
                  onChange={(e) =>
                    setNewField({
                      ...newField,
                      fieldValue: e.target.files[0]?.name || "",
                    })
                  }
                />
              )}
            </div>

            <button
              type="button"
              onClick={handleAddField}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Field
            </button>
          </div>
        )}

        {/* FIELD LIST (Always show) */}
        <div className="mt-4 space-y-2">
          {formData.fields.map((f, idx) => (
            <div
              key={idx}
              className="p-2 border rounded flex justify-between items-center"
            >
              <div>
                <b>{f.fieldName}</b> — {f.fieldValue} ({f.fieldType})
              </div>

              {/* DELETE FIELD BUTTON */}
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    fields: prev.fields.filter((_, i) => i !== idx),
                  }))
                }
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save Model
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModelForm;
