import React, { useState } from "react";

const CreateMerchantForm = ({ onClose, onSubmit }) => {
    // ----------------------------
    // INDIVIDUAL STATES
    // ----------------------------
    const [merchantId, setMerchantId] = useState("");
    const [merchantName, setMerchantName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [gst, setGst] = useState("");
    const [address, setAddress] = useState("");
    const [status, setStatus] = useState("active");


    // ----------------------------
    // SUBMIT
    // ----------------------------
    const handleSubmit = (e) => {

        // ✅ FINAL PAYLOAD CREATED HERE
        const payload = {
            merchantId,
            merchantName,
            email,
            phone,
            password,
            gst,
            status,
            address,
        };

        onSubmit(payload);
        onClose();
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-6">
            <form
                onSubmit={handleSubmit}
                onKeyDown={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-lg rounded-lg p-6 space-y-4"
            >
                <h2 className="text-xl font-bold">Create Merchant</h2>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Merchant ID
                    </label>
                    <div className="relative">
                        <input
                            value={merchantId}
                            onChange={(e) => setMerchantId(e.target.value)}
                            required
                            className="w-full pl-5 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Enter Merchant ID"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Merchant Name
                    </label>
                    <div className="relative">
                        <input
                            value={merchantName}
                            onChange={(e) => setMerchantName(e.target.value)}
                            required
                            className="w-full pl-5 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Enter Merchant Name"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Merchant Email
                    </label>
                    <div className="relative">
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full pl-5 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Enter Email"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Merchant Phone Number
                    </label>
                    <div className="relative">
                        <input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="w-full pl-5 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Enter Phone Number"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Merchant Password
                    </label>
                    <div className="relative">
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full pl-5 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Enter Password"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Merchant GST
                    </label>
                    <div className="relative">
                        <input
                            value={gst}
                            onChange={(e) => setGst(e.target.value)}
                            required
                            className="w-full pl-5 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Enter GST"
                        />
                    </div>
                </div>

                <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
        Merchant Status
    </label>
    <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
    >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
    </select>
</div>


                {/* ADDRESS */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                    </label>
                    <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                        placeholder="Enter Address"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 border rounded-xl"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl flex items-center"
                    >
                        Create
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateMerchantForm;
