import React, { useState, useEffect, useRef } from "react";
import { Search, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getLoyaltySettings,
  fetchCMSData
} from "../redux/actions/cmsActions";



export default function POSComponent() {

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const merchantData = user.merchantData;
  const loyaltySettings = useSelector((state) => state.cms.loyaltySettings || []);
  const cmsData = useSelector((state) => state.cms.data || []);
  const [coupons, setCoupons] = useState([]);
  const barcodeRef = React.useRef();
  const scanLock = useRef(false);
  const scanTimeout = useRef(null);
  const [allProducts, setAllProducts] = useState([]);
  const lastScannedRef = useRef("");

  const billLogoConfig = cmsData.find(
    (item) => item.modelSlug === "billLogo"
  );
  const logo = billLogoConfig?.cms?.logo?.fieldValue;
  const merchantName = billLogoConfig?.cms?.merchantName?.fieldValue;

  console.log("Logo:hhh", logo);
  console.log("Merchant Name:hhh", merchantName);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [cart, setCart] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});

  const [showCheckout, setShowCheckout] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [discount, setDiscount] = useState(0);
  const [lastOrder, setLastOrder] = useState(null);
  const [barcodeInput, setBarcodeInput] = useState("");

  console.log(allProducts, "selectedVariantsselectedVariants");


  /* ================= FETCH CATALOG ================= */

  useEffect(() => {
    dispatch(fetchCMSData(token));
    fetchCatalogModels();
    fetchCoupons();
    dispatch(getLoyaltySettings(token))
    fetchAllItems()

  }, []);

  const fetchCoupons = async () => {
    try {

      const res = await fetch(
        `https://api.rmtechsolution.com/get_coupons?merchantId=${token}`
      );

      const data = await res.json();

      if (data.success) {
        setCoupons(data.data || []);
      }

    } catch (err) {
      console.log("Coupon fetch error", err);
    }
  };
  const fetchAllItems = async () => {
    try {
      const res = await fetch(
        `https://api.rmtechsolution.com/getAllCatalogueItems?merchantId=${token}`
      );

      const data = await res.json();

      setAllProducts(data?.data || []);
    } catch (err) {
      console.log("All items error", err);
    }
  };

  const fetchCatalogModels = async () => {

    try {

      const res = await fetch(
        `https://api.rmtechsolution.com/getCatalogueModels?merchantId=${token}`
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
        `https://api.rmtechsolution.com/getCatalogueItems?catalogueModelId=${catalogId}&merchantId=${token}`
      );

      const data = await res.json();

      setProducts(data?.data || []);

    } catch (err) {
      console.log("Items error", err);
    }

  };

  /* ================= ADD TO CART ================= */

const addToCart = (product, variantFromScan = null) => {

  const selected =
    variantFromScan ||
    selectedVariants[product.id] ||
    product.variants?.[0];

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

  const spendAmount = Number(loyaltySettings?.spend_amount || 0);
  const rewardPoints = Number(loyaltySettings?.reward_points || 0);

  let earnedPoints = 0;

  if (spendAmount > 0) {
    earnedPoints = Math.floor((finalTotal / spendAmount) * rewardPoints);
  }

  console.log(earnedPoints, "earnedPointsjjjj", loyaltySettings);

  /* ================= COUPON ================= */

  const applyCoupon = () => {

    const coupon = coupons.find(
      (c) => c.code.toLowerCase() === couponCode.toLowerCase()
    );

    if (!coupon) {
      alert("Invalid Coupon");
      setDiscount(0);
      return;
    }

    if (Number(total) < Number(coupon.minOrder)) {
      alert(`Minimum order ₹${coupon.minOrder} required`);
      return;
    }

    let discountAmount = 0;

    if (coupon.type === "percentage") {
      discountAmount = (total * Number(coupon.value)) / 100;
    }

    if (coupon.type === "flat") {
      discountAmount = Number(coupon.value);
    }

    setDiscount(discountAmount);

  };

  const createOrder = async () => {

  try {

    console.log(cart, "cartcartcart")

    const items = cart.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      variant_name: item.variant,
      variantId: item.variantId || "default",
      price: item.price,
      quantity: item.qty,
      total: item.qty * item.price
    }));

    const payload = {
      merchant_id: merchantData?.merchant_id,
      user_id: 0,
      phone: customerPhone || "POS",
      items,
      amount: Number(finalTotal),
      orderType: `offline[${paymentMethod}]`,
      couponDiscount: discount || 0,
      pointsDiscount: 0,
      earnedPoints: earnedPoints || 0,
      address: JSON.stringify({
        source: "POS",
        counter: "Dashboard POS"
      })
    };

    console.log("POS PAYLOAD:", payload);

    const res = await fetch(
      "https://api.rmtechsolution.com/create_pos_order.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const text = await res.text();
    console.log("RAW RESPONSE:", text);

    const data = JSON.parse(text);
    console.log("PARSED RESPONSE:", data);

    if (!data.success) {
      alert("Order failed");
      return;
    }

    // ✅ Save order for printing
    const orderData = {
      items,
      total,
      discount,
      finalTotal,
      paymentMethod,
      merchantName: merchantName || "RM Tech Store",
      logo: logo || ""
    };

    console.log(orderData,"orderDatahghggjkhiu");
    
    setLastOrder(orderData);

    setCart([]);
    setShowCheckout(false);

    // 🔥 NEW: Thermal Print
    setTimeout(async () => {
      try {
        const billText = `
${orderData.merchantName}
------------------------

${orderData.items.map(i =>
  `${i.item_name} x${i.quantity}  ₹${i.price}`
).join("\n")}

------------------------
Subtotal: ₹${orderData.total}
Discount: ₹${orderData.discount}
TOTAL: ₹${orderData.finalTotal}

Payment: ${orderData.paymentMethod}

Thank you!
`;

await fetch("http://localhost:5000/print", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(orderData),
});
      } catch (err) {
        console.error("Print error:", err);
      }

      fetchCatalogModels();
    }, 300);

  } catch (err) {
    console.error("POS ERROR:", err);
    alert("POS Order Error");
  }

};

  const handleCheckout = () => {

    if (cart.length === 0) {
      alert("Cart empty");
      return;
    }

    createOrder();

  };

  useEffect(() => {
    const handleClick = (e) => {
      // ❌ don't focus if clicking input/select/button
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "SELECT" ||
        e.target.tagName === "BUTTON" ||
        e.target.closest("input, select, button")
      ) {
        return;
      }

      barcodeRef.current?.focus();
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

const handleBarcodeScan = (code) => {
  if (!code) return;

  if (lastScannedRef.current === code) return;

  lastScannedRef.current = code;

  setTimeout(() => {
    lastScannedRef.current = "";
  }, 500);

  let foundProduct = null;
  let foundVariant = null;

  for (const product of allProducts) {
    if (product.barcode === code) {
      foundProduct = product;
      break;
    }

    const variant = product.variants?.find(
      (v) => v.barcode === code
    );

    if (variant) {
      foundProduct = product;
      foundVariant = variant;
      break;
    }
  }

  if (!foundProduct) {
    alert("Product not found");
    return;
  }

  // STOCK CHECK
  if (foundVariant) {
    if (Number(foundVariant.stock || 0) <= 0) {
      alert("Variant out of stock");
      return;
    }
  } else {
    if (Number(foundProduct.stock || 0) <= 0) {
      alert("Product out of stock");
      return;
    }
  }

  // CATEGORY SWITCH
  const category = categories.find(
    (c) => c.id === foundProduct.catalogue_model_id
  );

  if (category) {
    setSelectedCategory(category);
    loadItems(category.id);
  }

  // SET SELECTED VARIANT
  if (foundVariant) {
    setSelectedVariants((prev) => ({
      ...prev,
      [foundProduct.id]: foundVariant,
    }));
  }

  // 🔥 IMPORTANT FIX
  addToCart(foundProduct, foundVariant);

  playBeep();
};

  const playBeep = () => {
    const audio = new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg");
    audio.play();
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
              className={`w-full text-left px-3 py-2 rounded-lg mb-2 ${selectedCategory?.id === cat.id
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
              const stock =
                product.variants?.length > 0
                  ? selected?.stock ?? 0
                  : product.stock ?? 0;

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
                  <p className="text-sm text-gray-500">
                    Stock: {stock}
                  </p>

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
                    disabled={stock <= 0}
                    className={`w-full mt-3 py-2 rounded-xl text-white ${stock <= 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600"
                      }`}
                  >
                    {stock <= 0 ? "Out of Stock" : "Add"}
                  </button>

                </div>

              );

            })}

          </div>

        </div>

        {/* CART */}


        <div className="md:col-span-3 bg-white rounded-xl shadow p-4">
          <div className="mb-4">
            <input
              ref={barcodeRef}
              autoFocus
              value={barcodeInput}
              onChange={(e) => {
                setBarcodeInput(e.target.value);
              }}

              onKeyDown={(e) => {
                if (e.key === "Enter") {

                  if (scanLock.current) return; // 🚫 block duplicate

                  scanLock.current = true;

                  const code = barcodeInput.trim();

                  if (code) {
                    handleBarcodeScan(code);
                  }

                  setBarcodeInput("");

                  setTimeout(() => {
                    scanLock.current = false; // ✅ unlock after delay
                    barcodeRef.current?.focus();
                  }, 300);
                }
              }}
              placeholder="Scan barcode..."
              className="w-full border p-3 rounded-lg text-lg"
            />
          </div>

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
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
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

              {coupons.map((c) => (

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
                className={`px-4 py-2 border rounded ${paymentMethod === "cash" ? "bg-blue-600 text-white" : ""
                  }`}
              >
                Cash
              </button>

              <button
                onClick={() => setPaymentMethod("online")}
                className={`px-4 py-2 border rounded ${paymentMethod === "online" ? "bg-blue-600 text-white" : ""
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

              <button
                onClick={handleCheckout}
                className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg"
              >
                Print Bill
              </button>

            </div>

          </div>

        </div>
      )}
      {/* PRINT BILL */}

      <div id="print-bill" className="hidden print:block p-4 text-sm">

        <div className="text-center mb-2">

          {logo && (
            <img
              src={logo}
              alt="Merchant Logo"
              className="mx-auto h-14 object-contain mb-1"
            />
          )}

          <h2 className="font-bold text-lg">
            {merchantName || "RM Tech Store"}
          </h2>

          <p>POS Receipt</p>

        </div>

        <hr className="my-2" />

        {lastOrder?.items?.map((item, index) => (

          <div key={index} className="flex justify-between mb-1">

            <div>
              <div>{item.item_name}</div>

              {item.variant_name && (
                <div className="text-xs text-gray-500">
                  {item.variant_name}
                </div>
              )}

            </div>

            <div>
              {item.quantity} × ₹{item.price}
            </div>

          </div>

        ))}

        <hr className="my-2" />

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{lastOrder?.total}</span>
        </div>

        {lastOrder?.discount > 0 && (
          <div className="flex justify-between">
            <span>Discount</span>
            <span>-₹{lastOrder?.discount}</span>
          </div>
        )}

        <div className="flex justify-between font-bold mt-2">
          <span>Total</span>
          <span>₹{lastOrder?.finalTotal}</span>
        </div>

        <hr className="my-2" />

        <div className="text-center">
          Payment : {lastOrder?.paymentMethod}
        </div>

        <div className="text-center mt-2">
          Thank You Visit Again
        </div>

      </div>
    </div>
  );
}