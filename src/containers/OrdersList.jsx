import React, { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

/* ================= STATUS CONFIG ================= */

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
};

const ITEMS_PER_PAGE = 10;


/* ================= MAIN ================= */

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
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
            date: item.created_at.split(" ")[0],
            amount: `₹${item.amount}`,
            discount:`₹${item.discount}`,
            items: item.items,
            address:item.address,
            order_status: item.order_status || "pending",
          }))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
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

  /* ================= UPDATE STATUS ================= */

  const handleStatusUpdate = async (order) => {
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Order Status</h1>
        <p className="text-gray-600">Manage all your orders</p>
      </div>

      {/* Search + Filter */}
      <div className="bg-white p-4 rounded-xl border flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            placeholder="Search by order id or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <select
          className="px-4 py-2 border rounded-lg"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">All Status</option>
          {Object.keys(STATUS_STYLES).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

   {/* ================= MOBILE CARDS ================= */}
<div className="sm:hidden space-y-4">
  {paginatedOrders.map((order) => (
    <div
      key={order.id}
      className="bg-white p-4 rounded-xl border shadow-sm"
    >
      {/* Order ID */}
      <div className="font-semibold text-sm break-all">
        {order.id}
      </div>

      {/* Customer */}
      <div className="text-sm text-gray-600 mt-1">
        {order.customer}
      </div>

      <div className="text-xs text-gray-400">
        {order.phone}
      </div>

      {/* ITEM */}
      <div className="mt-2 text-sm">
        <span className="text-gray-500">Item:</span>{" "}
        <span className="font-medium">
          {Array.isArray(order.items)
            ? order.items.map((i) => i.name).join(", ")
            : order.items || "-"}
        </span>
      </div>

      {/* ADDRESS */}
      {order.address && typeof order.address === "object" && (
        <div className="mt-2 text-sm">
          <span className="text-gray-500">Address:</span>
          <div className="text-gray-700 leading-snug mt-1">
            {order.address.name && <div>{order.address.name}</div>}
            {order.address.street && <div>{order.address.street}</div>}
            <div>
              {order.address.city}{" "}
              {order.address.pincode && `- ${order.address.pincode}`}
            </div>
          </div>
        </div>
      )}

      {/* DATE + AMOUNT */}
      <div className="flex justify-between mt-3 text-sm">
        <span>{order.date}</span>
        <span className="font-semibold">{order.amount}</span>
      </div>

      {/* STATUS + ACTION */}
      <div className="mt-3 flex items-center justify-between">
        <span
          className={`px-2 py-1 text-xs rounded-full ${STATUS_STYLES[order.order_status]}`}
        >
          {order.order_status}
        </span>

        {order.order_status !== "delivered" ? (
          <button
            onClick={() => handleStatusUpdate(order)}
            className="text-xs bg-blue-600 text-white px-3 py-1 rounded"
          >
            Mark {STATUS_FLOW[order.order_status]}
          </button>
        ) : (
          <span className="text-xs text-gray-400">Completed</span>
        )}
      </div>
    </div>
  ))}
</div>


      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden sm:block bg-white border rounded-xl overflow-hidden">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Order ID</th>
              <th className="px-6 py-3 text-left">Customer</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Amount</th>
              <th className="px-6 py-3 text-left">Discount</th>
              <th className="px-6 py-3 text-left">Item</th>
              <th className="px-6 py-3 text-left">Address</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>

            {paginatedOrders.length > 0 ?paginatedOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{order.id}</td>
                <td className="px-6 py-4">
                  {order.customer}
                  <div className="text-xs text-gray-400">{order.phone}</div>
                </td>
                <td className="px-6 py-4">{order.date}</td>
                <td className="px-6 py-4 font-semibold">{order.amount}</td>
                <td className="px-6 py-4 font-semibold">{order.discount}</td>
                <td className="px-6 py-4">
                  {Array.isArray(order.items)
                    ? order.items.map((i) => i.name).join(", ")
                    : order.items}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
  {order.address && typeof order.address === "object" ? (
    <div className="leading-snug">
      {order.address.name && (
        <div className="font-medium">{order.address.name}</div>
      )}
      {order.address.street && <div>{order.address.street}</div>}
      <div>
        {order.address.city}
        {order.address.pincode && ` - ${order.address.pincode}`}
      </div>
    </div>
  ) : (
    <span className="text-gray-400">-</span>
  )}
</td>

                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${STATUS_STYLES[order.order_status]}`}
                  >
                    {order.order_status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {order.order_status !== "delivered" ? (
                    <button
                      onClick={() => handleStatusUpdate(order)}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded"
                    >
                      Mark as {STATUS_FLOW[order.order_status]}
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400">Completed</span>
                  )}
                </td>
              </tr>
            ))
          :
          <div style={{padding:10}}>
          <span>No Orders Found</span>
          </div>
          }
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
    </div>
  );
};

export default OrdersList;
