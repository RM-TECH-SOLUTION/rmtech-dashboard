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
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const token = localStorage.getItem("token");


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

    return matchSearch && matchStatus;
  });

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

  const handleStatusUpdate = async (order) => {
    if (order.order_status === "refunded") return;

    const nextStatus = STATUS_FLOW[order.order_status];
    if (!nextStatus) return;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id ? { ...o, order_status: nextStatus } : o
      )
    );

    await fetch("https://api.rmtechsolution.com/updateOrderStatus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: order.id,
        order_status: nextStatus,
        merchantId: token,
      }),
    });
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Order Status</h1>
        <p className="text-gray-600">Manage all your orders</p>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-xl border flex gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
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
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Order Type</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Payment Status</th>
              <th className="px-6 py-3">Order Status</th>
              <th className="px-6 py-3">Action</th>
              <th className="px-6 py-3">Refund</th>
            </tr>
          </thead>

          <tbody>
            {paginatedOrders.map((order) => (
            <tr key={order.id}>
  <td className="px-6 py-4 text-center">
  <button
    onClick={() => setSelectedOrder(order)}
    className="text-blue-600 hover:underline font-medium"
  >
    {order.id}
  </button>
</td>

  <td className="px-6 py-4 text-center">{order.customer}</td>
  <td className="px-6 py-4 text-center">{order.date}</td>
  <td className="px-6 py-4 text-center">{order.orderType || "-"}</td>
  <td className="px-6 py-4 font-semibold text-center">{order.amount}</td>

  {/* PAYMENT STATUS */}
  <td className="px-6 py-4 text-center">
    <span
      className={`px-2 py-1 text-xs rounded-full ${PAYMENT_STATUS_STYLES[order.payment_status]}`}
    >
      {order.payment_status}
    </span>
  </td>

  {/* ORDER STATUS */}
  <td className="px-6 py-4 text-center">
    <span
      className={`px-2 py-1 text-xs rounded-full ${STATUS_STYLES[order.order_status]}`}
    >
      {order.order_status}
    </span>
  </td>

  {/* ACTION */}
  <td className="px-6 py-4 text-center">
    <button
      onClick={() => handleStatusUpdate(order)}
      disabled={
        !(
          order.payment_status === "pending" ||
          order.payment_status === "success"
        )
      }
      className={`px-3 py-1 text-xs rounded transition
        ${
          order.payment_status === "pending" ||
          order.payment_status === "success"
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }
      `}
    >
      Mark {STATUS_FLOW[order.order_status]}
    </button>
  </td>

  {/* REFUND */}
  <td className="px-6 py-4 text-center">
    <button
      disabled={
        order.payment_status !== "success" ||
        order.payment_status === "refunded"
      }
      onClick={() => handleRefund(order)}
      className={`px-3 py-1 text-xs rounded
        ${
          order.payment_status !== "success" ||
          order.payment_status === "refunded"
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-red-600 text-white hover:bg-red-700"
        }
      `}
    >
      Refund
    </button>
  </td>
</tr>

            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Showing {startIndex + 1}–
          {Math.min(startIndex + ITEMS_PER_PAGE, filteredOrders.length)} of{" "}
          {filteredOrders.length}
        </span>

        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="px-3 py-1 border rounded">{currentPage}</span>

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
     {selectedOrder && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

    <div className="bg-white max-w-3xl w-full p-6 rounded-xl relative max-h-[80vh] overflow-y-auto">

      {/* Close */}
      <button
        onClick={() => setSelectedOrder(null)}
        className="absolute top-3 right-4 text-xl font-bold text-gray-500 hover:text-black"
      >
        ✕
      </button>

      <h2 className="text-xl font-bold mb-6 text-center">
        Order Details
      </h2>

      {/* ================= ORDER INFO ================= */}
      <div className="grid grid-cols-2 gap-4 mb-6">

        <div>
          <p className="text-sm text-gray-500">Order ID</p>
          <p className="font-semibold">{selectedOrder.id}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Order Type</p>
          <p className="font-semibold">{selectedOrder.orderType}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Amount</p>
          <p className="font-semibold">{selectedOrder.amount}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Date</p>
          <p className="font-semibold">{selectedOrder.date}</p>
        </div>

      </div>

      {/* ================= CUSTOMER INFO ================= */}
      <div className="border-t pt-4 mb-6">

        <h3 className="font-semibold mb-3">Customer Info</h3>

        <div className="grid grid-cols-2 gap-4">

          <div>
            <p className="text-sm text-gray-500">Customer ID</p>
            <p>{selectedOrder.customer}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p>{selectedOrder.phone}</p>
          </div>

        </div>

      </div>

      {/* ================= PAYMENT INFO ================= */}
      <div className="border-t pt-4 mb-6">

        <h3 className="font-semibold mb-3">Payment Info</h3>

        <div className="grid grid-cols-2 gap-4">

          <div>
            <p className="text-sm text-gray-500">Payment Status</p>
            <p>{selectedOrder.payment_status}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Payment ID</p>
            <p className="break-all">{selectedOrder.payment_id || "-"}</p>
          </div>

        </div>

      </div>

      {/* ================= ITEMS ================= */}
      <div className="border-t pt-4 mb-6">

        <h3 className="font-semibold mb-3">Items</h3>

        {Array.isArray(selectedOrder.items) ? (
          <table className="w-full border text-sm">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Item_id</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Total</th>
              </tr>
            </thead>

            <tbody>
              {selectedOrder.items.map((i, idx) => (
                <tr key={idx}>
                  <td className="p-2 border text-center">{i.item_id}</td>
                  <td className="p-2 border text-center">{i.item_name}</td>
                  <td className="p-2 border text-center">₹{i.price}</td>
                  <td className="p-2 border text-center">{i.quantity}</td>
                  <td className="p-2 border text-center">₹{i.total}</td>
                </tr>
              ))}
            </tbody>

          </table>
        ) : (
          <p>No items</p>
        )}

      </div>

      {/* ================= ADDRESS ================= */}
      {selectedOrder.address && (
        <div className="border-t pt-4">

          <h3 className="font-semibold mb-3">Delivery Address</h3>

          <p>{selectedOrder.address.name}</p>
          <p>{selectedOrder.address.street}</p>
          <p>
            {selectedOrder.address.city} -{" "}
            {selectedOrder.address.pincode}
          </p>

        </div>
      )}

    </div>
  </div>
)}

    </div>
  );
};


export default OrdersList;
