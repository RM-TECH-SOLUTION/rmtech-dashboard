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
            <div className="bg-white p-4 rounded-xl shadow"
                style={{ display: "flex" }}
            >
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        placeholder="Search merchant by name or email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    />

                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg
             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    style={{ marginLeft: 10 }}
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>


            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="min-w-full divide-y">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Merchant
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Id
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Created
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {filteredMerchants.map((m) => (
                            <tr key={m.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="font-semibold text-blue-600">
                                                {m.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div className="ml-4">
                                            <div className="font-medium">{m.name}</div>
                                            <div className="text-gray-500">{m.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    <div className="flex items-center">
                                        {m.merchantId}
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    {getStatusBadge(m.status)}
                                </td>

                                <td className="px-6 py-4 text-gray-500">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {m.createdAt}
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                            onClick={() => {
                                                setSelectedMerchant(m);
                                                setEditStatus(m.status);
                                                setShowEditModal(true);
                                            }}
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                                            <Shield size={16} />
                                        </button>
                                        <button className="p-2 text-red-600 hover:bg-red-50 rounded">
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
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-6 z-50">
                    <div className="bg-white w-full max-w-md rounded-lg p-6 space-y-4">
                        <h2 className="text-xl font-bold">Update Merchant Status</h2>

                        {/* Merchant ID (readonly) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Merchant ID
                            </label>
                            <input
                                value={selectedMerchant.merchantId}
                                disabled
                                className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex justify-end gap-3 pt-4 rounded-xl">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 border rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl flex items-center"
                                onClick={() => {
                                    dispatch(
                                        updateMerchantStatus({
                                            merchantId: selectedMerchant.merchantId,
                                            status: editStatus,
                                        })
                                    ).then((res) => {
                                        if (res.success) {
                                            alert("Status updated successfully");
                                            setShowEditModal(false);
                                            dispatch(getMerchant());
                                        } else {
                                            alert(res.message);
                                        }
                                    });
                                }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default MerchantListComponent;
