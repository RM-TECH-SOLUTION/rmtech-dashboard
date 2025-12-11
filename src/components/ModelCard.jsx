import React from "react";
import { Edit, Trash2, Database } from "lucide-react";

const ModelCard = ({ model, onEdit, onDelete }) => {

  console.log(model,"modelmodel");
  
  return (
    <div className="bg-white border rounded-xl p-6 shadow hover:shadow-md">

      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold">{model.modelName}</h3>
          <p className="text-gray-500">{model.modelSlug}</p>
        </div>

        {model.singletonModel && (
          <span className="px-2 py-1 text-xs bg-purple-200 text-purple-800 rounded">
            Singleton
          </span>
        )}
      </div>

      <div className="text-sm text-gray-600 mb-4">
        <Database size={14} className="inline mr-1" />
        {model.fields.length} fields
      </div>

      {/* ACTIONS */}
      <div className="pt-3 border-t flex gap-2">

        {/* EDIT */}
        <button
          onClick={onEdit}
          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
        >
          <Edit size={18} />
        </button>

        {/* DELETE */}
        <button
          onClick={() => onDelete(model)}
          className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
        >
          <Trash2 size={18} />
        </button>

      </div>
    </div>
  );
};

export default ModelCard;
