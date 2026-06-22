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
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [storeType, setStoreType] = useState("");
  const [storeLogo, setStoreLogo] = useState("");
  const [typeLogo, setTypeLogo] = useState("");
  const [storeLogoFile, setStoreLogoFile] = useState(null);
  const [typeLogoFile, setTypeLogoFile] = useState(null);
  const [storeLogoPreview, setStoreLogoPreview] = useState("");
  const [typeLogoPreview, setTypeLogoPreview] = useState("");

  // ----------------------------
  // PREFILL WHEN EDIT
  // ----------------------------
  useEffect(() => {
    if (isEdit && initialData) {
      setMerchantId(initialData.merchantId || initialData.merchant_id || "");
      setMerchantName(initialData.name || initialData.merchantName || "");
      setEmail(initialData.email || initialData.email_address || "");
      setPhone(initialData.phone || initialData.phone_number || "");
      setGst(initialData.gst || initialData.gst_number || "");
      setAddress(initialData.address || "");
      setStatus(initialData.status || "active");
      setWebhookSecret(initialData.webhookSecret || initialData.webhook_secret || "");
      setKeyId(initialData.keyId || initialData.key_id || "");
      setKeySecret(initialData.keySecret || initialData.key_secret || "");
      setLatitude(initialData.latitude || "");
      setLongitude(initialData.longitude || "");
      setStoreType(initialData.storeType || initialData.store_type || "");
      const sLogo = initialData.storeLogo || initialData.store_logo || "";
      const tLogo = initialData.typeLogo || initialData.type_logo || "";
      setStoreLogo(sLogo);
      setTypeLogo(tLogo);
      setStoreLogoPreview(sLogo);
      setTypeLogoPreview(tLogo);
    }
  }, [isEdit, initialData]);

  // ----------------------------
  // SUBMIT
  // ----------------------------
  const uploadImage = async (file, mId) => {
    if (!file) return null;
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("merchantId", mId || merchantId || "");

      const res = await fetch("https://api.rmtechsolution.com/uploadCmsImage", {
        method: "POST",
        body: fd,
      });

      const json = await res.json();
      if (json?.success && json.imageUrl) return json.imageUrl;
      return null;
    } catch (err) {
      console.error("uploadImage error", err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let uploadedStoreLogo = storeLogo;
      let uploadedTypeLogo = typeLogo;

      // upload files first (if provided)
      if (storeLogoFile) {
        const url = await uploadImage(storeLogoFile, merchantId);
        if (url) uploadedStoreLogo = url;
      }

      if (typeLogoFile) {
        const url = await uploadImage(typeLogoFile, merchantId);
        if (url) uploadedTypeLogo = url;
      }

      const payload = {
        merchantId,
        name: merchantName,
        email,
        phone,
        password,
        gst,
        webhook_secret: webhookSecret,
        key_id: keyId,
        key_secret: keySecret,
        address,
        latitude,
        longitude,
        store_type: storeType,
        store_logo: uploadedStoreLogo,
        type_logo: uploadedTypeLogo,
        status,
      };

      if (!password) delete payload.password;

      await onSubmit(payload);
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to create/update merchant");
    }
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

          {/* STORE TYPE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Store Type
            </label>
            <select
              value={storeType}
              onChange={(e) => setStoreType(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
            >
              <option value="">Select Store Type</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Cafe">Cafe</option>
              <option value="Bakery">Bakery</option>
              <option value="Fast Food">Fast Food</option>
              <option value="Pizza Store">Pizza Store</option>
              <option value="Ice Cream Shop">Ice Cream Shop</option>
              <option value="Grocery">Grocery</option>
              <option value="Supermarket">Supermarket</option>
              <option value="Organic Store">Organic Store</option>
              <option value="Fruits & Vegetables">Fruits & Vegetables</option>
              <option value="Dairy Store">Dairy Store</option>
              <option value="Pharmacy">Pharmacy</option>
              <option value="Medical Store">Medical Store</option>
              <option value="Fashion">Fashion</option>
              <option value="Men's Fashion">Men's Fashion</option>
              <option value="Women's Fashion">Women's Fashion</option>
              <option value="Kids Fashion">Kids Fashion</option>
              <option value="Footwear">Footwear</option>
              <option value="Jewellery">Jewellery</option>
              <option value="Cosmetics">Cosmetics</option>
              <option value="Electronics">Electronics</option>
              <option value="Mobile Store">Mobile Store</option>
              <option value="Computer Store">Computer Store</option>
              <option value="Home Appliances">Home Appliances</option>
              <option value="Salon">Salon</option>
              <option value="Spa">Spa</option>
              <option value="Beauty Parlour">Beauty Parlour</option>
              <option value="Barber Shop">Barber Shop</option>
              <option value="Furniture">Furniture</option>
              <option value="Home Decor">Home Decor</option>
              <option value="Pet Store">Pet Store</option>
              <option value="Book Store">Book Store</option>
              <option value="Stationery">Stationery</option>
              <option value="Florist">Florist</option>
              <option value="Gift Shop">Gift Shop</option>
              <option value="Sports Store">Sports Store</option>
              <option value="Automobile">Automobile</option>
              <option value="Bike Service">Bike Service</option>
              <option value="Car Service">Car Service</option>
              <option value="Liquor Store">Liquor Store</option>
              <option value="Hotel">Hotel</option>
              <option value="Resort">Resort</option>
              <option value="Laundry">Laundry</option>
              <option value="Cloud Kitchen">Cloud Kitchen</option>
              <option value="Sweet Shop">Sweet Shop</option>
              <option value="Toy Store">Toy Store</option>
              <option value="Meat & Seafood">Meat & Seafood</option>
              <option value="Hardware Store">Hardware Store</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* STORE LOGO */}
          <div>
            <label className="block text-sm font-medium mb-1">Store Logo</label>
            {!storeLogoPreview ? (
              <div
                className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer"
                onClick={() => document.getElementById("store-logo-upload").click()}
              >
                <p className="text-gray-500 text-sm">Click to upload store logo</p>
                <input
                  id="store-logo-upload"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const f = e.target.files && e.target.files[0];
                    if (!f) return;
                    setStoreLogoFile(f);
                    setStoreLogoPreview(URL.createObjectURL(f));
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <img src={storeLogoPreview} alt="store" className="h-20 w-20 object-contain rounded" />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      document.getElementById("store-logo-upload").click();
                    }}
                    className="px-3 py-1 border rounded"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStoreLogoFile(null);
                      setStoreLogoPreview("");
                      setStoreLogo("");
                    }}
                    className="px-3 py-1 border rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* TYPE LOGO */}
          <div>
            <label className="block text-sm font-medium mb-1">Type Logo</label>
            {!typeLogoPreview ? (
              <div
                className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer"
                onClick={() => document.getElementById("type-logo-upload").click()}
              >
                <p className="text-gray-500 text-sm">Click to upload type logo</p>
                <input
                  id="type-logo-upload"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const f = e.target.files && e.target.files[0];
                    if (!f) return;
                    setTypeLogoFile(f);
                    setTypeLogoPreview(URL.createObjectURL(f));
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <img src={typeLogoPreview} alt="type" className="h-20 w-20 object-contain rounded" />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => document.getElementById("type-logo-upload").click()}
                    className="px-3 py-1 border rounded"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTypeLogoFile(null);
                      setTypeLogoPreview("");
                      setTypeLogo("");
                    }}
                    className="px-3 py-1 border rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* LATITUDE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Latitude
            </label>
            <input
              type="number"
              step="0.00000001"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Enter Latitude"
            />
          </div>

          {/* LONGITUDE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Longitude
            </label>
            <input
              type="number"
              step="0.00000001"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Enter Longitude"
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
