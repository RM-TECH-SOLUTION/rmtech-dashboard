import React, { useState } from "react";
import { Trash2,Edit } from "lucide-react";
import { useDispatch } from "react-redux";
import { addCMSData } from "../redux/actions/cmsActions";

const CreateModelForm = ({ onClose, setMode,uploadCmsImage }) => {
  const dispatch = useDispatch();
  const [imageFiles, setImageFiles] = useState({});


  const [formData, setFormData] = useState({
    merchantId: "",
    modelName: "",
    modelSlug: "",
    singletonModel: 0,
    fields: [],
    rows: [],
  });

  const [newField, setNewField] = useState({
    fieldName: "",
    fieldKey: "",
    fieldType: "string",
    fieldValue: "",
  });

  // ----------------------------------------------------
  // ADD STRUCTURE FIELD
  // ----------------------------------------------------
  const handleAddField = () => {
    if (!newField.fieldName || !newField.fieldKey) {
      alert("Field Name & Field Key are required");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, { ...newField }],
      rows: [],
    }));

    setNewField({
      fieldName: "",
      fieldKey: "",
      fieldType: "string",
      fieldValue: "",
    });
  };

  // ----------------------------------------------------
  // RENDER DYNAMIC FIELD VALUE INPUT
  // ----------------------------------------------------
  const renderDynamicNewFieldInput = () => {
    switch (newField.fieldType) {
      case "string":
        return (
          <input
            className="border p-2 rounded"
            placeholder="Value"
            value={newField.fieldValue}
            onChange={(e) =>
              setNewField({ ...newField, fieldValue: e.target.value })
            }
          />
        );

      case "text":
        return (
          <textarea
            className="border p-2 rounded"
            placeholder="Value"
            value={newField.fieldValue}
            onChange={(e) =>
              setNewField({ ...newField, fieldValue: e.target.value })
            }
          />
        );

      case "number":
        return (
          <input
            type="number"
            className="border p-2 rounded"
            value={newField.fieldValue}
            onChange={(e) =>
              setNewField({ ...newField, fieldValue: e.target.value })
            }
          />
        );

      case "boolean":
        return (
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
        );

      case "color":
        return (
          <input
            type="color"
            className="border p-2 rounded"
            style={{width:"100%",height:"100%"}}
            value={newField.fieldValue || "#000000"}
            onChange={(e) =>
              setNewField({ ...newField, fieldValue: e.target.value })
            }
          />
        );

  case "image":
  return (
    <input
      type="file"
      accept="image/*"
      className="border p-2 rounded"
      onChange={(e) => {
        const file = e.target.files[0];
        if (!file) return;

        // store actual file
        setImageFiles((prev) => ({
          ...prev,
          [newField.fieldKey]: file,
        }));

        // store name temporarily for UI
        setNewField({
          ...newField,
          fieldValue: file.name,
        });
      }}
    />
  );


      default:
        return (
          <input
            className="border p-2 rounded"
            placeholder="Value"
            value={newField.fieldValue}
            onChange={(e) =>
              setNewField({ ...newField, fieldValue: e.target.value })
            }
          />
        );
    }
  };


  // ----------------------------------------------------
  // SUBMIT
  // ----------------------------------------------------
const handleSubmit = async (e) => {
  e.preventDefault();

  let payload = [];

  if (formData.singletonModel === 0) {
    for (const field of formData.fields) {
      let fieldValue = field.fieldValue;

      // ✅ IMAGE UPLOAD
      if (field.fieldType === "image" && imageFiles[field.fieldKey]) {
        const fd = new FormData();
        fd.append("image", imageFiles[field.fieldKey]);
        fd.append("merchantId", Number(formData.merchantId)); 

        const res = await uploadCmsImage(fd);

        fieldValue = res.imageUrl; 
      }

      payload.push({
        merchantId: Number(formData.merchantId),
        modelSlug: formData.modelSlug,
        modelName: formData.modelName,
        fieldName: field.fieldName,
        fieldKey: field.fieldKey,
        fieldType: field.fieldType,
        fieldValue,
        singletonModel: 0,
      });
    }
  }

  await dispatch(addCMSData(payload));
  onClose();
};




  // ----------------------------------------------------
  // JSX UI
  // ----------------------------------------------------
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-4xl rounded-lg p-6 space-y-6"
      >
        <h2 className="text-2xl font-bold">Create Model</h2>

        {/* BASIC INFO */}
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

        {/* SINGLETON CHECKBOX */}
        <button
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center shadow-lg"
          onClick={() => {
            setFormData({ ...formData, singletonModel: 1 });
              setMode("singleton");
          }}
        >
          Create Singleton Model →
        </button>

        {/* ADD FIELD SECTION */}
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

            {/* DYNAMIC FIELD VALUE UI */}
            {renderDynamicNewFieldInput()}
          </div>

          <button
            type="button"
            onClick={handleAddField}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center shadow-lg"
            style={{marginTop:20}}
          >
            Add Field
          </button>
        </div>

        {/* FIELD LIST (ONLY NON-SINGLETON) */}
       {/* FIELD LIST (ONLY NON-SINGLETON) */}
{formData.singletonModel === 0 && formData.fields.length > 0 && (
  <div className="mt-4 border rounded-lg p-4">
    <h3 className="font-semibold mb-3">Fields List</h3>

    <div className="grid grid-cols-5 font-semibold border-b pb-2">
      <div>Field Name</div>
      <div>Key</div>
      <div>Type</div>
      <div>Value</div>
      <div>Actions</div>
    </div>

    {formData.fields.map((f, idx) => (
      <div
        key={idx}
        className="grid grid-cols-5 py-2 border-b items-center"
      >
        <div>{f.fieldName}</div>
        <div>{f.fieldKey}</div>
        <div>{f.fieldType}</div>
        <div>
  {f.fieldType === "image" && imageFiles[f.fieldKey] ? (
    <img
      src={URL.createObjectURL(imageFiles[f.fieldKey])}
      alt="preview"
      className="w-16 h-16 object-cover rounded border"
    />
  ) : (
    f.fieldValue
  )}
</div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-3">
          {/* EDIT ICON */}
          <button
            type="button"
            className="text-blue-600 hover:bg-blue-100 p-2 rounded"
            onClick={() => {
              setNewField(f); // Load values in input fields
              setFormData((prev) => ({
                ...prev,
                fields: prev.fields.filter((_, i) => i !== idx), // Remove old and user will re-add after editing
              }));
            }}
          >
            <Edit size={18} />
          </button>

          {/* DELETE ICON */}
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
)}


        {/* FOOTER BUTTONS */}
        <div className="flex justify-end gap-4">
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

export default CreateModelForm;
