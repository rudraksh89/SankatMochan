import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";
import {
  QrCode,
  ShieldCheck,
  UserCheck,
  UserX,
  RefreshCw,
  Trash2,
  Search,
  Smartphone,
  Laptop,
  Clock,
  Globe,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Radio,
  Volume2,
  VolumeX,
} from "lucide-react";
import toast from "react-hot-toast";

const getSocketURL = () => {
  const apiUrl = api.defaults.baseURL || "http://localhost:5000/api";
  return apiUrl.replace(/\/api\/?$/, "");
};

const playChime = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
    osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.3); // G5
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
  } catch (e) {
    console.warn("Audio playback notice:", e);
  }
};

const QRHistoryPage = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    totalScans: 0,
    responderScans: 0,
    citizenScans: 0,
    anonymousScans: 0,
    lastScannedAt: null,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterRole, setFilterRole] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [liveScanNotice, setLiveScanNotice] = useState(null);
  const soundRef = useRef(soundEnabled);

  useEffect(() => {
    soundRef.current = soundEnabled;
  }, [soundEnabled]);

  const fetchHistory = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      const res = await api.get("/qr/history");
      if (res.data.success) {
        setHistory(res.data.history || []);
        setStats(res.data.stats || {});
      }
    } catch (err) {
      console.error("Failed to load QR scan history:", err);
      toast.error(err.response?.data?.message || "Failed to load scan history");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();

    // Setup Socket listener for instant scan notification
    if (user?._id) {
      const socketUrl = getSocketURL();
      const socket = io(socketUrl, {
        transports: ["websocket", "polling"],
        reconnectionAttempts: 5,
      });

      socket.on("connect", () => {
        socket.emit("join_user_room", user._id);
      });

      socket.on("qr_scanned", (newScan) => {
        if (soundRef.current) playChime();
        toast.success(`🚨 Live Scan Alert! QR code scanned by ${newScan.scannerName}`, {
          duration: 5000,
          icon: "📱",
        });

        setLiveScanNotice(newScan);
        setTimeout(() => setLiveScanNotice(null), 8000);

        setHistory((prev) => [newScan, ...prev]);
        setStats((prevStats) => ({
          ...prevStats,
          totalScans: (prevStats.totalScans || 0) + 1,
          responderScans:
            newScan.scannerRole === "responder"
              ? (prevStats.responderScans || 0) + 1
              : prevStats.responderScans || 0,
          citizenScans:
            newScan.scannerRole === "citizen" || newScan.scannerRole === "admin"
              ? (prevStats.citizenScans || 0) + 1
              : prevStats.citizenScans || 0,
          anonymousScans:
            newScan.scannerRole === "anonymous"
              ? (prevStats.anonymousScans || 0) + 1
              : prevStats.anonymousScans || 0,
          lastScannedAt: newScan.createdAt,
        }));
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user?._id]);

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear your entire QR scan history?")) {
      return;
    }

    try {
      const res = await api.delete("/qr/history");
      if (res.data.success) {
        toast.success("Scan history cleared!");
        setHistory([]);
        setStats({
          totalScans: 0,
          responderScans: 0,
          citizenScans: 0,
          anonymousScans: 0,
          lastScannedAt: null,
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to clear history");
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const res = await api.delete(`/qr/history/${id}`);
      if (res.data.success) {
        toast.success("Entry removed");
        setHistory((prev) => prev.filter((item) => item._id !== id));
        setStats((prev) => ({
          ...prev,
          totalScans: Math.max(0, (prev.totalScans || 1) - 1),
        }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete entry");
    }
  };

  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    const now = new Date();
    const diffSeconds = Math.floor((now - date) / 1000);

    if (diffSeconds < 60) return "Just now";
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredHistory = history.filter((item) => {
    if (filterRole === "responder" && item.scannerRole !== "responder") return false;
    if (
      filterRole === "citizen" &&
      item.scannerRole !== "citizen" &&
      item.scannerRole !== "admin"
    )
      return false;
    if (filterRole === "anonymous" && item.scannerRole !== "anonymous") return false;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchName = item.scannerName?.toLowerCase().includes(query);
      const matchDevice = item.deviceType?.toLowerCase().includes(query);
      const matchIp = item.ipAddress?.toLowerCase().includes(query);
      return matchName || matchDevice || matchIp;
    }

    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* TOP HEADER BANNER */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 shrink-0">
                <QrCode size={30} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    QR Code Scan History
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                    <Radio size={12} className="animate-pulse text-cyan-400" />
                    Live Audit
                  </span>
                </div>
                <p className="text-slate-400 text-sm mt-1">
                  Track who accessed your emergency card, when it was scanned, and scanner credentials.
                </p>
              </div>
            </div>

            {/* CONTROLS */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition shadow-sm"
                title={soundEnabled ? "Mute scan alert chime" : "Enable scan alert chime"}
              >
                {soundEnabled ? <Volume2 size={19} className="text-cyan-400" /> : <VolumeX size={19} />}
              </button>

              <button
                onClick={() => fetchHistory(true)}
                disabled={refreshing}
                className="px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition font-semibold text-sm flex items-center gap-2"
              >
                <RefreshCw size={17} className={refreshing ? "animate-spin text-blue-400" : ""} />
                <span>Refresh</span>
              </button>

              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="px-4 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition font-semibold text-sm flex items-center gap-2"
                >
                  <Trash2 size={17} />
                  <span>Clear All Log</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* LIVE SCAN ALERT NOTIFICATION POPUP */}
        {liveScanNotice && (
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl p-4 shadow-xl shadow-emerald-900/30 flex items-center justify-between animate-bounce">
            <div className="flex items-center gap-3">
              <Sparkles size={24} className="animate-spin" />
              <div>
                <p className="font-bold text-sm">
                  🚨 Real-time QR Code Scan Detected!
                </p>
                <p className="text-xs text-emerald-100">
                  Scanned by: <span className="font-extrabold">{liveScanNotice.scannerName}</span> ({liveScanNotice.deviceType})
                </p>
              </div>
            </div>
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-bold">
              {formatRelativeTime(liveScanNotice.createdAt)}
            </span>
          </div>
        )}

        {/* STATS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
              <span>Total Scans</span>
              <QrCode size={18} className="text-blue-400" />
            </div>
            <p className="text-3xl font-black text-white mt-2">
              {loading ? "..." : stats.totalScans || 0}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              All lifetime QR readings
            </p>
          </div>

          <div className="bg-slate-900/60 border border-emerald-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold uppercase">
              <span>Responders</span>
              <ShieldCheck size={18} className="text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-emerald-400 mt-2">
              {loading ? "..." : stats.responderScans || 0}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Verified Emergency Responders
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/30 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-cyan-400 text-xs font-semibold uppercase">
              <span>Citizens</span>
              <UserCheck size={18} className="text-cyan-400" />
            </div>
            <p className="text-3xl font-black text-cyan-400 mt-2">
              {loading ? "..." : stats.citizenScans || 0}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Logged in platform users
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
              <span>Public / Guests</span>
              <UserX size={18} className="text-slate-400" />
            </div>
            <p className="text-3xl font-black text-slate-300 mt-2">
              {loading ? "..." : stats.anonymousScans || 0}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              First responders without login
            </p>
          </div>
        </div>

        {/* SEARCH AND FILTER BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80">
          {/* SEARCH INPUT */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3 text-slate-400" size={17} />
            <input
              type="text"
              placeholder="Search scanner name, device, IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 placeholder-slate-500"
            />
          </div>

          {/* ROLE FILTER TABS */}
          <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800/80 w-full sm:w-auto overflow-x-auto">
            {[
              { id: "all", label: "All Scans" },
              { id: "responder", label: "Responders" },
              { id: "citizen", label: "Citizens" },
              { id: "anonymous", label: "Anonymous" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterRole(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  filterRole === tab.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* HISTORY LIST */}
        {loading ? (
          <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-400">
              Retrieving scan history logs...
            </p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800/80 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/60 flex items-center justify-center mx-auto text-slate-500">
              <AlertCircle size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">No Scan Records Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                {searchQuery || filterRole !== "all"
                  ? "No scan entries match your current search or filter criteria."
                  : "No one has scanned your Emergency QR code yet. When scanned by responders or citizens, logs will appear here live."}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item) => {
              const isResponder = item.scannerRole === "responder";
              const isCitizen = item.scannerRole === "citizen" || item.scannerRole === "admin";

              return (
                <div
                  key={item._id}
                  className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isResponder
                      ? "bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50"
                      : isCitizen
                      ? "bg-slate-900/60 border-cyan-500/20 hover:border-cyan-500/40"
                      : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  {/* SCANNER DETAILS */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                        isResponder
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : isCitizen
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}
                    >
                      {isResponder ? (
                        <ShieldCheck size={24} />
                      ) : isCitizen ? (
                        <UserCheck size={24} />
                      ) : (
                        <UserX size={24} />
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-white text-base">
                          {item.scannerName}
                        </h3>

                        {/* BADGE */}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border tracking-wider ${
                            isResponder
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                              : isCitizen
                              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                              : "bg-slate-800 text-slate-400 border-slate-700"
                          }`}
                        >
                          {isResponder
                            ? "Verified Responder"
                            : isCitizen
                            ? "Registered Citizen"
                            : "First Responder (Public)"}
                        </span>
                      </div>

                      {/* SCANNER METADATA */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-2 font-medium">
                        <span className="flex items-center gap-1.5 text-slate-300">
                          {item.deviceType?.includes("Desktop") ? (
                            <Laptop size={14} className="text-blue-400" />
                          ) : (
                            <Smartphone size={14} className="text-cyan-400" />
                          )}
                          <span>{item.deviceType || "Browser"}</span>
                        </span>

                        {item.ipAddress && (
                          <span className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
                            <Globe size={13} className="text-slate-500" />
                            <span>IP: {item.ipAddress}</span>
                          </span>
                        )}

                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock size={13} />
                          <span>
                            {new Date(item.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </span>
                      </div>

                      {item.scannedBy?.phone && (
                        <div className="mt-2 text-xs text-slate-400">
                          Contact:{" "}
                          <a
                            href={`tel:${item.scannedBy.phone}`}
                            className="text-cyan-400 font-bold hover:underline"
                          >
                            {item.scannedBy.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT SIDE TIME & ACTION */}
                  <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800/60">
                    <span className="text-xs font-bold px-3 py-1 rounded-lg bg-slate-950 text-slate-400 border border-slate-800">
                      {formatRelativeTime(item.createdAt)}
                    </span>

                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="Delete entry from history"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default QRHistoryPage;
