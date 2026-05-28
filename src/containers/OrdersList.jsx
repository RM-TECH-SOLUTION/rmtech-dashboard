import React, { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

/* ================= ORDER STATUS CONFIG ================= */

const STATUS_FLOW = {
  pending: "accepted",
  accepted: "shipped",
  shipped: "delivered",
};

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  refunded: "bg-red-100 text-red-800",
};

/* ================= PAYMENT STATUS CONFIG ================= */

const PAYMENT_STATUS_STYLES = {
  success: "bg-green-100 text-green-800",
  failure: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
  refunded: "bg-purple-100 text-purple-800",
};

const ITEMS_PER_PAGE = 10;

/* ================= MAIN ================= */

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const merchantData = user.merchantData;

  console.log(user, "user");
  console.log(merchantData, "merchantData");


  /* ================= FETCH ================= */

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(
        `https://api.rmtechsolution.com/getPaymentTransactions.php?merchantId=${token}`
      );
      const data = await res.json();

      if (data.success) {
        setOrders(
          data.data.map((item) => ({
            id: item.order_id,
            customer: item.user_id || "N/A",
            phone: item.phone || "-",
            date: item.created_at
              ? item.created_at.split(" ")[0]
              : "-",
            amount: `₹${item.amount}`,
            amountNumber: Number(item.amount) || 0,
            orderType: item.orderType,
            discount: `₹${item.discount}`,
            items: item.items,
            address: item.address,
            order_status: item.order_status ?? "pending",
            payment_status: item.payment_status ?? "pending",
            payment_id: item.payment_id,
          }))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  /* ================= FILTER ================= */

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      statusFilter === "all" || o.order_status === statusFilter;

    const matchFromDate =
      !dateFrom || o.date === "-" || o.date >= dateFrom;

    const matchToDate =
      !dateTo || o.date === "-" || o.date <= dateTo;

    return matchSearch && matchStatus && matchFromDate && matchToDate;
  });

  const totalAmount = filteredOrders.reduce(
    (sum, o) => sum + (Number(o.amountNumber) || 0),
    0
  );

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  /* ================= REFUND ================= */

  const handleRefund = async (order) => {
    if (order.payment_status !== "success") {
      alert("Only successful payments can be refunded");
      return;
    }

    if (!window.confirm("Are you sure to refund this payment?")) return;

    try {
      const res = await fetch(
        "https://api.rmtechsolution.com/refund_payment.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            payment_id: order.payment_id,
            keyId: merchantData?.key_id,
            keySecret: merchantData?.key_secret
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Refund successful");

        setOrders((prev) =>
          prev.map((o) =>
            o.id === order.id
              ? {
                ...o,
                order_status: "refunded",
                payment_status: "refunded",
              }
              : o
          )
        );
      } else {
        alert("Refund failed");
      }
    } catch (e) {
      alert("Server error");
    }
  };

  /* ================= UPDATE ORDER STATUS ================= */

  const updateOrderStatusLocally = (orderId, status) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, order_status: status } : o
      )
    );

    setSelectedOrder((prev) =>
      prev && prev.id === orderId
        ? { ...prev, order_status: status }
        : prev
    );
  };

  const updateOrderStatusApi = async (orderId, status) => {
    await fetch("https://api.rmtechsolution.com/updateOrderStatus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        order_status: status,
        merchantId: token,
        reject: status === "rejected" ? 1 : 0,
      }),
    });
  };

  const handleStatusUpdate = async (order) => {
    if (order.order_status === "refunded" || order.order_status === "rejected") return;

    const nextStatus = STATUS_FLOW[order.order_status];
    if (!nextStatus) return;

    updateOrderStatusLocally(order.id, nextStatus);

    await updateOrderStatusApi(order.id, nextStatus);
  };

  const handleRejectOrder = async (order) => {
    if (
      order.order_status === "refunded" ||
      order.order_status === "rejected" ||
      order.order_status === "delivered"
    ) {
      return;
    }

    updateOrderStatusLocally(order.id, "rejected");

    await updateOrderStatusApi(order.id, "rejected");
  };

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 px-2 sm:px-4 md:px-6">

      {/* HEADER */}
      <div className="px-2 sm:px-0">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Order Status</h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-600">Manage all your orders</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-gray-500">Total Amount</p>
          <p className="mt-2 text-3xl font-bold">₹{totalAmount.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">Based on filtered orders</p>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <label className="block text-xs font-medium text-gray-600 mb-2">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
        </div>

        <div className="bg-white rounded-xl border p-4">
          <label className="block text-xs font-medium text-gray-600 mb-2">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-2 sm:p-4 rounded-xl border flex gap-2 sm:gap-4 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            className="w-full pl-10 pr-3 sm:pr-4 py-2 border rounded-lg text-sm sm:text-base"
            placeholder="Search by order id or user..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full divide-y">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold">Order ID</th>
              <th className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold hidden sm:table-cell">Customer</th>
              <th className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold">Date</th>
              <th className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold hidden md:table-cell">Type</th>
              <th className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold">Amount</th>
              <th className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold">Payment</th>
              <th className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold hidden lg:table-cell">Status</th>
              <th className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold">Action</th>
              <th className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold">Reject</th>
              <th className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold">Refund</th>
            </tr>
          </thead>

          <tbody>
            {paginatedOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-blue-600 hover:underline font-medium text-xs sm:text-sm break-all"
                  >
                    {order.id}
                  </button>
                </td>

                <td className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 hidden sm:table-cell text-xs sm:text-sm">{order.customer}</td>
                <td className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 text-xs sm:text-sm">{order.date}</td>
                <td className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 hidden md:table-cell text-xs sm:text-sm">{order.orderType || "-"}</td>
                <td className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 font-semibold text-xs sm:text-sm">{order.amount}</td>

                {/* PAYMENT STATUS */}
                <td className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3">
                  <span
                    className={`inline-block px-1.5 sm:px-2 py-0.5 text-xs rounded-full ${PAYMENT_STATUS_STYLES[order.payment_status]}`}
                  >
                    {order.payment_status}
                  </span>
                </td>

                {/* ORDER STATUS */}
                <td className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 hidden lg:table-cell">
                  <span
                    className={`inline-block px-1.5 sm:px-2 py-0.5 text-xs rounded-full ${STATUS_STYLES[order.order_status]}`}
                  >
                    {order.order_status}
                  </span>
                </td>

                {/* ACTION */}
                <td className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3">
                  <button
                    onClick={() => handleStatusUpdate(order)}
                    disabled={
                      !(
                        order.payment_status === "pending" ||
                        order.payment_status === "success"
                      ) ||
                      order.order_status === "rejected" ||
                      order.order_status === "refunded"
                    }
                    className={`px-1.5 sm:px-3 py-1 text-xs rounded transition whitespace-nowrap font-medium
 ${(order.payment_status === "pending" ||
                        order.payment_status === "success") &&
                        order.order_status !== "rejected" &&
                        order.order_status !== "refunded"
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }
 `}
                  >
                    <span className="hidden sm:inline">Next</span><span className="sm:hidden">→</span>
                  </button>
                </td>

                {/* REJECT */}
                <td className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3">
                  <button
                    disabled={
                      order.order_status === "rejected" ||
                      order.order_status === "refunded" ||
                      order.order_status === "delivered"
                    }
                    onClick={() => handleRejectOrder(order)}
                    className={`px-2 sm:px-3 py-1 text-xs rounded whitespace-nowrap font-medium
 ${order.order_status === "rejected" ||
                        order.order_status === "refunded" ||
                        order.order_status === "delivered"
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-orange-600 text-white hover:bg-orange-700"
                      }
 `}
                  >
                    Reject
                  </button>
                </td>

                {/* REFUND */}
                <td className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3">
                  <button
                    disabled={
                      order.payment_status !== "success" ||
                      order.payment_status === "refunded"
                    }
                    onClick={() => handleRefund(order)}
                    className={`px-2 sm:px-3 py-1 text-xs rounded whitespace-nowrap font-medium
 ${order.payment_status !== "success" ||
                        order.payment_status === "refunded"
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-700"
                      }
 `}
                  >
                    <span className="hidden sm:inline">Refund</span><span className="sm:hidden">RF</span>
                  </button>
                </td>
              </tr>

            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <span className="text-xs sm:text-sm text-gray-600">
          Showing {startIndex + 1}–
          {Math.min(startIndex + ITEMS_PER_PAGE, filteredOrders.length)} of{" "}
          {filteredOrders.length}
        </span>

        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-2 sm:px-3 py-1 border rounded disabled:opacity-50 text-sm"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="px-3 py-1 border rounded text-sm">{currentPage}</span>

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-2 sm:px-3 py-1 border rounded disabled:opacity-50 text-sm"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">

          <div className="bg-white max-w-3xl w-full p-3 sm:p-6 rounded-xl relative max-h-[90vh] overflow-y-auto">

            {/* Close */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-3 right-4 text-xl font-bold text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-center">
              Order Details
            </h2>

            {/* ================= ORDER INFO ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">

              <div>
                <p className="text-xs sm:text-sm text-gray-500">Order ID</p>
                <p className="font-semibold text-sm sm:text-base break-all">{selectedOrder.id}</p>
              </div>

              <div>
                <p className="text-xs sm:text-sm text-gray-500">Order Type</p>
                <p className="font-semibold text-sm sm:text-base">{selectedOrder.orderType}</p>
              </div>

              <div>
                <p className="text-xs sm:text-sm text-gray-500">Amount</p>
                <p className="font-semibold text-sm sm:text-base">{selectedOrder.amount}</p>
              </div>

              <div>
                <p className="text-xs sm:text-sm text-gray-500">Date</p>
                <p className="font-semibold text-sm sm:text-base">{selectedOrder.date}</p>
              </div>

            </div>

            {/* ================= CUSTOMER INFO ================= */}
            <div className="border-t pt-3 sm:pt-4 mb-4 sm:mb-6">

              <h3 className="font-semibold text-sm sm:text-base mb-3">Customer Info</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Customer ID</p>
                  <p className="text-sm sm:text-base">{selectedOrder.customer}</p>
                </div>

                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Phone</p>
                  <p className="text-sm sm:text-base break-all">{selectedOrder.phone}</p>
                </div>

              </div>

            </div>

            {/* ================= PAYMENT & ORDER STATUS ================= */}
            <div className="border-t pt-3 sm:pt-4 mb-4 sm:mb-6">

              <h3 className="font-semibold text-sm sm:text-base mb-3">Status Info</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Payment Status</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${PAYMENT_STATUS_STYLES[selectedOrder.payment_status]}`}>
                    {selectedOrder.payment_status}
                  </span>
                </div>

                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Order Status</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${STATUS_STYLES[selectedOrder.order_status]}`}>
                    {selectedOrder.order_status}
                  </span>
                </div>

                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Payment ID</p>
                  <p className="text-xs sm:text-sm break-all">{selectedOrder.payment_id || "-"}</p>
                </div>

              </div>

            </div>

            {/* ================= REFUND DETAILS ================= */}
            {selectedOrder.payment_status === "refunded" && (
              <div className="border-t pt-3 sm:pt-4 mb-4 sm:mb-6 bg-red-50 p-3 sm:p-4 rounded-lg">

                <h3 className="font-semibold text-sm sm:text-base mb-2 text-red-800">Refund Details</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

                  <div>
                    <p className="text-xs sm:text-sm text-red-700">Refund Status</p>
                    <p className="font-semibold text-sm sm:text-base text-red-900">Refunded</p>
                  </div>

                  <div>
                    <p className="text-xs sm:text-sm text-red-700">Refund Amount</p>
                    <p className="font-semibold text-sm sm:text-base text-red-900">{selectedOrder.amount}</p>
                  </div>

                </div>

              </div>
            )}

            {/* ================= ITEMS ================= */}
            <div className="border-t pt-3 sm:pt-4 mb-4 sm:mb-6">

              <h3 className="font-semibold text-sm sm:text-base mb-3">Items</h3>

              {Array.isArray(selectedOrder.items) ? (
                <div className="overflow-x-auto">
                  <table className="w-full border text-xs sm:text-sm">

                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 border">Item ID</th>
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Varient</th>
                        <th className="p-2 border">Price</th>
                        <th className="p-2 border">Qty</th>
                        <th className="p-2 border">Total</th>
                      </tr>
                    </thead>

                    <tbody>
                      {selectedOrder.items.map((i, idx) => (
                        <tr key={idx}>
                          <td className="p-2 border text-center">{i.item_id}</td>
                          <td className="p-2 border text-center text-xs">{i.item_name}</td>
                          <td className="p-2 border text-center text-xs">{i.variant_name}</td>
                          <td className="p-2 border text-center">₹{i.price}</td>
                          <td className="p-2 border text-center">{i.quantity}</td>
                          <td className="p-2 border text-center">₹{i.total}</td>
                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>
              ) : (
                <p className="text-sm">No items</p>
              )}

            </div>

            {/* ================= ADDRESS ================= */}

            {console.log(selectedOrder, "selectedOrderhh")}

            {selectedOrder?.address && (
              <div className="border-t pt-3 sm:pt-4 mb-4 sm:mb-6">

                <h3 className="font-semibold text-sm sm:text-base mb-3">
                  Delivery Address
                </h3>

                {selectedOrder.address.building && (
                  <p className="text-sm sm:text-base font-medium">
                    {selectedOrder.address.building}
                  </p>
                )}

                {(selectedOrder.address.doorNo || selectedOrder.address.street) && (
                  <p className="text-sm sm:text-base">
                    {selectedOrder.address.doorNo && `${selectedOrder.address.doorNo}, `}
                    {selectedOrder.address.street}
                  </p>
                )}

                {selectedOrder.address.landmark && (
                  <p className="text-sm sm:text-base">
                    {selectedOrder.address.landmark}
                  </p>
                )}

                {(selectedOrder.address.city ||
                  selectedOrder.address.pincode ||
                  selectedOrder.address.state) && (
                    <p className="text-sm sm:text-base">
                      {selectedOrder.address.city}
                      {selectedOrder.address.city && " - "}
                      {selectedOrder.address.pincode}
                      {selectedOrder.address.pincode && " - "}
                      {selectedOrder.address.state}
                    </p>
                  )}

              </div>
            )}

            {/* ================= ACTION BUTTONS ================= */}
            {/* <div className="border-t pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
 <button
 onClick={() => handleStatusUpdate(selectedOrder)}
 disabled={
 !(
 selectedOrder.payment_status === "pending" ||
 selectedOrder.payment_status === "success"
 )
 }
 className={`flex-1 px-4 sm:px-6 py-2 text-sm sm:text-base rounded transition font-medium
 ${
 selectedOrder.payment_status === "pending" ||
 selectedOrder.payment_status === "success"
 ? "bg-blue-600 text-white hover:bg-blue-700"
 : "bg-gray-300 text-gray-600 cursor-not-allowed"
 }
 `}
 >
 Mark {STATUS_FLOW[selectedOrder.order_status]}
 </button>

 <button
 disabled={
 selectedOrder.payment_status !== "success" ||
 selectedOrder.payment_status === "refunded"
 }
 onClick={() => {
 handleRefund(selectedOrder);
 setSelectedOrder(null);
 }}
 className={`flex-1 px-4 sm:px-6 py-2 text-sm sm:text-base rounded transition font-medium
 ${
 selectedOrder.payment_status !== "success" ||
 selectedOrder.payment_status === "refunded"
 ? "bg-gray-300 text-gray-600 cursor-not-allowed"
 : "bg-red-600 text-white hover:bg-red-700"
 }
 `}
 >
 Refund Payment
 </button>
 </div> */}

          </div>
        </div>
      )}

    </div>
  );
};


export default OrdersList;
