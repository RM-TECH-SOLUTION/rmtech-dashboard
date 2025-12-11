import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCMSData } from "../redux/actions/cmsActions";
import { Trash2, Edit } from "lucide-react";

const ModelForm = ({ model, onClose }) => {
  const dispatch = useDispatch();
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
  }, [model, isEdit]);

  // For new field (add mode only)
  const [newField, setNewField] = useState({
    fieldName: "",
    fieldKey: "",
    fieldType: "string",
    fieldValue: "",
  });

  // For editing fields
  const [editIndex, setEditIndex] = useState(null);
  const [editField, setEditField] = useState(null);

  // ADD FIELD
  const handleAddField = () => {
    if (!newField.fieldName || !newField.fieldKey) {
      alert("Field Name & Key are required");
      return;
    }

    const fieldToAdd = {
      ...newField,
      fieldValue: formData.singletonModel === 1 ? "" : newField.fieldValue,
    };

    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, fieldToAdd],
    }));

    setNewField({
      fieldName: "",
      fieldKey: "",
      fieldType: "string",
      fieldValue: "",
    });
  };

  // ON SUBMIT
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

  // DYNAMIC FIELD INPUT UI
  const renderDynamicField = (field, setField) => {
    switch (field.fieldType) {
      case "string":
        return (
          <input
            className="border p-2 rounded w-full"
            value={field.fieldValue}
            onChange={(e) =>
              setField({ ...field, fieldValue: e.target.value })
            }
          />
        );

      case "text":
        return (
          <textarea
            className="border p-2 rounded w-full"
            value={field.fieldValue}
            onChange={(e) =>
              setField({ ...field, fieldValue: e.target.value })
            }
          />
        );

      case "number":
        return (
          <input
            type="number"
            className="border p-2 rounded w-full"
            value={field.fieldValue}
            onChange={(e) =>
              setField({ ...field, fieldValue: e.target.value })
            }
          />
        );

      case "boolean":
        return (
          <select
            className="border p-2 rounded w-full"
            value={field.fieldValue}
            onChange={(e) =>
              setField({ ...field, fieldValue: e.target.value })
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
            value={field.fieldValue || "#000000"}
            onChange={(e) =>
              setField({ ...field, fieldValue: e.target.value })
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
            disabled={isEdit}
            onChange={(e) =>
              setFormData({ ...formData, merchantId: e.target.value })
            }
          />

          <input
            className="border p-2 rounded"
            placeholder="Model Name"
            value={formData.modelName}
            disabled={isEdit}
            onChange={(e) =>
              setFormData({ ...formData, modelName: e.target.value })
            }
          />

          <input
            className="border p-2 rounded"
            placeholder="Model Slug"
            value={formData.modelSlug}
            disabled={isEdit}
            onChange={(e) =>
              setFormData({ ...formData, modelSlug: e.target.value })
            }
          />
        </div>

        {/* SINGLETON CHECKBOX (ONLY IN CREATE MODE) */}
        {!isEdit && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.singletonModel === 1}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  singletonModel: e.target.checked ? 1 : 0,
                })
              }
              className="w-4 h-4"
            />
            <label>Singleton Model (Only one entry allowed)</label>
          </div>
        )}

        {/* ADD FIELD UI (ONLY CREATE MODE) */}
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

              {/* hide value input if singleton */}
              {formData.singletonModel === 0 &&
                renderDynamicField(newField, setNewField)}
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

        {/* --------------------------------------------- */}
        {/* FIELD LIST SECTION */}
        {/* --------------------------------------------- */}

        <div className="mt-4 space-y-2">
          {/* SINGLETON MODEL → TABLE STYLE LIST */}
          {formData.singletonModel === 1 ? (
            <div className="border rounded-lg">

              {/* HEADER */}
              <div className="grid grid-cols-3 p-3 font-semibold bg-gray-100 border-b">
                <div>Field Name</div>
                <div>Field Type</div>
                <div className="text-right pr-4">Actions</div>
              </div>

              {formData.fields.map((field, idx) => (
                <div key={idx} className="grid grid-cols-3 p-3 border-b items-center">

                  <div>{field.fieldName}</div>
                  <div>{field.fieldValue}</div>
                  <div>{field.fieldType}</div>

                  <div className="flex justify-end gap-3 pr-4">
                    <button
                      type="button"
                      className="text-blue-600 hover:bg-blue-100 p-2 rounded"
                      onClick={() => {
                        setEditIndex(idx);
                        setEditField(field);
                      }}
                    >
                      <Edit size={18} />
                    </button>

                    <button
                      type="button"
                      className="text-red-600 hover:bg-red-100 p-2 rounded"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          fields: prev.fields.filter((_, i) => i !== idx),
                        }))
                      }
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* NORMAL MODEL FIELD LIST */
            formData.fields.map((field, idx) => (
              <div key={idx} className="p-3 border rounded flex justify-between items-center">

                {editIndex === idx ? (
                  <div className="w-full space-y-2">
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

                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="px-3 py-1 bg-green-600 text-white rounded"
                        onClick={() => {
                          let updated = [...formData.fields];
                          updated[idx] = editField;
                          setFormData({ ...formData, fields: updated });
                          setEditIndex(null);
                          setEditField(null);
                        }}
                      >
                        Save
                      </button>

                      <button
                        type="button"
                        className="px-3 py-1 bg-gray-300 rounded"
                        onClick={() => {
                          setEditIndex(null);
                          setEditField(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <b>{field.fieldName}</b> — {field.fieldValue} ({field.fieldType})
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                        onClick={() => {
                          setEditIndex(idx);
                          setEditField(field);
                        }}
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        type="button"
                        className="p-2 text-red-600 hover:bg-red-100 rounded"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            fields: prev.fields.filter((_, i) => i !== idx),
                          }))
                        }
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* FOOTER BUTTONS */}
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
