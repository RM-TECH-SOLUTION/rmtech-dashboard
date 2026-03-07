import React, { useState, useEffect } from "react";
import { Search, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCoupon,
  getCoupon,
  deleteCoupon,
  saveLoyaltySettings,
  getLoyaltySettings,
} from "../redux/actions/cmsActions";

const CouponsComponent = () => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const { getCouponData = [], loading } = useSelector(
    (state) => state.cms
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [couponForm, setCouponForm] = useState({
    code: "",
    type: "flat",
    value: "",
    minOrder: "",
    expiry: "",
    usageLimit: "",
    active: true,
  });

  const [loyaltyForm, setLoyaltyForm] = useState({
    spend_amount: 100,
    reward_points: 10,
    referral_new_user_points: 100,
    referral_referrer_points: 100,
    point_value: 1,
    min_redeem_points: 0,
    max_redeem_points: 1000,
    max_redeem_percentage: 100,
    enable_referral: 1,
    enable_redeem: 1,
  });

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    if (token) {
      dispatch(getCoupon(token));

      dispatch(getLoyaltySettings(token)).then((res) => {
        if (res?.success) {
          setLoyaltyForm(res.settings);
        }
      });
    }
  }, [dispatch, token]);

  /* ================= CREATE COUPON ================= */

  const handleCreateCoupon = async () => {
    if (!couponForm.code || !couponForm.value) {
      alert("Please fill required fields");
      return;
    }

    const payload = {
      merchantId: token,
      ...couponForm,
    };

    const response = await dispatch(createCoupon(payload));

    if (response?.success) {
      alert("Coupon created successfully!");
      setShowModal(false);
      dispatch(getCoupon(token));

      setCouponForm({
        code: "",
        type: "flat",
        value: "",
        minOrder: "",
        expiry: "",
        usageLimit: "",
        active: true,
      });
    } else {
      alert(response?.message || "Failed to create coupon");
    }
  };

  /* ================= DELETE COUPON ================= */

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?"))
      return;

    const response = await dispatch(deleteCoupon(id));

    if (response?.success) {
      alert("Coupon deleted successfully");
      dispatch(getCoupon(token));
    } else {
      alert(response?.message || "Failed to delete coupon");
    }
  };

  /* ================= SAVE LOYALTY ================= */

  const handleSaveLoyalty = async () => {
    const payload = {
      merchant_id: token,
      ...loyaltyForm,
    };

    const res = await dispatch(saveLoyaltySettings(payload));

    if (res?.success) {
      alert("Loyalty settings saved successfully!");
    } else {
      alert(res?.message || "Failed to save settings");
    }
  };

  /* ================= FILTER ================= */

  const filteredCoupons = (getCouponData || []).filter((c) =>
    c.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 px-2 sm:px-4">
        {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Coupons and Loyalty</h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600">Manage discount coupons and Loyalty Settings</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-3 sm:px-4 md:px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-xs sm:text-sm md:text-base whitespace-nowrap flex-shrink-0"
        >
          + Create Coupon
        </button>
      </div>

       {/* ================= LOYALTY SETTINGS ================= */}

      <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 md:p-6">
  <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6">Loyalty Settings</h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">

    {/* Spend Rule */}
    <div>
      <label className="block text-xs sm:text-sm font-semibold mb-2">
        Spend Amount (₹)
      </label>
      <input
        type="number"
        value={loyaltyForm.spend_amount}
        onChange={(e) =>
          setLoyaltyForm({
            ...loyaltyForm,
            spend_amount: e.target.value,
          })
        }
        className="w-full border p-2 sm:p-3 rounded-lg text-xs sm:text-sm"
      />
    </div>

    <div>
      <label className="block text-xs sm:text-sm font-semibold mb-2">
        Reward Points
      </label>
      <input
        type="number"
        value={loyaltyForm.reward_points}
        onChange={(e) =>
          setLoyaltyForm({
            ...loyaltyForm,
            reward_points: e.target.value,
          })
        }
        className="w-full border p-2 sm:p-3 rounded-lg text-xs sm:text-sm"
      />
    </div>

    {/* Referral Settings */}
    <div>
      <label className="block text-xs sm:text-sm font-semibold mb-2">
        New User Referral Points
      </label>
      <input
        type="number"
        value={loyaltyForm.referral_new_user_points}
        onChange={(e) =>
          setLoyaltyForm({
            ...loyaltyForm,
            referral_new_user_points: e.target.value,
          })
        }
        className="w-full border p-2 sm:p-3 rounded-lg text-xs sm:text-sm"
      />
    </div>

    <div>
      <label className="block text-xs sm:text-sm font-semibold mb-2">
        Referrer Reward Points
      </label>
      <input
        type="number"
        value={loyaltyForm.referral_referrer_points}
        onChange={(e) =>
          setLoyaltyForm({
            ...loyaltyForm,
            referral_referrer_points: e.target.value,
          })
        }
        className="w-full border p-2 sm:p-3 rounded-lg text-xs sm:text-sm"
      />
    </div>

    {/* Point Value */}
    <div>
      <label className="block text-xs sm:text-sm font-semibold mb-2">
        1 Point Value (₹)
      </label>
      <input
        type="number"
        step="0.1"
        value={loyaltyForm.point_value}
        onChange={(e) =>
          setLoyaltyForm({
            ...loyaltyForm,
            point_value: e.target.value,
          })
        }
        className="w-full border p-2 sm:p-3 rounded-lg text-xs sm:text-sm"
      />
    </div>

    {/* Redeem Settings */}
    <div>
      <label className="block text-xs sm:text-sm font-semibold mb-2">
        Minimum Redeem Points
      </label>
      <input
        type="number"
        value={loyaltyForm.min_redeem_points}
        onChange={(e) =>
          setLoyaltyForm({
            ...loyaltyForm,
            min_redeem_points: e.target.value,
          })
        }
        className="w-full border p-2 sm:p-3 rounded-lg text-xs sm:text-sm"
      />
    </div>

    <div>
      <label className="block text-xs sm:text-sm font-semibold mb-2">
        Maximum Redeem Points
      </label>
      <input
        type="number"
        value={loyaltyForm.max_redeem_points}
        onChange={(e) =>
          setLoyaltyForm({
            ...loyaltyForm,
            max_redeem_points: e.target.value,
          })
        }
        className="w-full border p-2 sm:p-3 rounded-lg text-xs sm:text-sm"
      />
    </div>

    <div>
      <label className="block text-xs sm:text-sm font-semibold mb-2">
        Maximum Redeem Percentage (%)
      </label>
      <input
        type="number"
        value={loyaltyForm.max_redeem_percentage}
        onChange={(e) =>
          setLoyaltyForm({
            ...loyaltyForm,
            max_redeem_percentage: e.target.value,
          })
        }
        className="w-full border p-2 sm:p-3 rounded-lg text-xs sm:text-sm"
      />
    </div>

  </div>

  {/* Toggles */}
  <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 md:gap-8 mt-4 sm:mt-6 md:mt-8">

    <label className="flex items-center gap-2 font-medium text-xs sm:text-sm">
      <input
        type="checkbox"
        checked={loyaltyForm.enable_referral == 1}
        onChange={(e) =>
          setLoyaltyForm({
            ...loyaltyForm,
            enable_referral: e.target.checked ? 1 : 0,
          })
        }
      />
      Enable Referral System
    </label>

    <label className="flex items-center gap-2 font-medium text-xs sm:text-sm">
      <input
        type="checkbox"
        checked={loyaltyForm.enable_redeem == 1}
        onChange={(e) =>
          setLoyaltyForm({
            ...loyaltyForm,
            enable_redeem: e.target.checked ? 1 : 0,
          })
        }
      />
      Enable Points Redemption
    </label>

  </div>

  <button
    onClick={handleSaveLoyalty}
     className="px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm sm:text-base mt-6 sm:mt-8 md:mt-12"
  >
    Save Loyalty Settings
  </button>
</div>

      {/* ================= SEARCH ================= */}
      <div className="bg-white p-3 sm:p-4 rounded-xl shadow-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search coupon code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 sm:pr-4 py-2 border rounded-lg text-sm sm:text-base"
          />
        </div>
      </div>

      {/* ================= COUPON TABLE ================= */}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        {loading ? (
          <div className="p-4 sm:p-6 text-center text-sm sm:text-base">Loading coupons...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold">Code</th>
                <th className="hidden sm:table-cell px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold">Type</th>
                <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold">Value</th>
                <th className="hidden md:table-cell px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold">Min Order</th>
                <th className="hidden lg:table-cell px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold">Expiry</th>
                <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold">Status</th>
                <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold">{coupon.code}</td>
                  <td className="hidden sm:table-cell px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-xs sm:text-sm">{coupon.type}</td>
                  <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-xs sm:text-sm">
                    {coupon.type === "flat"
                      ? `₹${coupon.value}`
                      : `${coupon.value}%`}
                  </td>
                  <td className="hidden md:table-cell px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-xs sm:text-sm">₹{coupon.minOrder || 0}</td>
                  <td className="hidden lg:table-cell px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-xs sm:text-sm">{coupon.expiry}</td>
                  <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-xs sm:text-sm">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        coupon.active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {coupon.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
                    <button
                      onClick={() => handleDeleteCoupon(coupon.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= CREATE MODAL ================= */}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-xl relative shadow-lg p-4 sm:p-6">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-xl font-bold text-gray-500"
            >
              ✕
            </button>

            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-center">
              Create Coupon
            </h2>

            <div className="space-y-3 sm:space-y-4">
              <input
                type="text"
                placeholder="Coupon Code"
                value={couponForm.code}
                onChange={(e) =>
                  setCouponForm({
                    ...couponForm,
                    code: e.target.value.toUpperCase(),
                  })
                }
                className="w-full border p-2 sm:p-3 rounded-lg text-sm sm:text-base"
              />

              <select
                value={couponForm.type}
                onChange={(e) =>
                  setCouponForm({ ...couponForm, type: e.target.value })
                }
                className="w-full border p-2 sm:p-3 rounded-lg text-sm sm:text-base"
              >
                <option value="flat">Flat Amount</option>
                <option value="percentage">Percentage</option>
              </select>

              <input
                type="number"
                placeholder="Discount Value"
                value={couponForm.value}
                onChange={(e) =>
                  setCouponForm({ ...couponForm, value: e.target.value })
                }
                className="w-full border p-2 sm:p-3 rounded-lg text-sm sm:text-base"
              />

              <input
                type="number"
                placeholder="Minimum Order Amount"
                value={couponForm.minOrder}
                onChange={(e) =>
                  setCouponForm({ ...couponForm, minOrder: e.target.value })
                }
                className="w-full border p-2 sm:p-3 rounded-lg text-sm sm:text-base"
              />

              <input
                type="date"
                value={couponForm.expiry}
                onChange={(e) =>
                  setCouponForm({ ...couponForm, expiry: e.target.value })
                }
                className="w-full border p-2 sm:p-3 rounded-lg text-sm sm:text-base"
              />

              <button
                onClick={handleCreateCoupon}
                className="w-full px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm sm:text-base mt-4 sm:mt-6"
              >
                Create Coupon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsComponent;