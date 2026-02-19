import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

export default function CampaignComponent() {

  /* ================= TEMPLATES ================= */

  const templates = [
    {
      name: "order_confirmation",
      body:
        "Hello {{1}},\nYour order {{2}} is confirmed.\nAmount: ₹{{3}}",
      fields: ["Customer Name", "Order ID", "Amount"]
    },
    {
      name: "special_offer",
      body:
        "Hi {{1}},\nGet {{2}}% OFF.\nValid till {{3}}",
      fields: ["Customer Name", "Discount %", "Valid Till"]
    }
  ];

  /* ================= STATES ================= */

  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [formValues, setFormValues] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");

  /* ================= LOAD USERS ================= */

  useEffect(() => {
    setUsers([
      { id: 1, name: "Ramesh", phone: "919876543210" },
      { id: 2, name: "Suresh", phone: "919812345678" },
      { id: 3, name: "Mahesh", phone: "919800112233" },
      { id: 4, name: "Naresh", phone: "919822334455" }
    ]);
  }, []);

  /* ================= HELPERS ================= */

  const handleValueChange = (k, v) => {
    setFormValues(p => ({ ...p, [k]: v }));
  };

  const toggleUser = (phone) => {
    setSelectedUsers(prev =>
      prev.includes(phone)
        ? prev.filter(p => p !== phone)
        : [...prev, phone]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(u => u.phone));
    }
  };

  const generatePreview = () => {
    let msg = selectedTemplate.body;
    selectedTemplate.fields.forEach((f, i) => {
      msg = msg.replace(`{{${i + 1}}}`, formValues[f] || "");
    });
    return msg;
  };

  const sendCampaign = () => {
    if (!selectedUsers.length)
      return alert("Select users");
    alert("WhatsApp sent successfully!");
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search)
  );

  /* ================= UI ================= */

  return (
    <div className="space-y-6">

      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-bold">WhatsApp Campaign</h1>
        <p className="text-gray-600">Send WhatsApp messages to customers</p>
      </div>

      {/* MESSAGE SETUP */}
      <div className="bg-white p-6 rounded-xl border">

        <div className="grid grid-cols-2 gap-6">

          {/* FORM */}
          <div>
            <h3 className="font-semibold mb-4">Message Setup</h3>

            <label>Template</label>
            <select
              className="w-full mt-1 mb-4 p-2 border rounded-lg"
              onChange={(e) =>
                setSelectedTemplate(
                  templates.find(t => t.name === e.target.value)
                )
              }
            >
              {templates.map(t => (
                <option key={t.name}>{t.name}</option>
              ))}
            </select>

            {selectedTemplate.fields.map(f => (
              <div key={f} className="mb-3">
                <label>{f}</label>
                <input
                  className="w-full mt-1 p-2 border rounded-lg"
                  onChange={e => handleValueChange(f, e.target.value)}
                />
              </div>
            ))}

          </div>

          {/* PHONE PREVIEW */}
          <div className="flex justify-center">

            <div className="w-[280px] h-[520px] border-[6px] border-black rounded-[30px] bg-[#ece5dd] flex flex-col">

              <div className="bg-[#075e54] text-white text-center py-2" style={{borderTopLeftRadius:20,borderTopRightRadius:20}}>
                WhatsApp Preview
              </div>

              <div className="flex-1 p-4">
                <div className="bg-[#dcf8c6] p-3 rounded-lg whitespace-pre-wrap">
                  {generatePreview()}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* SELECT USERS HEADER */}
      <div className="bg-white p-4 rounded-xl border flex justify-between items-center">

        <h3 className="font-semibold">Select Users</h3>

        <div className="flex items-center gap-4">

          <label className="flex items-center gap-2">
            <input type="checkbox" onChange={toggleSelectAll} />
            Select All
          </label>

          <button
            onClick={sendCampaign}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl flex items-center"
          >
            Send WhatsApp
          </button>

        </div>

      </div>

      {/* SEARCH USERS */}
      <div className="bg-white p-4 rounded-xl border">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

      </div>

      {/* USERS TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden">

        <table className="min-w-full divide-y">

          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3">Select</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Phone</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">

                <td className="px-6 py-4" style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(u.phone)}
                    onChange={() => toggleUser(u.phone)}
                  />
                </td>

                <td className="px-6 py-4" style={{textAlign:"center"}}>{u.name}</td>
                <td className="px-6 py-4" style={{textAlign:"center"}}>{u.phone}</td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}
