import React, { useEffect ,useState } from "react";
import { Search, Smile, ChevronLeft, ChevronRight } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

export default function CampaignComponent() {

  /* ---------------- STATES ---------------- */

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [message, setMessage] = useState(
  );

  // Pagination
  const [page, setPage] = useState(0);
  const pageSize = 8;

  /* ---------------- LOAD USERS ---------------- */

  useEffect(() => {
    setUsers([
      { id: 1, name: "Ram", phone: "918981937900" },
      { id: 2, name: "Suresh", phone: "919812345678" },
      { id: 3, name: "Mahesh", phone: "919800112233" },
      { id: 4, name: "Naresh", phone: "919822334455" },
      { id: 5, name: "Ravi", phone: "919811122233" },
      { id: 6, name: "Kiran", phone: "919833344455" },
      { id: 7, name: "Vijay", phone: "919844455566" },
      { id: 8, name: "Anil", phone: "919855566677" },
      { id: 9, name: "Manoj", phone: "919866677788" },
      { id: 10, name: "Sanjay", phone: "919877788899" }
    ]);
  }, []);

  /* ---------------- FILTER ---------------- */

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search)
  );

  const start = page * pageSize;
  const paginatedUsers = filteredUsers.slice(start, start + pageSize);

  /* ---------------- EMOJI ---------------- */

  const onEmojiClick = (emojiData) => {
    setMessage(prev => prev + emojiData.emoji);
  };

  /* ---------------- BUILD MESSAGE ---------------- */

  const buildMessage = () => {
    if (!selectedUser) return message;

    return message
      .replace("{{1}}", selectedUser.name)
      .replace("{{2}}", "BIG DISCOUNTS")
      .replace("{{3}}", "50% OFF");
  };

  /* ---------------- SEND WHATSAPP ---------------- */

  const sendWhatsapp = () => {

    if (!selectedUser) {
      alert("Please select a user first");
      return;
    }

    const finalMessage = buildMessage();

    // ✅ ONLY THIS — NO DOUBLE ENCODE
    const encodedMsg = encodeURIComponent(finalMessage);

    const url = `https://api.whatsapp.com/send?phone=${selectedUser.phone}&text=${encodedMsg}`;

    window.open(url, "_blank");
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">WhatsApp Campaign</h1>
        <p className="text-gray-600">Send WhatsApp messages to customers</p>
      </div>
    <div className="h-screen p-6 bg-gray-100 overflow-hidden">
             

      <div className="grid grid-cols-2 gap-6 h-full">

        {/* ============ LEFT PANEL ============ */}

        <div className="bg-white rounded-xl shadow flex flex-col">

          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">WhatsApp Contacts</h2>
          </div>

          {/* SEARCH */}
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

          {/* USERS */}
          <div className="flex-1 overflow-y-auto">

            {paginatedUsers.map(u => (
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

          {/* PAGINATION */}
          <div className="p-3 border-t flex justify-between items-center">

            <button
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              className="p-2 rounded hover:bg-gray-200 disabled:opacity-40"
            >
              <ChevronLeft />
            </button>

            <span className="text-sm">
              Page {page + 1} of {Math.ceil(filteredUsers.length / pageSize)}
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

        {/* ============ RIGHT PANEL ============ */}

        <div className="bg-white rounded-xl shadow flex flex-col">

          <div className="p-4 border-b">
            <h3 className="font-semibold text-lg">Message Composer</h3>
          </div>

          {/* TEXTAREA */}
          <div className="relative p-4" style={{ height: "50%" }}>

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

          {/* TOOLBAR */}
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

          {/* SEND */}
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
    </div>
  );
}