import React, { useEffect, useState } from 'react';
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
  TrendingUp,
  Calendar,
  ShoppingCart,
  IndianRupee,
  PackageCheck,
  Truck,
  CheckCircle,
  Users
} from 'lucide-react';

const Dashboard1 = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const [stats, setStats] = useState([]);
  const [postData, setPostData] = useState([]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch(
        `https://api.rmtechsolution.com/getPaymentTransactions.php?merchantId=${token}`
      );
      const json = await res.json();

      // ✅ Always fallback to empty array
      const orders = json.success ? json.data || [] : [];

      /* ================= DATES ================= */

      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .split('T')[0];

      /* ================= STATS ================= */

      const totalOrders = orders.length;

      const totalAmount = orders.reduce(
        (sum, o) => sum + Number(o.amount || 0),
        0
      );

      // ✅ 98% credit (remove 2%) + 2 decimals
      const creditAmount = orders
        .filter(o => o.payment_status === 'captured')
        .reduce((sum, o) => sum + Number(o.amount || 0) * 0.98, 0)
        .toFixed(2);

      const todayOrders = orders.filter(o =>
        o.created_at?.startsWith(today)
      );

      const yesterdayOrdersCount = orders.filter(o =>
        o.created_at?.startsWith(yesterday)
      ).length;

      const growthRate =
        yesterdayOrdersCount === 0
          ? '0%'
          : `${Math.round(
              ((todayOrders.length - yesterdayOrdersCount) /
                yesterdayOrdersCount) *
                100
            )}%`;

      const todayAccepted = todayOrders.filter(
        o => o.order_status === 'accepted'
      ).length;

      const todayShipped = todayOrders.filter(
        o => o.order_status === 'shipped'
      ).length;

      const todayDelivered = todayOrders.filter(
        o => o.order_status === 'delivered'
      ).length;

      setStats([
        {
          title: 'Total Orders',
          value: totalOrders,
          icon: <ShoppingCart />,
          color: 'bg-blue-500'
        },
        {
          title: 'Total Amount',
          value: `₹${totalAmount}`,
          icon: <IndianRupee />,
          color: 'bg-green-500'
        },
        {
          title: 'Credit Amount',
          value: `₹${creditAmount}`,
          icon: <IndianRupee />,
          color: 'bg-purple-500'
        },
        {
          title: 'Growth Rate',
          value: growthRate,
          icon: <TrendingUp />,
          color: 'bg-yellow-500'
        },
        {
          title: 'Today Orders',
          value: todayOrders.length,
          icon: <Calendar />,
          color: 'bg-blue-500'
        },
        {
          title: 'Today Accepted Orders',
          value: todayAccepted,
          icon: <CheckCircle />,
          color: 'bg-green-500'
        },
        {
          title: 'Today Shipped',
          value: todayShipped,
          icon: <Truck />,
          color: 'bg-purple-500'
        },
        {
          title: 'Today Delivered',
          value: todayDelivered,
          icon: <PackageCheck />,
          color: 'bg-yellow-500'
        }
      ]);

      /* ================= LAST 6 MONTHS BAR DATA ================= */

      const months = [...Array(6)].map((_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        return {
          key: d.toISOString().slice(0, 7), // YYYY-MM
          label: d.toLocaleString('default', { month: 'short' })
        };
      });

      const chartData = months.map(m => {
        const monthlyOrders = orders.filter(o =>
          o.created_at?.startsWith(m.key)
        );

        return {
          month: m.label,
          totalOrders: monthlyOrders.length,
          totalAmount: monthlyOrders.reduce(
            (sum, o) => sum + Number(o.amount || 0),
            0
          )
        };
      });

      setPostData(chartData);
    } catch (err) {
      console.error('Dashboard stats error', err);
    }
  };

  /* ================= STATIC PIE DATA ================= */

  const categoryData = [
    { name: 'Technology', value: 25, color: '#3b82f6' },
    { name: 'Business', value: 35, color: '#10b981' },
    { name: 'Design', value: 15, color: '#8b5cf6' },
    { name: 'Marketing', value: 20, color: '#f59e0b' },
    { name: 'Other', value: 5, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-1">Welcome back! {user?.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 ${stat.color} bg-opacity-10 rounded-full`}>
                <div className={`p-2 ${stat.color.replace('bg-', 'text-')}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BAR */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">
            Orders & Amount (Last 6 Months)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={postData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="orders" allowDecimals={false} />
                <YAxis
                  yAxisId="amount"
                  orientation="right"
                  tickFormatter={(v) => `₹${v}`}
                />
                <Tooltip
                  formatter={(value, name) =>
                    name === 'totalAmount'
                      ? [`₹${value}`, 'Total Amount']
                      : [value, 'Total Orders']
                  }
                />
                <Legend />
                <Bar
                  yAxisId="orders"
                  dataKey="totalOrders"
                  fill="#3b82f6"
                  name="Total Orders"
                />
                <Bar
                  yAxisId="amount"
                  dataKey="totalAmount"
                  fill="#10b981"
                  name="Total Amount"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Content by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  dataKey="value"
                >
                  {categoryData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Active Users */}
      <div className="grid grid-cols-1 gap-6">
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
      </div>
    </div>
  );
};

export default Dashboard1;
