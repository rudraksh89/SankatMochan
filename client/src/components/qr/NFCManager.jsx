import { useState } from "react";
import { Radio, CheckCircle, AlertTriangle, Cpu } from "lucide-react";
import toast from "react-hot-toast";

const NFCManager = ({ qrUrl }) => {
  const [nfcStatus, setNfcStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [nfcData, setNfcData] = useState(null);

  const isNFCSupported = typeof window !== "undefined" && "NDEFReader" in window;

  // Write Emergency ID Payload to NFC Wristband / Tag
  const writeToNFC = async () => {
    if (!isNFCSupported) {
      toast.error("Web NFC API is not supported in this browser. Please use Chrome on Android.");
      return;
    }

    try {
      setLoading(true);
      setNfcStatus("Hold your NFC wristband / tag near the back of your phone...");

      // eslint-disable-next-line no-undef
      const ndef = new NDEFReader();
      await ndef.write({
        records: [
          {
            recordType: "url",
            data: qrUrl || window.location.href,
          },
          {
            recordType: "text",
            data: `SANKAT MOCHAN EMERGENCY MEDICAL ID: ${qrUrl || window.location.href}`,
          },
        ],
      });

      setNfcStatus("✅ Emergency Medical ID successfully programmed onto NFC wristband!");
      toast.success("NFC Wristband Written Successfully!");
    } catch (error) {
      console.error("NFC Write Error:", error);
      setNfcStatus(`❌ NFC Write Error: ${error.message || "Failed to program tag."}`);
      toast.error("Failed to write to NFC Wristband.");
    } finally {
      setLoading(false);
    }
  };

  // Read Emergency ID Payload from NFC Wristband / Tag
  const readNFC = async () => {
    if (!isNFCSupported) {
      toast.error("Web NFC API is not supported in this browser. Use Chrome on Android.");
      return;
    }

    try {
      setLoading(true);
      setNfcStatus("Scan mode active. Tap NFC wristband against your phone...");

      // eslint-disable-next-line no-undef
      const ndef = new NDEFReader();
      await ndef.scan();

      ndef.addEventListener("reading", ({ message, serialNumber }) => {
        setNfcStatus(`✅ NFC Tag Detected (ID: ${serialNumber})`);
        const records = [];

        for (const record of message.records) {
          const textDecoder = new TextDecoder(record.encoding || "utf-8");
          records.push({
            type: record.recordType,
            data: textDecoder.decode(record.data),
          });
        }

        setNfcData(records);
        toast.success("NFC Medical Wristband Read Successfully!");
      });

      ndef.addEventListener("readingerror", () => {
        setNfcStatus("⚠️ Error reading NFC tag. Try holding tag steady.");
        toast.error("NFC Reading Error.");
      });
    } catch (error) {
      console.error("NFC Scan Error:", error);
      setNfcStatus(`❌ NFC Scan Error: ${error.message || "Failed to start NFC scan."}`);
      toast.error("Failed to scan NFC Wristband.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/30 rounded-xl flex items-center justify-center text-purple-400">
          <Cpu size={26} />
        </div>
        <div>
          <h2 className="text-xl font-bold">NFC Smart Wristband Manager</h2>
          <p className="text-xs text-slate-400">
            Write/Read Emergency Medical Profile on scannable NFC wristbands & smart tags.
          </p>
        </div>
      </div>

      {!isNFCSupported && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-4 rounded-xl text-xs mb-6 flex items-start gap-2">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <span>
            Web NFC API requires Chrome on Android or an NFC-supported mobile browser. Desktop browsers support QR scanning & manual lookup.
          </span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <button
          onClick={writeToNFC}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 px-5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 disabled:opacity-50"
        >
          <Radio size={20} />
          {loading ? "Programming NFC..." : "Write to NFC Wristband"}
        </button>

        <button
          onClick={readNFC}
          disabled={loading}
          className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-5 rounded-xl border border-slate-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <CheckCircle size={20} />
          {loading ? "Scanning..." : "Scan NFC Wristband"}
        </button>
      </div>

      {nfcStatus && (
        <div className="mt-4 bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-slate-300 text-center font-medium">
          {nfcStatus}
        </div>
      )}

      {nfcData && nfcData.length > 0 && (
        <div className="mt-4 bg-purple-950/40 border border-purple-800/50 rounded-xl p-4">
          <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">
            NFC Scanned Emergency Data:
          </h3>
          {nfcData.map((rec, idx) => (
            <div key={idx} className="text-xs text-slate-200 bg-slate-900 p-2 rounded border border-slate-800 mb-1 break-all">
              <span className="font-semibold text-purple-400 uppercase mr-2">[{rec.type}]:</span>
              {rec.data}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NFCManager;
