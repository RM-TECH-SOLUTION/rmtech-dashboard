
import React, { useState, useEffect } from 'react';
import { mediaAPI } from '../Api/apiClient';
import 'react-quill/dist/quill.snow.css';
import {
  Search,
  Upload,
  Image as ImageIcon,
  File,
  Video,
  Trash2,
  Download,
  Copy
} from 'lucide-react';

const Media = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      // Mock data
      const mockMedia = [
        { id: 1, name: 'banner.jpg', type: 'image', url: 'https://via.placeholder.com/400x300', size: '2.4 MB', uploaded: '2024-01-15' },
        { id: 2, name: 'document.pdf', type: 'document', url: '#', size: '1.2 MB', uploaded: '2024-01-14' },
        { id: 3, name: 'video.mp4', type: 'video', url: '#', size: '24.5 MB', uploaded: '2024-01-13' },
      ];
      setMedia(mockMedia);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (files) => {
    try {
      setUploading(true);
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });

      // Upload to API
      const response = await mediaAPI.upload(formData);
      fetchMedia(); // Refresh list
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete selected items?')) {
      try {
        await mediaAPI.delete(id);
        setMedia(media.filter(item => item.id !== id));
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-8 h-8 text-blue-500" />;
      case 'video': return <Video className="w-8 h-8 text-purple-500" />;
      default: return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600">Manage your uploaded files and images</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-4">
          <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
            <input
              type="file"
              multiple
              onChange={(e) => handleUpload(e.target.files)}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-1">
              <div className="text-sm text-blue-700">Uploading files...</div>
              <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search media..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
            <option>All Types</option>
            <option>Images</option>
            <option>Documents</option>
            <option>Videos</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
            <option>Sort by Date</option>
            <option>Sort by Name</option>
            <option>Sort by Size</option>
          </select>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading media...</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${
                selectedItems.includes(item.id)
                  ? 'border-blue-500'
                  : 'border-transparent'
              }`}
            >
              <div className="relative">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                    {getFileIcon(item.type)}
                  </div>
                )}
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button
                    onClick={() => navigator.clipboard.writeText(item.url)}
                    className="p-1 bg-white rounded shadow-sm hover:bg-gray-100"
                    title="Copy URL"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 bg-white rounded shadow-sm hover:bg-gray-100"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedItems([...selectedItems, item.id]);
                    } else {
                      setSelectedItems(selectedItems.filter(id => id !== item.id));
                    }
                  }}
                  className="absolute top-2 left-2 w-4 h-4"
                />
              </div>
              <div className="p-3">
                <div className="text-sm font-medium truncate" title={item.name}>
                  {item.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {item.size} • {item.uploaded}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Actions */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-4">
            <span>{selectedItems.length} items selected</span>
            <button
              onClick={() => handleDelete(selectedItems[0])}
              className="px-4 py-1 bg-red-600 rounded hover:bg-red-700"
            >
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedItems([])}
              className="px-4 py-1 bg-gray-600 rounded hover:bg-gray-700"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Media;