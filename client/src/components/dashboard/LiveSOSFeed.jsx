import { useEffect, useState, useRef } from "react";
import {
  AlertTriangle,
  MapPin,
  Phone,
  Radio,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Navigation,
  UserCheck,
  Volume2,
  VolumeX,
} from "lucide-react";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

const getSocketURL = () => {
  const apiUrl = api.defaults.baseURL || "http://localhost:5000/api";
  return apiUrl.replace(/\/api\/?$/, "");
};

const playAlertTone = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.4);
  } catch (e) {
    console.warn("Audio Context playback notice:", e);
  }
};

const LiveSOSFeed = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const soundRef = useRef(soundEnabled);

  useEffect(() => {
    soundRef.current = soundEnabled;
  }, [soundEnabled]);

  const fetchAlerts = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      const res = await api.get("/emergency/sos-alerts");
      if (res.data.success) {
        setAlerts(res.data.alerts || []);
      }
    } catch (err) {
      console.error("Failed to fetch SOS alerts:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAlerts();

    // Socket.IO Real-Time Connection
    const socketUrl = getSocketURL();
    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("📡 Connected to SOS Radar WebSocket:", socket.id);
      socket.emit("join_radar");
    });

    socket.on("new_sos_alert", (newAlert) => {
      console.log("🚨 REAL-TIME SOS RECEIVED:", newAlert);
      if (soundRef.current) {
        playAlertTone();
      }
      setAlerts((prev) => {
        const exists = prev.some((a) => a._id === newAlert._id);
        if (exists) return prev;
        return [newAlert, ...prev];
      });
    });

    socket.on("sos_status_updated", (updatedAlert) => {
      console.log("🔄 SOS STATUS UPDATED VIA SOCKET:", updatedAlert);
      if (updatedAlert.status === "resolved") {
        setAlerts((prev) => prev.filter((a) => a._id !== updatedAlert._id));
      } else {
        setAlerts((prev) =>
          prev.map((a) => (a._id === updatedAlert._id ? updatedAlert : a))
        );
      }
    });

    const interval = setInterval(() => {
      fetchAlerts();
    }, 15000); // Background fallback sync

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, []);

  const handleUpdateStatus = async (alertId, newStatus) => {
    try {
      setUpdatingId(alertId);
      const res = await api.put(`/emergency/sos-alerts/${alertId}`, {
        status: newStatus,
      });

      if (res.data.success) {
        if (newStatus === "resolved") {
          setAlerts((prev) => prev.filter((a) => a._id !== alertId));
        } else {
          setAlerts((prev) =>
            prev.map((a) => (a._id === alertId ? { ...a, status: newStatus } : a))
          );
        }
      }
    } catch (err) {
      console.error("Failed to update SOS status:", err);
      alert(err.response?.data?.message || "Status update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-xl border border-red-500/30 rounded-3xl p-6 shadow-xl flex items-center justify-center space-x-3 text-red-400">
        <Radio className="animate-ping" size={24} />
        <span className="text-sm font-bold tracking-wide">Connecting to Live Emergency Radar...</span>
      </div>
    );
  }

  const activeCount = alerts.filter((a) => a.status === "active").length;

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-red-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-red-950/20 relative overflow-hidden">
      {/* Background Pulse Effect */}
      {activeCount > 0 && (
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-red-600/40 shrink-0">
            <Radio className="animate-pulse" size={26} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-tight">
                Live Emergency SOS Radar
              </h2>
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">
              Real-time accident broadcasts & GPS distress calls from citizens.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-between">
          <div className="px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-black uppercase flex items-center gap-2">
            <AlertTriangle size={14} className="text-red-400" />
            <span>{activeCount} Active Distresses</span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition"
            title={soundEnabled ? "Mute Radar" : "Unmute Radar"}
          >
            {soundEnabled ? <Volume2 size={18} className="text-cyan-400" /> : <VolumeX size={18} />}
          </button>

          <button
            onClick={() => fetchAlerts(true)}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition disabled:opacity-50"
            title="Refresh Emergency Radar"
          >
            <RefreshCw size={18} className={refreshing ? "animate-spin text-blue-400" : ""} />
          </button>
        </div>
      </div>

      {/* Alerts Feed List */}
      <div className="mt-6 space-y-4">
        {alerts.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center space-y-2">
            <CheckCircle2 className="mx-auto text-emerald-400" size={40} />
            <h3 className="font-bold text-white text-base">All Clear in Sector</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No active SOS alerts broadcasted. Radar is monitoring incoming distress frequencies 24/7.
            </p>
          </div>
        ) : (
          alerts.map((alertItem) => {
            const user = alertItem.user;
            const isDispatched = alertItem.status === "dispatched";
            const mapsUrl = `https://www.google.com/maps?q=${alertItem.latitude},${alertItem.longitude}`;
            const isUpdating = updatingId === alertItem._id;

            return (
              <div
                key={alertItem._id}
                className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                  isDispatched
                    ? "bg-amber-500/10 border-amber-500/30"
                    : "bg-red-500/10 border-red-500/40 shadow-lg shadow-red-950/30"
                }`}
              >
                {/* Status Bar Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                        isDispatched
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          : "bg-red-600 text-white border-red-400 animate-pulse"
                      }`}
                    >
                      {isDispatched ? "🚑 Responder En-Route" : "🚨 CRITICAL DISTRESS BROADCAST"}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(alertItem.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  </div>

                  {user?.bloodGroup && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-black">
                      🩸 {user.bloodGroup}
                    </span>
                  )}
                </div>

                {/* Victim Details & Location */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Left Column: Patient */}
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{user?.fullName || "Unidentified Victim"}</span>
                      {user?._id && (
                        <Link
                          to={`/dashboard/responder/emergency/${user._id}`}
                          className="text-[11px] font-semibold text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          <UserCheck size={14} />
                          <span>View Profile</span>
                        </Link>
                      )}
                    </h3>

                    <p className="text-xs text-slate-300 font-medium">
                      {alertItem.notes || "Emergency SOS broadcasted."}
                    </p>

                    {user?.phone && (
                      <a
                        href={`tel:${user.phone}`}
                        className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 mt-1"
                      >
                        <Phone size={14} />
                        <span>Call Victim ({user.phone})</span>
                      </a>
                    )}
                  </div>

                  {/* Right Column: GPS Location */}
                  <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300 flex items-center gap-1.5">
                        <MapPin size={15} className="text-red-400" />
                        <span>Location Coordinates</span>
                      </span>
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                      >
                        <span>Google Maps</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>

                    <p className="text-xs font-mono text-white">
                      Lat: {alertItem.latitude.toFixed(5)}, Lng: {alertItem.longitude.toFixed(5)}
                    </p>

                    {alertItem.address && (
                      <p className="text-[11px] text-slate-400 truncate">{alertItem.address}</p>
                    )}
                  </div>
                </div>

                {/* Dispatch & Resolution Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-end gap-3">
                  {!isDispatched && (
                    <button
                      onClick={() => handleUpdateStatus(alertItem._id, "dispatched")}
                      disabled={isUpdating}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-600/20 flex items-center gap-2"
                    >
                      <Navigation size={14} />
                      <span>{isUpdating ? "Dispatching..." : "Dispatch Ambulance / Respond"}</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleUpdateStatus(alertItem._id, "resolved")}
                    disabled={isUpdating}
                    className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-emerald-600/20 border border-slate-800 hover:border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center gap-2"
                  >
                    <CheckCircle2 size={14} />
                    <span>{isUpdating ? "Saving..." : "Mark Alert Resolved"}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default LiveSOSFeed;
