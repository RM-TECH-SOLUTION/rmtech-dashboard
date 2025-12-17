import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, Eye, EyeOff, Hash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { merchantLogin } from "../redux/actions/cmsActions";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --------------------
  // LOCAL STATE
  // --------------------
  const [merchantId, setMerchantId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  // --------------------
  // REDUX STATE
  // --------------------
  const { loading, error, loginMerchantData } = useSelector(
    (state) => state.cms
  );

  // --------------------
  // SUBMIT
  // --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    try {
      const response = await dispatch(
        merchantLogin({
          merchantId,
          email,
          password,
        })
      );

      console.log(response,"responsejjjkjkjk");
      
      if (response?.success) {
      const { merchant: user } = response;
      console.log(user,"useruseruser");
      
      localStorage.setItem('token', user.merchant_id);
      localStorage.setItem('user', JSON.stringify({
        name: user.name,
        email: user.email,
        role: user.merchant_id == 0 ? "admin" : "merchant"
      }));

        navigate("/dashboard");
      } else {
        setLocalError(response?.message || "Login failed");
      }
    } catch (err) {
      setLocalError(err.message || "Merchant not found");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="max-w-md w-full">
        {/* LOGO */}
        <div className="text-center mb-8 flex flex-col items-center">
          <img
            src={require("../assets/logo4.png")}
            alt="RM Tech Solution"
            style={{ height: "90px", width: "200px", objectFit: "cover" }}
          />
          <h2 className="text-gray-600 mt-2 font-bold text-lg">
            Content Management System
          </h2>
        </div>

        {/* LOGIN CARD */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-1">
            Merchant Login
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Sign in to your merchant account
          </p>

          {/* ERROR MESSAGE */}
          {(error || localError) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error || localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* MERCHANT ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Merchant ID
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={merchantId}
                  onChange={(e) => setMerchantId(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter Merchant ID"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter Email"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              {loading ? "Signing in..." : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} RM Tech Solution
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
