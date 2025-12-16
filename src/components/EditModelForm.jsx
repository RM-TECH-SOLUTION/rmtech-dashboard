import React, { useState, useEffect } from "react";
import { Trash2, Edit } from "lucide-react";

const EditModelForm = ({ model, onClose,updateCMSData,deleteCms }) => {
  const [formData, setFormData] = useState({
    merchantId: "",
    modelName: "",
    modelSlug: "",
    singletonModel: 0,
    fields: [],
  });

  const [editIndex, setEditIndex] = useState(null);
  const [editField, setEditField] = useState(null);

  console.log(editField,"formDataformData");
  

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
    <div className="space-y-2">
      {/* IMAGE PREVIEW */}
      {field.fieldValue && (
        <img
          src={
            field.fieldValue instanceof File
              ? URL.createObjectURL(field.fieldValue)
              : field.fieldValue
          }
          alt={field.fieldName}
          className="w-24 h-24 object-cover rounded border"
        />
      )}

      {/* FILE INPUT */}
      <input
        type="file"
        className="border p-2 rounded w-full"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          setField({
            ...field,
            fieldValue: file, // ✅ store File, not name
          });
        }}
      />
    </div>
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
  const field = formData.fields[idx];

  deleteCms({
    data: [
      {
        merchantId: 1,
        modelSlug: formData.modelSlug,
        fieldKey: field.fieldKey,
        singletonModel: formData.singletonModel ? 1 : 0,
        singletonModelIndex: 0
      }
    ]
  });

  // 🔥 Update UI immediately
  setFormData((prev) => ({
    ...prev,
    fields: prev.fields.filter((_, i) => i !== idx),
  }));
};


const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = [];

  for (const field of formData.fields) {
    let fieldValue = field.fieldValue;

    // 🔥 IMAGE HANDLING
    if (field.fieldType === "image" && fieldValue instanceof File) {
      const fd = new FormData();
      fd.append("image", fieldValue);
      fd.append("merchantId", 1);

      // optional: delete old image
      if (typeof model?.fields?.find(f => f.fieldKey === field.fieldKey)?.fieldValue === "string") {
        fd.append(
          "oldImageUrl",
          model.fields.find(f => f.fieldKey === field.fieldKey).fieldValue
        );
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

      fieldValue = json.imageUrl; // ✅ CONVERT FILE → URL
    }

    payload.push({
      merchantId: 1,
      modelSlug: formData.modelSlug,
      modelName: formData.modelName,
      fieldKey: field.fieldKey,
      fieldName: field.fieldName,
      fieldType: field.fieldType,
      fieldValue, // ✅ ALWAYS STRING FOR API
      singletonModel: formData.singletonModel ? 1 : 0,
      singletonModelIndex: 0,
    });
  }

  await updateCMSData({ data: payload });
  onClose();
};



  return (
    <div 
    className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4"
    
    >
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
         <div
  className="mt-4 space-y-2 overflow-y-auto"
  style={{ maxHeight: "200px", paddingRight: "6px" }}
>
  {formData.fields.map((field, idx) => (
    <div
      key={idx}
      className="border p-3 rounded flex justify-between bg-white shadow-sm"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span style={{ fontWeight: "bold", marginRight: 5 }}>{field.fieldName} - </span>
        {field.fieldType === "image" && field.fieldValue ? (
  <img
    src={
      field.fieldValue instanceof File
        ? URL.createObjectURL(field.fieldValue)
        : field.fieldValue
    }
    alt={field.fieldName}
    className="w-16 h-16 object-cover rounded border"
  />
) : (
  <span style={{ fontWeight: "500" }}>{field.fieldValue}</span>
)}

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
  ))}
</div>

          )}
        </div>

        {/* EDIT POPUP */}
        {editIndex !== null && (
          <React.Fragment>
            <h3 style={{fontSize:20,fontWeight:"bold",marginTop:25}}>Edit Fields</h3>
          <div className="bg-gray-100 p-4 rounded-lg space-y-3">
            <span style={{fontSize:15,fontWeight:"bold"}}>Edit Field Name</span>

            <input
              className="border p-2 rounded w-full"
              value={editField.fieldName}
              style={{margin:0,marginBottom:10}}
              onChange={(e) =>
                setEditField({ ...editField, fieldName: e.target.value })
              }
            />
            <span style={{fontSize:15,fontWeight:"bold"}}>Edit Field Key</span>
            <input
              className="border p-2 rounded w-full"
              value={editField.fieldKey}
              style={{margin:0,marginBottom:10}}
              onChange={(e) =>
                setEditField({ ...editField, fieldKey: e.target.value })
              }
            />
            <span style={{fontSize:15,fontWeight:"bold",marginTop:10}}>Edit Field Type</span>
            <select
              className="border p-2 rounded w-full"
              style={{margin:0,marginBottom:10}}
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
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center shadow-lg"
                onClick={handleSaveField}
              >
                Save
              </button>

              <button
                type="button"
                className="px-6 py-2 border rounded-xl"
                onClick={() => {
                  setEditField(null);
                  setEditIndex(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
          </React.Fragment>
        )}

        {/* FOOTER BUTTONS */}
        <div className="flex justify-end gap-3 mt-5">
          <button type="button" onClick={onClose} className="px-6 py-2 border rounded-xl">
            Close
          </button>

          <button type="submit" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center shadow-lg">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditModelForm;
