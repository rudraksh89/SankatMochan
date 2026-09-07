import { useState } from "react";
import { Phone, UserPlus, Star, Trash2, Edit3, Shield, Mail, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const EmergencyContacts = ({ emergencyContacts = [], setEmergencyContacts }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    contactName: "",
    relationship: "",
    phone: "",
    email: "",
    address: "",
    isPrimary: false,
  });

  const openAddModal = () => {
    setEditingContact(null);
    setFormData({
      contactName: "",
      relationship: "",
      phone: "",
      email: "",
      address: "",
      isPrimary: emergencyContacts.length === 0,
    });
    setShowModal(true);
  };

  const openEditModal = (contact) => {
    setEditingContact(contact);
    setFormData({
      contactName: contact.contactName || "",
      relationship: contact.relationship || "",
      phone: contact.phone || "",
      email: contact.email || "",
      address: contact.address || "",
      isPrimary: !!contact.isPrimary,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.contactName || !formData.phone || !formData.relationship) {
      toast.error("Contact Name, Relationship, and Phone are required!");
      return;
    }

    try {
      setLoading(true);
      if (editingContact) {
        const res = await api.put(`/emergency/${editingContact._id}`, formData);
        setEmergencyContacts(res.data.contacts || []);
        toast.success("Emergency contact updated!");
      } else {
        const res = await api.post("/emergency", formData);
        setEmergencyContacts(res.data.contacts || []);
        toast.success("New emergency contact added!");
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save contact");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (contactId) => {
    if (!window.confirm("Are you sure you want to remove this emergency contact?")) return;
    try {
      setLoading(true);
      const res = await api.delete(`/emergency/${contactId}`);
      setEmergencyContacts(res.data.contacts || []);
      toast.success("Contact removed.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete contact.");
    } finally {
      setLoading(false);
    }
  };

  const setAsPrimary = async (contact) => {
    try {
      setLoading(true);
      const res = await api.put(`/emergency/${contact._id}`, { ...contact, isPrimary: true });
      setEmergencyContacts(res.data.contacts || []);
      toast.success(`${contact.contactName} is now Primary ICE Contact.`);
    } catch {
      toast.error("Failed to set primary contact.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <Shield size={26} />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Emergency Contacts (ICE)</h2>
            <p className="text-xs text-slate-400">
              Add at least 2 trusted contacts (Primary & Secondary) for instant first-responder calling.
            </p>
          </div>
        </div>

        <button
          onClick={openAddModal}
          disabled={emergencyContacts.length >= 5}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-lg shadow-red-600/20 transition-all disabled:opacity-50"
        >
          <UserPlus size={18} />
          Add Contact
        </button>
      </div>

      {/* Warning Notice if < 2 contacts */}
      {emergencyContacts.length < 2 && (
        <div className="mt-6 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-4 py-3 rounded-2xl text-xs flex items-center gap-3">
          <Shield className="shrink-0 text-amber-400" size={20} />
          <span>
            <strong>Safety Recommendation:</strong> Please add <strong>at least 2 emergency contacts</strong> (e.g. Spouse/Parent as Primary, Sibling/Doctor as Secondary) so responders have a fallback if one is unreachable.
          </span>
        </div>
      )}

      {/* Contact Cards Grid */}
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {emergencyContacts.map((contact, idx) => (
          <div
            key={contact._id || idx}
            className={`relative group rounded-2xl p-5 border transition-all duration-200 ${
              contact.isPrimary
                ? "bg-slate-800/90 border-red-500/50 shadow-lg shadow-red-500/5"
                : "bg-slate-800/40 border-slate-700/60 hover:border-slate-600"
            }`}
          >
            {/* Top Bar Badges */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 ${
                  contact.isPrimary
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-slate-700 text-slate-300"
                }`}
              >
                {contact.isPrimary && <Star size={11} className="fill-current text-red-400" />}
                {contact.isPrimary ? "Primary ICE Contact" : `Secondary Contact #${idx + 1}`}
              </span>

              <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition">
                {!contact.isPrimary && (
                  <button
                    onClick={() => setAsPrimary(contact)}
                    title="Make Primary ICE Contact"
                    className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-amber-400 rounded-lg transition"
                  >
                    <Star size={16} />
                  </button>
                )}
                <button
                  onClick={() => openEditModal(contact)}
                  title="Edit Contact"
                  className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-blue-400 rounded-lg transition"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(contact._id)}
                  title="Delete Contact"
                  className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-red-400 rounded-lg transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Name & Relation */}
            <h3 className="text-lg font-bold text-white">{contact.contactName}</h3>
            <p className="text-xs font-medium text-slate-400 mb-3">{contact.relationship}</p>

            {/* Details */}
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-emerald-400 shrink-0" />
                <a
                  href={`tel:${contact.phone}`}
                  className="font-mono font-semibold text-emerald-400 hover:underline"
                >
                  {contact.phone}
                </a>
              </div>
              {contact.email && (
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail size={14} className="shrink-0" />
                  <span className="truncate">{contact.email}</span>
                </div>
              )}
              {contact.address && (
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin size={14} className="shrink-0" />
                  <span className="truncate">{contact.address}</span>
                </div>
              )}
            </div>

            {/* Quick Call Button */}
            <a
              href={`tel:${contact.phone}`}
              className="mt-4 w-full bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 font-semibold py-2 px-3 rounded-xl transition flex items-center justify-center gap-2 text-xs"
            >
              <Phone size={14} />
              Call {contact.contactName}
            </a>
          </div>
        ))}

        {emergencyContacts.length === 0 && (
          <div className="col-span-full bg-slate-800/30 border border-dashed border-slate-700 rounded-2xl p-8 text-center text-slate-400">
            <Shield size={36} className="mx-auto text-slate-600 mb-2" />
            <p className="font-semibold text-sm">No Emergency Contacts Registered Yet</p>
            <p className="text-xs mt-1 text-slate-500">
              Add at least 2 emergency contacts so responders can notify your family instantly.
            </p>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-white">
            <h3 className="text-xl font-bold mb-4">
              {editingContact ? "Edit Emergency Contact" : "Add Emergency Contact"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Contact Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Relationship *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Spouse, Father, Sister, Family Doctor"
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Phone Number (ICE) *
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +91 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="e.g. contact@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Address (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. New Delhi, India"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPrimaryCheck"
                  checked={formData.isPrimary}
                  onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
                  className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-red-600 focus:ring-red-500"
                />
                <label htmlFor="isPrimaryCheck" className="text-xs font-medium text-slate-300">
                  Set as Primary ICE Contact
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-600/20 transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Contact"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyContacts;