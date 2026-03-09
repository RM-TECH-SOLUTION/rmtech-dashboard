import React, { useState } from "react";
import { Search, Trash2 } from "lucide-react";

const categories = ["All", "Food", "Drinks"];

const suggestedCoupons = [
  { code: "SAVE10", label: "10% OFF" },
  { code: "FLAT50", label: "₹50 OFF" },
  { code: "WELCOME20", label: "20% OFF" },
];

const products = [
  {
    id: 1,
    name: "Burger",
    category: "Food",
    variants: [
      { name: "Regular", price: 120 },
      { name: "Cheese", price: 150 },
    ],
  },
  {
    id: 2,
    name: "Pizza",
    category: "Food",
    variants: [
      { name: "8 inch", price: 250 },
      { name: "12 inch", price: 350 },
    ],
  },
  {
    id: 3,
    name: "Coffee",
    category: "Drinks",
    variants: [
      { name: "Small", price: 80 },
      { name: "Large", price: 120 },
    ],
  },
  { id: 4, name: "Tea", category: "Drinks", price: 40 },
  { id: 5, name: "Sandwich", category: "Food", price: 90 },
  { id: 6, name: "French Fries", category: "Food", price: 100 },
  { id: 7, name: "Coke", category: "Drinks", price: 60 },
  { id: 8, name: "Cold Coffee", category: "Drinks", price: 140 },
  { id: 9, name: "Veg Roll", category: "Food", price: 110 },
  { id: 10, name: "Pasta", category: "Food", price: 180 },
];

export default function POSComponent() {

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});

  const [showCheckout, setShowCheckout] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [discount, setDiscount] = useState(0);

  const addToCart = (product) => {

    let variantName = "";
    let price = product.price;

    if (product.variants) {
      const selected = selectedVariants[product.id] || product.variants[0];
      variantName = selected.name;
      price = selected.price;
    }

    const exist = cart.find(
      (i) => i.id === product.id && i.variant === variantName
    );

    if (exist) {
      setCart(
        cart.map((item) =>
          item.id === product.id && item.variant === variantName
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          variant: variantName,
          price,
          qty: 1,
        },
      ]);
    }
  };

  const updateQty = (id, variant, type) => {

    const updated = cart
      .map((item) => {

        if (item.id === id && item.variant === variant) {
          const qty = type === "inc" ? item.qty + 1 : item.qty - 1;
          return { ...item, qty };
        }

        return item;

      })
      .filter((i) => i.qty > 0);

    setCart(updated);

  };

  const removeItem = (id, variant) => {
    setCart(cart.filter((i) => !(i.id === id && i.variant === variant)));
  };

  const total = cart.reduce((sum, i) => sum + i.qty * i.price, 0);
  const finalTotal = total - discount;

  const applyCoupon = () => {

    if (couponCode === "SAVE10") setDiscount(total * 0.1);
    else if (couponCode === "FLAT50") setDiscount(50);
    else if (couponCode === "WELCOME20") setDiscount(total * 0.2);
    else {
      alert("Invalid Coupon");
      setDiscount(0);
    }

  };

  const filteredProducts = products.filter(
    (p) =>
      (selectedCategory === "All" || p.category === selectedCategory) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">

      {/* Header */}

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Point of Sale (POS)</h1>
        <p className="text-gray-600 text-sm md:text-base">
          Manage orders, add products to cart, and generate bills quickly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Catalog */}

        <div className="md:col-span-2 bg-white rounded-xl shadow p-4">

          <h2 className="font-bold mb-3">Catalog</h2>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-3 py-2 rounded-lg mb-2 ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}

        </div>

        {/* Products */}

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

            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow p-4 flex flex-col"
              >

                <div className="h-24 bg-gray-100 rounded mb-3 flex items-center justify-center">
                  Image
                </div>

                <h3 className="font-semibold">{product.name}</h3>

                {product.variants && (
                  <select
                    className="border rounded mt-2 p-1 text-sm"
                    onChange={(e) => {
                      const variant = product.variants.find(
                        (v) => v.name === e.target.value
                      );
                      setSelectedVariants({
                        ...selectedVariants,
                        [product.id]: variant,
                      });
                    }}
                  >
                    {product.variants.map((v) => (
                      <option key={v.name}>
                        {v.name} - ₹{v.price}
                      </option>
                    ))}
                  </select>
                )}

                <p className="font-bold text-blue-600 mt-2">
                  ₹
                  {product.variants
                    ? (selectedVariants[product.id] ||
                        product.variants[0]).price
                    : product.price}
                </p>

                <button
                  onClick={() => addToCart(product)}
                  className="w-full mt-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                >
                  Add
                </button>

              </div>
            ))}

          </div>

        </div>

        {/* Cart */}

        <div className="md:col-span-3 bg-white rounded-xl shadow p-4">

          <h2 className="font-bold border-b pb-3">Cart</h2>

          <div className="space-y-3 mt-3 max-h-[350px] overflow-auto">

            {cart.map((item) => (
              <div
                key={`${item.id}-${item.variant}`}
                className="flex justify-between items-center border-b pb-2"
              >

                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.variant} • ₹{item.price}
                  </p>
                </div>

                <div className="flex items-center gap-2"
                style={{display:"flex",flexDirection:"column-reverse",justifyContent:"center",alignItems:"flex-end"}}
                >
                    <div style={{display:"flex",gap:7}}>

                  <button
                    onClick={() => updateQty(item.id, item.variant, "dec")}
                    className="w-7 h-7 bg-gray-200 rounded"
                  >
                    -
                  </button>

                  <span>{item.qty}</span>

                  <button
                    onClick={() => updateQty(item.id, item.variant, "inc")}
                    className="w-7 h-7 bg-gray-200 rounded"
                  >
                    +
                  </button>
                  </div>

                  <Trash2
                    onClick={() => removeItem(item.id, item.variant)}
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

      {/* Checkout Popup */}

      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">

            <h2 className="text-xl font-bold mb-4">Checkout</h2>

            <input
              type="tel"
              placeholder="Customer Phone"
              className="w-full border rounded-lg p-2 mb-3"
            />

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

            <div className="flex flex-wrap gap-2 mb-4">
              {suggestedCoupons.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setCouponCode(c.code)}
                  className="px-3 py-1 bg-gray-100 rounded-lg text-sm"
                >
                  {c.code}
                </button>
              ))}
            </div>

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

            <div className="flex gap-4 mt-4">

              <button
                onClick={() => setPaymentMethod("cash")}
                className={`px-4 py-2 border rounded ${
                  paymentMethod === "cash" && "bg-blue-600 text-white"
                }`}
              >
                Cash
              </button>

              <button
                onClick={() => setPaymentMethod("online")}
                className={`px-4 py-2 border rounded ${
                  paymentMethod === "online" && "bg-blue-600 text-white"
                }`}
              >
                Online
              </button>

            </div>

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