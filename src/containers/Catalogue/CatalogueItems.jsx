
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  Upload,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Package,
  Tag,
  Star,
  ShoppingCart,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  MoreVertical,
  Copy,
  MoveVertical,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const CatalogueItems = () => {
  const { modelSlug } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, or table
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priceRange: '',
    stock: '',
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  useEffect(() => {
    fetchModelAndItems();
  }, [modelSlug]);

  const fetchModelAndItems = async () => {
    setLoading(true);
    try {
      // Fetch model details
      const mockModel = {
        id: 1,
        name: 'Electronics',
        slug: 'electronics',
        icon: '💻',
        fields: [
          { name: 'Product Name', key: 'name', type: 'string', required: true },
          { name: 'Brand', key: 'brand', type: 'string', required: true },
          { name: 'SKU', key: 'sku', type: 'string', required: true, unique: true },
          { name: 'Price', key: 'price', type: 'price', required: true },
          { name: 'Stock', key: 'stock', type: 'number', required: true },
          { name: 'Status', key: 'status', type: 'string', required: true },
          { name: 'Category', key: 'category', type: 'string', required: true },
          { name: 'Images', key: 'images', type: 'gallery', required: true },
          { name: 'Description', key: 'description', type: 'text', required: false },
          { name: 'Specifications', key: 'specs', type: 'json', required: false },
        ],
      };
      setModel(mockModel);

      // Fetch items
      const mockItems = [
        {
          id: 1,
          name: 'MacBook Pro 16"',
          brand: 'Apple',
          sku: 'MBP16-2024',
          price: 2499.99,
          stock: 25,
          status: 'in_stock',
          category: 'Laptops',
          images: ['https://via.placeholder.com/300x300/3b82f6/ffffff?text=MBP'],
          description: 'Professional laptop with M3 chip',
          specs: { processor: 'M3 Max', ram: '32GB', storage: '1TB' },
          rating: 4.8,
          reviews: 128,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-20',
        },
        {
          id: 2,
          name: 'iPhone 15 Pro',
          brand: 'Apple',
          sku: 'IP15P-256',
          price: 1199.99,
          stock: 50,
          status: 'in_stock',
          category: 'Smartphones',
          images: ['https://via.placeholder.com/300x300/10b981/ffffff?text=iPhone'],
          description: 'Latest iPhone with titanium design',
          specs: { storage: '256GB', color: 'Natural Titanium' },
          rating: 4.7,
          reviews: 256,
          createdAt: '2024-01-10',
          updatedAt: '2024-01-18',
        },
        {
          id: 3,
          name: 'Samsung Odyssey G9',
          brand: 'Samsung',
          sku: 'ODG9-49',
          price: 1299.99,
          stock: 12,
          status: 'low_stock',
          category: 'Monitors',
          images: ['https://via.placeholder.com/300x300/8b5cf6/ffffff?text=G9'],
          description: '49" Ultra-wide gaming monitor',
          specs: { resolution: '5120x1440', refreshRate: '240Hz' },
          rating: 4.9,
          reviews: 89,
          createdAt: '2024-01-05',
          updatedAt: '2024-01-15',
        },
        {
          id: 4,
          name: 'Sony WH-1000XM5',
          brand: 'Sony',
          sku: 'WHXM5-BLK',
          price: 399.99,
          stock: 0,
          status: 'out_of_stock',
          category: 'Headphones',
          images: ['https://via.placeholder.com/300x300/f59e0b/ffffff?text=XM5'],
          description: 'Noise-cancelling wireless headphones',
          specs: { batteryLife: '30h', noiseCancellation: 'Yes' },
          rating: 4.6,
          reviews: 312,
          createdAt: '2024-01-12',
          updatedAt: '2024-01-19',
        },
        {
          id: 5,
          name: 'Logitech MX Master 3S',
          brand: 'Logitech',
          sku: 'MXM3S-GRY',
          price: 99.99,
          stock: 75,
          status: 'in_stock',
          category: 'Accessories',
          images: ['https://via.placeholder.com/300x300/ef4444/ffffff?text=MX3S'],
          description: 'Advanced wireless mouse',
          specs: { dpi: '8000', connectivity: 'Bluetooth' },
          rating: 4.5,
          reviews: 189,
          createdAt: '2024-01-08',
          updatedAt: '2024-01-16',
        },
      ];
      setItems(mockItems);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleDuplicateItem = (item) => {
    const duplicated = {
      ...item,
      id: Date.now(),
      sku: `${item.sku}-COPY`,
      name: `${item.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setItems([...items, duplicated]);
  };

  const handleBulkAction = (action) => {
    if (selectedItems.length === 0) {
      alert('Please select items first');
      return;
    }

    switch (action) {
      case 'delete':
        if (window.confirm(`Delete ${selectedItems.length} selected items?`)) {
          setItems(items.filter(item => !selectedItems.includes(item.id)));
          setSelectedItems([]);
        }
        break;
      case 'activate':
        // Update status to active
        setItems(items.map(item => 
          selectedItems.includes(item.id) 
            ? { ...item, status: 'in_stock' }
            : item
        ));
        break;
      case 'deactivate':
        // Update status to inactive
        setItems(items.map(item => 
          selectedItems.includes(item.id) 
            ? { ...item, status: 'out_of_stock' }
            : item
        ));
        break;
      default:
        break;
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const filteredItems = items.filter(item => {
    // Search filter
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = !filters.status || item.status === filters.status;

    // Category filter
    const matchesCategory = !filters.category || item.category === filters.category;

    // Price range filter
    let matchesPrice = true;
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      matchesPrice = item.price >= min && item.price <= max;
    }

    // Stock filter
    let matchesStock = true;
    if (filters.stock === 'in_stock') {
      matchesStock = item.stock > 0;
    } else if (filters.stock === 'out_of_stock') {
      matchesStock = item.stock === 0;
    } else if (filters.stock === 'low_stock') {
      matchesStock = item.stock > 0 && item.stock < 10;
    }

    return matchesSearch && matchesStatus && matchesCategory && matchesPrice && matchesStock;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    
    return sortOrder === 'asc' 
      ? (aVal || 0) - (bVal || 0)
      : (bVal || 0) - (aVal || 0);
  });

  // Pagination
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = sortedItems.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status) => {
    const statusConfig = {
      in_stock: { color: 'bg-green-100 text-green-800', label: 'In Stock' },
      low_stock: { color: 'bg-yellow-100 text-yellow-800', label: 'Low Stock' },
      out_of_stock: { color: 'bg-red-100 text-red-800', label: 'Out of Stock' },
      discontinued: { color: 'bg-gray-100 text-gray-800', label: 'Discontinued' },
    };
    const config = statusConfig[status] || statusConfig.out_of_stock;
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getStockBadge = (stock) => {
    if (stock === 0) {
      return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Out of Stock</span>;
    } else if (stock < 10) {
      return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Low Stock</span>;
    } else {
      return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">In Stock</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading items...</div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Model not found</h3>
        <p className="text-gray-600 mb-6">The catalogue model you're looking for doesn't exist.</p>
        <Link to="/dashboard/catalogue" className="text-blue-600 hover:text-blue-800">
          ← Back to Catalogue Models
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <div className="flex items-center mb-2">
            <Link to="/dashboard/catalogue" className="text-blue-600 hover:text-blue-800 mr-3">
              <ChevronLeft size={20} />
            </Link>
            <div className="flex items-center">
              <div className="text-3xl mr-3">{model.icon}</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{model.name}</h1>
                <p className="text-gray-600">Manage your {model.name.toLowerCase()} items</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Upload size={18} className="mr-2" />
            Import
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download size={18} className="mr-2" />
            Export
          </button>
          <Link
            to={`/dashboard/catalogue/${modelSlug}/create`}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} className="mr-2" />
            New Item
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{items.length}</div>
              <div className="text-gray-500">Total Items</div>
            </div>
            <Package className="text-blue-500" size={32} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">
                ${items.reduce((sum, item) => sum + (item.price * item.stock), 0).toFixed(2)}
              </div>
              <div className="text-gray-500">Total Value</div>
            </div>
            <Tag className="text-green-500" size={32} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">
                {items.filter(item => item.stock > 0).length}
              </div>
              <div className="text-gray-500">In Stock</div>
            </div>
            <CheckCircle className="text-green-500" size={32} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">
                {items.filter(item => item.stock === 0).length}
              </div>
              <div className="text-gray-500">Out of Stock</div>
            </div>
            <XCircle className="text-red-500" size={32} />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search items by name, SKU, brand, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="flex space-x-3">
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Status</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Categories</option>
              <option value="Laptops">Laptops</option>
              <option value="Smartphones">Smartphones</option>
              <option value="Monitors">Monitors</option>
              <option value="Headphones">Headphones</option>
              <option value="Accessories">Accessories</option>
            </select>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                title="Grid View"
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                title="List View"
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 ${viewMode === 'table' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                title="Table View"
              >
                <MoveVertical size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-700">
              {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-3">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              >
                Mark as In Stock
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
              >
                Mark as Out of Stock
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedItems([])}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Items View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  )}
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
                  className="absolute top-3 left-3 w-5 h-5 rounded border-gray-300"
                />
                <div className="absolute top-3 right-3">
                  {getStatusBadge(item.status)}
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.brand}</p>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm">
                    <span className="text-gray-600">SKU: </span>
                    <span className="font-mono">{item.sku}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="ml-1 text-sm">{item.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  {getStockBadge(item.stock)}
                  <span className="text-sm text-gray-600">
                    Stock: <span className="font-medium">{item.stock}</span>
                  </span>
                </div>
                
                <div className="flex space-x-2 pt-4 border-t">
                  <button
                    onClick={() => navigate(`/dashboard/catalogue/${modelSlug}/edit/${item.id}`)}
                    className="flex-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDuplicateItem(item)}
                    className="px-3 py-1 border border-gray-300 text-sm rounded-lg hover:bg-gray-50"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="px-3 py-1 border border-red-300 text-red-600 text-sm rounded-lg hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : viewMode === 'list' ? (
        <div className="space-y-4">
          {paginatedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">{item.brand}</span>
                        <span className="text-sm font-mono text-gray-600">{item.sku}</span>
                        <span className="text-sm text-gray-500">{item.category}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        ${item.price.toFixed(2)}
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        {getStockBadge(item.stock)}
                        <span className="text-sm text-gray-600">
                          Stock: {item.stock}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4 flex space-x-2">
                  <button
                    onClick={() => navigate(`/dashboard/catalogue/${modelSlug}/edit/${item.id}`)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="px-3 py-1 border border-red-300 text-red-600 text-sm rounded-lg hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Table View
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 px-6 py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === paginatedItems.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(paginatedItems.map(item => item.id));
                        } else {
                          setSelectedItems([]);
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('sku')}
                  >
                    SKU {sortBy === 'sku' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('price')}
                  >
                    Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('stock')}
                  >
                    Stock {sortBy === 'stock' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    Created {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
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
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3">
                          {item.images && item.images.length > 0 ? (
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-sm font-mono text-gray-600">{item.sku}</code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">${item.price.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getStockBadge(item.stock)}
                        <span className="ml-2 text-sm">{item.stock} units</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/dashboard/catalogue/${modelSlug}/edit/${item.id}`)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDuplicateItem(item)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedItems.length)} of {sortedItems.length} items
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'border hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || Object.values(filters).some(f => f)
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first item'}
          </p>
          <Link
            to={`/dashboard/catalogue/${modelSlug}/create`}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} className="mr-2" />
            Create First Item
          </Link>
        </div>
      )}
    </div>
  );
};

export default CatalogueItems;