import React, { useState, useEffect } from 'react';
import {
  Search,
  Calendar,
  Coins,
  Users as UsersIcon
} from 'lucide-react';

const Users = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const token = localStorage.getItem('token');

  /* ================= FETCH USERS ================= */

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://api.rmtechsolution.com/getUsers.php?merchant_id=${token}`
      );

      const json = await res.json();

      if (json.success) {
        setUsers(json.users || []);
      } else {
        setUsers([]);
      }

    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER ================= */

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ================= NEW THIS MONTH ================= */

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const newThisMonth = users.filter(u => {
    if (!u.created_at) return false;
    const d = new Date(u.created_at);
    return (
      d.getMonth() === currentMonth &&
      d.getFullYear() === currentYear
    );
  }).length;

  /* ================= TOTAL POINTS ================= */

  const totalPoints = users.reduce(
    (sum, user) => sum + Number(user.total_points || 0),
    0
  );

  const totalReferrals = users.reduce(
    (sum, user) => sum + Number(user.total_referrals || 0),
    0
  );

  /* ================= BADGES ================= */

  const getStatusBadge = () => (
    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
      Active
    </span>
  );

  /* ================= UI ================= */

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-600">Registered customers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="text-2xl font-bold">{users.length}</div>
          <div className="text-gray-500">Total Users</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="text-2xl font-bold">{newThisMonth}</div>
          <div className="text-gray-500">New This Month</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="text-2xl font-bold">{totalPoints}</div>
          <div className="text-gray-500">Total Points Issued</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="text-2xl font-bold">{totalReferrals}</div>
          <div className="text-gray-500">Total Referrals</div>
        </div>

      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">

        {loading ? (
          <div className="p-6 text-center">Loading users...</div>
        ) : (

          <table className="min-w-full divide-y divide-gray-200">

            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-bold">User</th>
                <th className="px-6 py-3 text-left font-bold">Points</th>
                <th className="px-6 py-3 text-left font-bold">Referrals</th>
                <th className="px-6 py-3 text-left font-bold">Status</th>
                <th className="px-6 py-3 text-left font-bold">Joined</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">

              {filteredUsers.map((user) => (

                <tr key={user.id} className="hover:bg-gray-50">

                  {/* USER */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-blue-600">
                          {user.name?.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* POINTS */}
                  <td className="px-6 py-4">
                    <div className="flex items-center font-semibold text-yellow-600">
                      <Coins className="w-4 h-4 mr-2" />
                      {user.total_points || 0}
                    </div>
                  </td>

                  {/* REFERRALS */}
                  <td className="px-6 py-4">
                    <div className="flex items-center font-semibold text-indigo-600">
                      <UsersIcon className="w-4 h-4 mr-2" />
                      {user.total_referrals || 0}
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    {getStatusBadge()}
                  </td>

                  {/* JOINED */}
                  <td className="px-6 py-4 text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {user.created_at?.split(" ")[0]}
                    </div>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
};

export default Users;