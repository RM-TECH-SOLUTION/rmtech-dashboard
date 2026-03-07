import React, { useEffect, useState } from "react";
import { Search, Smile, ChevronLeft, ChevronRight } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

export default function CampaignComponent() {

  /* ---------------- STATES ---------------- */

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const [buyUrl, setBuyUrl] = useState("");

  const [message, setMessage] = useState(
`The firsts are always special, like your first salary 💰, your first car 🚗 & your first date 😘

Do you know what's special for us? YOUR FIRST ORDER 😍

We want to make it special for you too – Get a FLAT DISCOUNT of {{2}} on your first order worth {{3}} or more, along with FREE DELIVERY 🚚

Just use code: {{4}} 🎉

🛒 Buy Now
{{BUY_URL}}`
  );

  const [page, setPage] = useState(0);
  const pageSize = 8;

  /* ---------------- FETCH USERS ---------------- */

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://api.rmtechsolution.com/getUsers.php?merchant_id=${token}`
      );

      const json = await res.json();

      if (json.success) {
        setUsers(json.users || []);
      } else {
        setUsers([]);
      }

    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FILTER ---------------- */

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search)
  );

  const start = page * pageSize;
  const paginatedUsers = filteredUsers.slice(start, start + pageSize);

  /* ---------------- EMOJI ---------------- */

  const onEmojiClick = (emojiData) => {
    setMessage(prev => prev + emojiData.emoji);
  };

  /* ---------------- BUILD MESSAGE ---------------- */

  const buildMessage = () => {
    return message
      .replace("{{2}}", "30%")
      .replace("{{3}}", "₹499")
      .replace("{{4}}", "FIRST30")
      .replace("{{BUY_URL}}", buyUrl);
  };

  /* ---------------- SEND WHATSAPP ---------------- */

  const sendWhatsapp = () => {

    if (!selectedUser) {
      alert("Please select a user first");
      return;
    }

    if (!buyUrl) {
      alert("Please enter Buy Now URL");
      return;
    }

    const finalMessage = buildMessage();
    const encodedMsg = encodeURIComponent(finalMessage);

    const url = `https://api.whatsapp.com/send?phone=${selectedUser.phone}&text=${encodedMsg}`;
    window.open(url, "_blank");
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Campaign</h1>
        <p className="text-gray-600 text-sm sm:text-base"> Manage and send promotional messages to your registered customers</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[600px]">

        {/* LEFT PANEL */}
        <div className="bg-white rounded-xl shadow flex flex-col">

          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">WhatsApp Contacts</h2>
          </div>

          <div className="p-4 border-b">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                placeholder="Search contact..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">

            {loading && (
              <div className="p-4 text-center text-gray-500">
                Loading users...
              </div>
            )}

            {!loading && paginatedUsers.length === 0 && (
              <div className="p-4 text-center text-gray-400">
                No users found
              </div>
            )}

            {!loading && paginatedUsers.map(u => (
              <div
                key={u.id}
                onClick={() => setSelectedUser(u)}
                className={`p-4 cursor-pointer border-b
                  ${selectedUser?.id === u.id
                    ? "bg-green-100"
                    : "hover:bg-green-50"}`}
              >
                <div className="font-semibold">{u.name}</div>
                <div className="text-sm text-gray-500">{u.phone}</div>
              </div>
            ))}

          </div>

          <div className="p-3 border-t flex justify-between items-center">

            <button
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              className="p-2 rounded hover:bg-gray-200 disabled:opacity-40"
            >
              <ChevronLeft />
            </button>

            <span className="text-sm">
              Page {page + 1} of {Math.max(1, Math.ceil(filteredUsers.length / pageSize))}
            </span>

            <button
              disabled={(page + 1) * pageSize >= filteredUsers.length}
              onClick={() => setPage(p => p + 1)}
              className="p-2 rounded hover:bg-gray-200 disabled:opacity-40"
            >
              <ChevronRight />
            </button>

          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-white rounded-xl shadow flex flex-col">

          <div className="p-4 border-b">
            <h3 className="font-semibold text-lg">Message Composer</h3>
          </div>

          <div className="p-4 border-b">
            <label className="block text-sm font-medium mb-1">
              Buy Now URL
            </label>
            <input
              type="text"
              value={buyUrl}
              onChange={(e) => setBuyUrl(e.target.value)}
              placeholder="https://yourwebsite.com/product"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div className="relative p-4 flex-1">

            {showEmoji && (
              <div className="absolute bottom-16 right-4 z-50">
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}

            <textarea
              className="w-full h-full border rounded-lg p-4 resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

          </div>

          <div className="p-3 border-t flex items-center gap-3">

            <button
              onClick={() => setShowEmoji(!showEmoji)}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <Smile />
            </button>

            <span className="text-sm text-gray-500">
              Selected: {selectedUser?.name || "None"}
            </span>

          </div>

          <div className="p-4">
            <button
              onClick={sendWhatsapp}
              className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Send WhatsApp
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}