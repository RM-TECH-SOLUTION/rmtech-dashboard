import React, { useEffect, useState } from "react";
import {
    Search,
    Edit,
    Trash2,
    Shield,
    Calendar,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
    getMerchant,
    createMerchant,
    updateMerchantStatus
} from "../redux/actions/cmsActions";
import CreateMerchantForm from "./CreateMerchantForm";

const MerchantListComponent = () => {
    const dispatch = useDispatch();
    const [statusFilter, setStatusFilter] = useState("all");
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedMerchant, setSelectedMerchant] = useState(null);
    const [editStatus, setEditStatus] = useState("active");



    // --------------------
    // REDUX DATA
    // --------------------
    const merchantData = useSelector(
        (state) => state.cms.merchantList || []
    );
    console.log(merchantData,"merchantDatajjj");
    

    // --------------------
    // LOCAL STATE
    // --------------------
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);

    // --------------------
    // FETCH MERCHANTS
    // --------------------
    useEffect(() => {
        dispatch(getMerchant());
    }, [dispatch]);

    // --------------------
    // FILTER
    // --------------------
    const filteredMerchants = merchantData.filter((m) => {
        const matchesSearch =
            m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || m.status === statusFilter;

        return matchesSearch && matchesStatus;
    });


    // --------------------
    // COUNTS
    // --------------------
    const totalMerchants = merchantData.length;
    const activeMerchants = merchantData.filter(m => m.status === "active").length;
    const inactiveMerchants = merchantData.filter(m => m.status === "inactive").length;

    // --------------------
    // STATUS BADGE
    // --------------------
    const getStatusBadge = (status) =>
        status === "active" ? (
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                Active
            </span>
        ) : (
            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                Inactive
            </span>
        );

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Merchants</h1>
                    <p className="text-gray-600">Manage merchant accounts</p>
                </div>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="mt-4 md:mt-0 flex items-center px-4 py-2 x-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl flex items-center"
                >
                    Add New Merchant
                </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow">
                    <div className="text-2xl font-bold">{totalMerchants}</div>
                    <div className="text-gray-500">Total Merchants</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow">
                    <div className="text-2xl font-bold">{activeMerchants}</div>
                    <div className="text-gray-500">Active Merchants</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow">
                    <div className="text-2xl font-bold">{inactiveMerchants}</div>
                    <div className="text-gray-500">Inactive Merchants</div>
                </div>
            </div>

            {/* SEARCH */}
            <div className="bg-white p-3 sm:p-4 rounded-xl shadow flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 min-w-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        placeholder="Search merchant..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none whitespace-nowrap"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl shadow overflow-hidden overflow-x-auto">
                <table className="w-full divide-y">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Merchant
                            </th>
                            <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">
                                Id
                            </th>
                            <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">
                                Dashboard Access
                            </th>
                            <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Status
                            </th>
                            <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">
                                Created
                            </th>
                            <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {filteredMerchants.map((m) => (
                            <tr key={m.id} className="hover:bg-gray-50">
                                <td className="px-2 sm:px-4 md:px-6 py-3 sm:py-4">
                                    <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                                        <div className="w-8 sm:w-10 h-8 sm:h-10 bg-blue-100 rounded-full flex-shrink-0 flex items-center justify-center">
                                            <span className="font-semibold text-blue-600 text-xs sm:text-sm">
                                                {m.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="font-medium text-xs sm:text-sm truncate">{m.name}</div>
                                            <div className="text-gray-500 text-xs truncate">{m.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 text-gray-500 hidden sm:table-cell text-xs sm:text-sm">
                                    <div className="flex items-center truncate">
                                        {m.merchantId}
                                    </div>
                                </td>

                                <td className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm hidden md:table-cell">
                                    <div className="text-gray-700 truncate max-w-[160px]">
                                        {(Array.isArray(m.dashboardAccess)
                                            ? m.dashboardAccess
                                            : String(m.dashboard_access || m.dashboardAccess || "").split(",")
                                        )
                                            .map((item) => item.trim())
                                            .filter(Boolean)
                                            .join(", ")}
                                    </div>
                                </td>

                                <td className="px-2 sm:px-4 md:px-6 py-3 sm:py-4">
                                    {getStatusBadge(m.status)}
                                </td>

                                <td className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 text-gray-500 hidden md:table-cell text-xs sm:text-sm">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                        <span className="truncate">{m.createdAt}</span>
                                    </div>
                                </td>

                                <td className="px-2 sm:px-4 md:px-6 py-3 sm:py-4">
                                    <div className="flex gap-1 sm:gap-2">
                                        <button className="p-1 sm:p-2 text-blue-600 hover:bg-blue-50 rounded flex-shrink-0"
                                            onClick={() => {
                                                setSelectedMerchant(m);
                                                setEditStatus(m.status);
                                                setShowEditModal(true);
                                            }}
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button className="p-1 sm:p-2 text-green-600 hover:bg-green-50 rounded flex-shrink-0">
                                            <Shield size={16} />
                                        </button>
                                        <button className="p-1 sm:p-2 text-red-600 hover:bg-red-50 rounded flex-shrink-0">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* CREATE MERCHANT MODAL */}
            {showAddModal && (
                <CreateMerchantForm
                    onClose={() => setShowAddModal(false)}
                    onSubmit={(data) => {
                        dispatch(createMerchant(data)).then((res) => {
                            if (res.success) {
                                alert("Merchant created successfully");
                                setShowAddModal(false);
                                dispatch(getMerchant());
                            } else {
                                alert(res.message); // ✅ Invalid email shown here
                            }
                        });
                    }}

                />
            )}

           {showEditModal && selectedMerchant && (
  <CreateMerchantForm
    isEdit={true}
    initialData={selectedMerchant}
    onClose={() => setShowEditModal(false)}
    onSubmit={(data) => {
      dispatch(updateMerchantStatus(data)).then((res) => {
        if (res.success) {
          alert("Merchant updated successfully");
          setShowEditModal(false);
          dispatch(getMerchant());
        } else {
          alert(res.message);
        }
      });
    }}
  />
)}


        </div>
    );
};

export default MerchantListComponent;
