import React, { useEffect, useState } from "react";

const CreateMerchantForm = ({
  onClose,
  onSubmit,
  isEdit = false,
  initialData = null,
}) => {

  // ----------------------------
  // STATES
  // ----------------------------
  const [merchantId, setMerchantId] = useState("");
  const [merchantName, setMerchantName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [gst, setGst] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("active");

  const [webhookSecret, setWebhookSecret] = useState("");
  const [keyId, setKeyId] = useState("");
  const [keySecret, setKeySecret] = useState("");

  // ----------------------------
  // PREFILL WHEN EDIT
  // ----------------------------
  useEffect(() => {
    if (isEdit && initialData) {
      setMerchantId(initialData.merchantId || "");
      setMerchantName(initialData.name || "");
      setEmail(initialData.email || "");
      setPhone(initialData.phone || "");
      setGst(initialData.gst || "");
      setAddress(initialData.address || "");
      setStatus(initialData.status || "active");
      setWebhookSecret(initialData.webhookSecret || "");
      setKeyId(initialData.keyId || "");
      setKeySecret(initialData.keySecret || "");
    }
  }, [isEdit, initialData]);

  // ----------------------------
  // SUBMIT
  // ----------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      merchantId,
      merchantName,
      email,
      phone,
      gst,
      status,
      address,
      webhookSecret,
      keyId,
      keySecret,
    };

    if (password) payload.password = password;

    onSubmit(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-50">

      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-lg rounded-lg flex flex-col max-h-[90vh]"
      >

        {/* HEADER */}
        <div className="p-5 border-b">
          <h2 className="text-xl font-bold">
            {isEdit ? "Update Merchant Details" : "Create New Merchant"}
          </h2>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">

          {/* MERCHANT ID */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Merchant ID
            </label>
            <input
              value={merchantId}
              disabled={isEdit}
              onChange={(e) => setMerchantId(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg ${
                isEdit ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              placeholder="Enter Merchant ID"
              required
            />
          </div>

          {/* MERCHANT NAME */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Merchant Name
            </label>
            <input
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Enter Merchant Name"
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Merchant Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Enter Email"
              required
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Merchant Phone
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Enter Phone Number"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder={
                isEdit
                  ? "Enter new password (optional)"
                  : "Enter password"
              }
            />
          </div>

          {/* GST */}
          <div>
            <label className="block text-sm font-medium mb-1">
              GST Number
            </label>
            <input
              value={gst}
              onChange={(e) => setGst(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Enter GST"
            />
          </div>

          {/* WEBHOOK SECRET */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Webhook Secret
            </label>
            <input
              value={webhookSecret}
              onChange={(e) => setWebhookSecret(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Enter Webhook Secret"
            />
          </div>

          {/* KEY ID */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Key ID
            </label>
            <input
              value={keyId}
              onChange={(e) => setKeyId(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Enter Key ID"
            />
          </div>

          {/* KEY SECRET */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Key Secret
            </label>
            <input
              value={keySecret}
              onChange={(e) => setKeySecret(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Enter Key Secret"
            />
          </div>

          {/* STATUS */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* ADDRESS */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Address
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Enter Address"
            />
          </div>

        </div>

        {/* FOOTER */}
        <div className="p-5 border-t flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border rounded-xl"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl"
          >
            {isEdit ? "Update" : "Create"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateMerchantForm;
