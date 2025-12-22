import React, { useEffect, useState } from "react";
import axios from "axios";
import { Copy, Trash2, FileText, Video,ImageIcon } from "lucide-react";

const Media = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://api.rmtechsolution.com/getCmsImages",
        { params: { merchantId: 1 } }
      );

      if (res.data?.success) {
        const formatted = res.data.images.map((url, index) => {
          const name = url.split("/").pop();
          const ext = name.split(".").pop().toLowerCase();

          return {
            id: index,
            url,
            name,
            type: ["mp4", "mov"].includes(ext)
              ? "video"
              : ["pdf"].includes(ext)
              ? "document"
              : "image",
            size: "—",
            date: "—",
          };
        });

        setFiles(formatted);
      }
    } catch (err) {
      console.error("Failed to load images", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const getPreview = (file) => {
    if (file.type === "image") {
      return (
        <img
          src={file.url}
          alt={file.name}
          className="w-full h-full object-cover"
        />
      );
    }

    if (file.type === "video") {
      return <Video className="w-10 h-10 text-purple-500" />;
    }

    return <FileText className="w-10 h-10 text-gray-500" />;
  };

  if (!loading && files.length === 0) {
    return(
      <div>
         <h1 className="text-3xl font-bold">Media Library</h1>
      <p className="text-gray-600 mb-6">
        Manage your uploaded files and images
      </p>
    
  <div className="flex flex-col items-center justify-center py-24 text-gray-400">
    <ImageIcon className="w-12 h-12 mb-3" />
    <p className="text-lg font-semibold">No media yet</p>
    <p className="text-sm">Upload files to get started</p>
  </div>
    </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Media Library</h1>
      <p className="text-gray-600 mb-6">
        Manage your uploaded files and images
      </p>

      {loading && <p>Loading...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {files.map((file) => (
          <div
            key={file.id}
            className={`bg-white rounded-xl border shadow-sm overflow-hidden relative ${
              selected.includes(file.id)
                ? "ring-2 ring-blue-500"
                : ""
            }`}
          >
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={selected.includes(file.id)}
              onChange={() => toggleSelect(file.id)}
              className="absolute top-3 left-3 z-10"
            />

            {/* Actions */}
            <div className="absolute top-3 right-3 flex gap-2 z-10">
              <button className="bg-white p-1 rounded shadow">
                <Trash2 size={14} className="text-red-500" />
              </button>
            </div>

            {/* Preview */}
            <div className="h-40 bg-gray-100 flex items-center justify-center">
              {getPreview(file)}
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="font-medium truncate">{file.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Media;
