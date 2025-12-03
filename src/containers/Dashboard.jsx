
import React from 'react';
import 'react-quill/dist/quill.snow.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  FileText,
  Users,
  Eye,
  TrendingUp,
  Calendar,
  Clock,
  Download
} from 'lucide-react';

const Dashboard = () => {
  const postData = [
    { month: 'Jan', posts: 40, views: 2400 },
    { month: 'Feb', posts: 30, views: 1398 },
    { month: 'Mar', posts: 20, views: 9800 },
    { month: 'Apr', posts: 27, views: 3908 },
    { month: 'May', posts: 18, views: 4800 },
    { month: 'Jun', posts: 23, views: 3800 },
  ];

  const categoryData = [
    { name: 'Technology', value: 35, color: '#3b82f6' },
    { name: 'Business', value: 25, color: '#10b981' },
    { name: 'Design', value: 20, color: '#8b5cf6' },
    { name: 'Marketing', value: 15, color: '#f59e0b' },
    { name: 'Other', value: 5, color: '#ef4444' },
  ];

  const stats = [
    { title: 'Total Posts', value: '1,248', icon: <FileText />, change: '+12%', color: 'bg-blue-500' },
    { title: 'Total Users', value: '548', icon: <Users />, change: '+8%', color: 'bg-green-500' },
    { title: 'Page Views', value: '24.5K', icon: <Eye />, change: '+23%', color: 'bg-purple-500' },
    { title: 'Growth Rate', value: '34%', icon: <TrendingUp />, change: '+5%', color: 'bg-yellow-500' },
  ];

  const recentPosts = [
    { id: 1, title: 'Getting Started with React CMS', author: 'John Doe', date: '2024-01-15', status: 'published', views: '1.2k' },
    { id: 2, title: 'Web Development Best Practices', author: 'Jane Smith', date: '2024-01-14', status: 'draft', views: '890' },
    { id: 3, title: 'SEO Optimization Guide', author: 'Mike Johnson', date: '2024-01-13', status: 'published', views: '2.1k' },
    { id: 4, title: 'Node.js Performance Tips', author: 'Sarah Wilson', date: '2024-01-12', status: 'published', views: '750' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your CMS.</p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 flex items-center">
            <Calendar size={16} className="mr-2" />
            This Month
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
            <Download size={16} className="mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <p className="text-green-600 text-sm mt-1">{stat.change} from last month</p>
              </div>
              <div className={`p-3 ${stat.color} bg-opacity-10 rounded-full`}>
                <div className={`p-2 ${stat.color.replace('bg-', 'text-')} rounded-full`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Posts & Views Overview</h3>
            <div className="flex space-x-2">
              <span className="flex items-center text-sm">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                Posts
              </span>
              <span className="flex items-center text-sm">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                Views
              </span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={postData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="posts" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="views" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Content by Category</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700">View Details</button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Posts</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{post.title}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{post.author}</td>
                  <td className="px-6 py-4 text-gray-600">{post.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      post.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center">
                      <Eye size={14} className="mr-2" />
                      {post.views}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Active Users</h4>
              <p className="text-2xl font-bold mt-2">428</p>
              <p className="text-green-600 text-sm mt-1">+12 this week</p>
            </div>
            <Users className="text-blue-500" size={32} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Avg. Read Time</h4>
              <p className="text-2xl font-bold mt-2">4.2 min</p>
              <p className="text-green-600 text-sm mt-1">+0.3 from last month</p>
            </div>
            <Clock className="text-green-500" size={32} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Draft Posts</h4>
              <p className="text-2xl font-bold mt-2">8</p>
              <p className="text-yellow-600 text-sm mt-1">Need attention</p>
            </div>
            <FileText className="text-yellow-500" size={32} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;