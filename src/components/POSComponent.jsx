import React, { useState, useEffect } from "react";
import { Search, Trash2 } from "lucide-react";

const merchantId = 9;

const suggestedCoupons = [
  { code: "SAVE10", label: "10% OFF" },
  { code: "FLAT50", label: "₹50 OFF" },
  { code: "WELCOME20", label: "20% OFF" },
];

export default function POSComponent() {

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");

  const [cart, setCart] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});

  const [showCheckout, setShowCheckout] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [discount, setDiscount] = useState(0);

  /* ================= FETCH CATALOG ================= */

  useEffect(() => {
    fetchCatalogModels();
  }, []);

  const fetchCatalogModels = async () => {

    try {

      const res = await fetch(
        `https://api.rmtechsolution.com/getCatalogueModels?merchantId=${merchantId}`
      );

      const data = await res.json();

      setCategories(data?.data || []);

      if (data?.data?.length > 0) {
        setSelectedCategory(data.data[0]);
        loadItems(data.data[0].id);
      }

    } catch (err) {
      console.log("Catalog error", err);
    }

  };

  /* ================= FETCH ITEMS ================= */

  const loadItems = async (catalogId) => {

    try {

      const res = await fetch(
        `https://api.rmtechsolution.com/getCatalogueItems?catalogueModelId=${catalogId}&merchantId=${merchantId}`
      );

      const data = await res.json();

      setProducts(data?.data || []);

    } catch (err) {
      console.log("Items error", err);
    }

  };

  /* ================= ADD TO CART ================= */

 const addToCart = (product) => {

  const selected =
    selectedVariants[product.id] || product.variants?.[0];

  const variantId = selected?.id || "default";
  const variantName = selected?.variant_name || "";
 const price = Number(selected?.price || product.price || 0);

  const exist = cart.find(
    (item) =>
      item.id === product.id &&
      item.variantId === variantId
  );

  if (exist) {

    setCart(
      cart.map((item) =>
        item.id === product.id &&
        item.variantId === variantId
          ? { ...item, qty: item.qty + 1 }
          : item
      )
    );

  } else {

    setCart([
      ...cart,
      {
        id: product.id,
        variantId,
        name: product.name,
        variant: variantName,
        price,
        qty: 1,
      },
    ]);

  }

};
  /* ================= UPDATE QTY ================= */

const updateQty = (id, variantId, type) => {

  const updated = cart
    .map((item) => {

      if (item.id === id && item.variantId === variantId) {

        const qty =
          type === "inc" ? item.qty + 1 : item.qty - 1;

        return { ...item, qty };

      }

      return item;

    })
    .filter((i) => i.qty > 0);

  setCart(updated);

};

  /* ================= REMOVE ITEM ================= */

const removeItem = (id, variantId) => {
  setCart(
    cart.filter(
      (item) =>
        !(item.id === id && item.variantId === variantId)
    )
  );
};
  /* ================= TOTAL ================= */

  const total = cart.reduce((sum, i) => sum + i.qty * i.price, 0);
  const finalTotal = total - discount;

  /* ================= COUPON ================= */

  const applyCoupon = () => {

    if (couponCode === "SAVE10") setDiscount(total * 0.1);
    else if (couponCode === "FLAT50") setDiscount(50);
    else if (couponCode === "WELCOME20") setDiscount(total * 0.2);
    else {
      alert("Invalid Coupon");
      setDiscount(0);
    }

  };

  /* ================= FILTER ================= */

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">

      {/* HEADER */}

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Point of Sale (POS)</h1>
        <p className="text-gray-600">
          Manage orders and generate bills quickly
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* CATALOG */}

        <div className="md:col-span-2 bg-white rounded-xl shadow p-4">

          <h2 className="font-bold mb-3">Catalog</h2>

          {categories.map((cat) => (

            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat);
                loadItems(cat.id);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg mb-2 ${
                selectedCategory?.id === cat.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              {cat.name}
            </button>

          ))}

        </div>

        {/* PRODUCTS */}

        <div className="md:col-span-7">

          <div className="mb-4 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              className="w-full border rounded-lg p-2 pl-10"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {filteredProducts.map((product) => {

              const selected =
                selectedVariants[product.id] || product.variants?.[0];

              const price = selected?.price || product.price;

              const image =
                product.images?.[0] || product.image?.[0];

              return (

                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow p-4 flex flex-col"
                >

                  {image && (
                    <img
                      src={image}
                      alt={product.name}
                      className="h-24 object-cover rounded mb-3"
                    />
                  )}

                  <h3 className="font-semibold">{product.name}</h3>

                  {product.variants?.length > 0 && (

                 <select
  className="border rounded mt-2 p-1 text-sm"
  value={selectedVariants[product.id]?.id || product.variants?.[0]?.id}
  onChange={(e) => {

    const variant = product.variants.find(
      (v) => v.id.toString() === e.target.value
    );

    setSelectedVariants((prev) => ({
      ...prev,
      [product.id]: variant,
    }));

  }}
>
  {product.variants.map((v) => (
    <option key={v.id} value={v.id}>
      {v.variant_name} - ₹{v.price}
    </option>
  ))}
</select>

                  )}

                  <p className="font-bold text-blue-600 mt-2">
                    ₹{price}
                  </p>

                  <button
                    onClick={() => addToCart(product)}
                    className="w-full mt-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  >
                    Add
                  </button>

                </div>

              );

            })}

          </div>

        </div>

        {/* CART */}

        <div className="md:col-span-3 bg-white rounded-xl shadow p-4">

          <h2 className="font-bold border-b pb-3">Cart</h2>

          <div className="space-y-3 mt-3 max-h-[350px] overflow-auto">

            {cart.map((item) => (

              <div
                key={`${item.id}-${item.variantId}`}
                className="flex justify-between items-center border-b pb-2"
              >

                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.variant} • ₹{item.price}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">

                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        updateQty(item.id, item.variantId, "dec")
                      }
                      className="w-7 h-7 bg-gray-200 rounded"
                    >
                      -
                    </button>

                    <span>{item.qty}</span>

                    <button
                      onClick={() =>
                        updateQty(item.id, item.variantId, "inc")
                      }
                      className="w-7 h-7 bg-gray-200 rounded"
                    >
                      +
                    </button>

                  </div>

                  <Trash2
                    onClick={() =>
                      removeItem(item.id, item.variantId)
                    }
                    size={16}
                    className="text-red-500 cursor-pointer"
                  />

                </div>

              </div>

            ))}

          </div>

          <div className="border-t pt-4">

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              onClick={() => setShowCheckout(true)}
              className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              Checkout
            </button>

          </div>

        </div>

      </div>

      {/* CHECKOUT POPUP */}

     {showCheckout && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">

    <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">

      <h2 className="text-xl font-bold mb-4">Checkout</h2>

      {/* Customer Phone */}

      <input
        type="tel"
        placeholder="Customer Phone"
        className="w-full border rounded-lg p-2 mb-3"
      />

      {/* Coupon */}

      <div className="flex gap-2 mb-2">

        <input
          type="text"
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="flex-1 border rounded-lg p-2"
        />

        <button
          onClick={applyCoupon}
          className="px-4 bg-green-600 text-white rounded-lg"
        >
          Redeem
        </button>

      </div>

      {/* Suggested Coupons */}

      <div className="flex flex-wrap gap-2 mb-4">

        {suggestedCoupons.map((c) => (

          <button
            key={c.code}
            onClick={() => setCouponCode(c.code)}
            className="px-3 py-1 bg-gray-100 rounded-lg text-sm hover:bg-blue-600 hover:text-white"
          >
            {c.code}
          </button>

        ))}

      </div>

      {/* Bill Summary */}

      <div className="border-t pt-3 space-y-2">

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{total}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-₹{discount}</span>
          </div>
        )}

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{finalTotal}</span>
        </div>

      </div>

      {/* Payment Method */}

      <div className="flex gap-4 mt-4">

        <button
          onClick={() => setPaymentMethod("cash")}
          className={`px-4 py-2 border rounded ${
            paymentMethod === "cash" ? "bg-blue-600 text-white" : ""
          }`}
        >
          Cash
        </button>

        <button
          onClick={() => setPaymentMethod("online")}
          className={`px-4 py-2 border rounded ${
            paymentMethod === "online" ? "bg-blue-600 text-white" : ""
          }`}
        >
          Online
        </button>

      </div>

      {/* Buttons */}

      <div className="flex gap-3 mt-6">

        <button
          onClick={() => setShowCheckout(false)}
          className="flex-1 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">
          Print Bill
        </button>

      </div>

    </div>

  </div>
)}

    </div>
  );
}