import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const EmergencyPage = () => {
  const { userId } = useParams();

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [aiTriageText, setAiTriageText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const [sosLoading, setSosLoading] = useState(false);
  const [sosStatus, setSosStatus] = useState("");

  useEffect(() => {
    fetchCard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchAITriage = async () => {
    try {
      setAiLoading(true);
      setAiError("");
      const res = await api.get(`/public/ai-triage/${userId}`);
      if (res.data.success) {
        setAiTriageText(res.data.triageAdvice);
      }
    } catch (err) {
      setAiError(err.response?.data?.message || "Failed to generate AI triage advice.");
    } finally {
      setAiLoading(false);
    }
  };

  const fetchIPLocationFallback = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      if (response.ok) {
        const data = await response.json();
        if (data.latitude && data.longitude) {
          return {
            latitude: data.latitude,
            longitude: data.longitude,
            locationName: `${data.city || ""}, ${data.region || ""}`.trim() || "Network Location",
          };
        }
      }
    } catch (e) {
      console.warn("Primary IP Geolocation API error:", e);
    }

    try {
      const response = await fetch("https://ip-api.com/json/");
      if (response.ok) {
        const data = await response.json();
        if (data.lat && data.lon) {
          return {
            latitude: data.lat,
            longitude: data.lon,
            locationName: `${data.city || ""}, ${data.regionName || ""}`.trim() || "Network Location",
          };
        }
      }
    } catch (e) {
      console.warn("Secondary IP Geolocation API error:", e);
    }

    return { latitude: 28.6139, longitude: 77.2090, locationName: "Emergency Hub" };
  };

  const sendSOSPayload = async (latitude, longitude, locationType = "GPS", locationName = "") => {
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const notes = `SOS Alert triggered (${locationType} Location: ${locationName || "Current Area"})`;

      const res = await api.post(
        "/emergency/sos",
        { latitude, longitude, victimUserId: userId, notes },
        config
      );

      if (res.data.success) {
        const label = locationType === "Exact GPS" ? "Live GPS" : `Location (${locationName || "Area"})`;
        setSosStatus(`🚨 SOS Broadcasted! ${label}: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      }
    } catch (err) {
      setSosStatus(err.response?.data?.message || "SOS Broadcast failed.");
    } finally {
      setSosLoading(false);
    }
  };

  const triggerSOS = async () => {
    setSosLoading(true);
    setSosStatus("Detecting location...");

    if (!navigator.geolocation) {
      const ipLoc = await fetchIPLocationFallback();
      await sendSOSPayload(ipLoc.latitude, ipLoc.longitude, "Network IP", ipLoc.locationName);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("GPS Location acquired:", latitude, longitude);
        await sendSOSPayload(latitude, longitude, "Exact GPS", "Live Coordinates");
      },
      async (err) => {
        console.warn("Geolocation permission/hardware notice (Code " + err.code + "):", err.message);
        setSosStatus("Using Network IP Geolocation...");
        const ipLoc = await fetchIPLocationFallback();
        await sendSOSPayload(ipLoc.latitude, ipLoc.longitude, "Network IP", ipLoc.locationName);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };





  // =====================================================
  const parseOfflinePayload = () => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const dataParam = searchParams.get("data");
      if (dataParam) {
        let decodedStr = "";
        try {
          decodedStr = atob(dataParam.replace(/-/g, "+").replace(/_/g, "/"));
        } catch {
          decodedStr = window.atob ? atob(dataParam) : "";
        }

        if (decodedStr) {
          const parsed = JSON.parse(decodedStr);
          const contacts = [];
          if (parsed.ice1) {
            const parts = parsed.ice1.split(":");
            contacts.push({
              contactName: parts[0]?.trim() || "Primary ICE Contact",
              phone: parts[1]?.trim() || parsed.ice || "",
              relationship: "Primary Emergency Contact",
              isPrimary: true,
            });
          } else if (parsed.ice) {
            contacts.push({
              contactName: "Primary ICE Contact",
              phone: parsed.ice,
              relationship: "Primary Emergency Contact",
              isPrimary: true,
            });
          }

          if (parsed.ice2) {
            const parts = parsed.ice2.split(":");
            contacts.push({
              contactName: parts[0]?.trim() || "Secondary ICE Contact",
              phone: parts[1]?.trim() || "",
              relationship: "Secondary Emergency Contact",
              isPrimary: false,
            });
          }

          return {
            fullName: parsed.fn || "Citizen",
            bloodGroup: parsed.bg || "Unknown",
            emergencyContact: contacts[0] || null,
            emergencyContacts: contacts,
            medicalProfile: {
              allergies: parsed.al || "None declared",
              medicalConditions: parsed.mc || "None declared",
              organDonor: parsed.od || false,
            },
            isOfflinePayload: true,
            accessLevel: "public",
          };
        }
      }
    } catch (err) {
      console.warn("Failed to parse offline payload:", err);
    }
    return null;
  };

  const fetchCard = async (token = null) => {
    try {
      setLoading(true);
      setError("");

      const config = {};
      if (token) {
        config.headers = {
          Authorization: `Bearer ${token}`,
        };
      }

      const res = await api.get(`/public/${userId}`, config);
      setCard(res.data.emergencyCard);
    } catch (err) {
      console.error("Emergency card fetch error:", err);
      const offlineCard = parseOfflinePayload();
      if (offlineCard) {
        setCard(offlineCard);
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to load emergency card (No network & no offline payload)"
        );
      }
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // RESPONDER LOGIN
  // =====================================================

  const handleResponderLogin = async (e) => {
    e.preventDefault();

    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });

      const { token, user } = res.data;

      console.log("RESPONDER LOGIN USER:", user);

      // Check responder
      if (
        user.accountType !== "responder" ||
        user.isVerified !== true ||
        user.verificationStatus !== "approved"
      ) {
        setLoginError(
          "Access denied. Only verified responders can view full medical details."
        );

        setLoginLoading(false);
        return;
      }

      // Save token
      localStorage.setItem("token", token);

      setShowLogin(false);

      // Fetch full information
      await fetchCard(token);

    } catch (err) {
      console.error("Responder login error:", err);

      setLoginError(
        err.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoginLoading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingCard}>
          <div style={styles.pulseIcon}>🚑</div>

          <p style={styles.loadingText}>
            Loading emergency information...
          </p>

          <div style={styles.loadingBar}>
            <div style={styles.loadingBarInner} />
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !card) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.errorCard}>
          <span style={{ fontSize: "48px" }}>⚠️</span>

          <h2 style={styles.errorTitle}>
            Emergency Card Not Found
          </h2>

          <p style={styles.errorText}>
            {error ||
              "This emergency card does not exist or has been removed."}
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // CHECK RESPONDER
  // =====================================================

  const isVerifiedResponder =
    card.accessLevel === "verified_responder";

  // =====================================================
  // VERIFIED RESPONDER VIEW
  // =====================================================

  if (isVerifiedResponder) {
    const mp = card.medicalProfile || {};

    // -------------------------------------------------
    // IMPORTANT:
    // Insurance can be ARRAY or OBJECT
    // -------------------------------------------------

    const insurance = Array.isArray(card.insurance)
      ? card.insurance
      : card.insurance
      ? [card.insurance]
      : [];

    // -------------------------------------------------
    // Documents
    // -------------------------------------------------

    const documents = Array.isArray(card.documents)
      ? card.documents
      : [];

    return (
      <div style={styles.pageResponder}>
        <div style={styles.container}>

          {/* HEADER */}

          <div style={styles.responderHeader}>
            <div style={styles.responderBadge}>
              <span style={styles.badgeIcon}>✓</span>

              Verified Responder Access
            </div>

            <h1 style={styles.responderTitle}>
              🚑 Emergency Medical Information
            </h1>

            <p style={styles.responderSubtitle}>
              Full medical details accessible to verified
              emergency responders.
            </p>
          </div>

          {/* ================================================= */}
          {/* PATIENT INFORMATION */}
          {/* ================================================= */}

          <Section
            icon="👤"
            title="Patient Information"
            color="#3b82f6"
          >
            <div style={styles.grid}>

              <InfoCard
                label="Full Name"
                value={card.fullName}
                icon="🏷️"
              />

              <InfoCard
                label="Phone"
                value={card.phone}
                icon="📱"
                isLink={
                  card.phone
                    ? `tel:${card.phone}`
                    : null
                }
              />

              <InfoCard
                label="Email"
                value={card.email}
                icon="✉️"
                isLink={
                  card.email
                    ? `mailto:${card.email}`
                    : null
                }
              />

              <InfoCard
                label="Blood Group"
                value={card.bloodGroup}
                icon="🩸"
                highlight
              />

            </div>
          </Section>

          {/* ================================================= */}
          {/* MEDICAL PROFILE */}
          {/* ================================================= */}

          <Section
            icon="🩺"
            title="Medical Profile"
            color="#8b5cf6"
          >

            <div style={styles.grid}>

              <InfoCard
                label="Date of Birth"
                value={
                  mp.dateOfBirth
                    ? new Date(
                        mp.dateOfBirth
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : null
                }
                icon="📅"
              />

              <InfoCard
                label="Gender"
                value={mp.gender}
                icon="⚧"
              />

              <InfoCard
                label="Height"
                value={
                  mp.height
                    ? `${mp.height} cm`
                    : null
                }
                icon="📏"
              />

              <InfoCard
                label="Weight"
                value={
                  mp.weight
                    ? `${mp.weight} kg`
                    : null
                }
                icon="⚖️"
              />

            </div>

            {/* CRITICAL INFORMATION */}

            <div style={styles.criticalSection}>

              <h3 style={styles.criticalTitle}>
                ⚠️ Critical Medical Information
              </h3>

              <div style={styles.criticalGrid}>

                <CriticalInfo
                  label="Allergies"
                  value={mp.allergies}
                  color="#ef4444"
                />

                <CriticalInfo
                  label="Medical Conditions"
                  value={mp.medicalConditions}
                  color="#f59e0b"
                />

                <CriticalInfo
                  label="Current Medications"
                  value={mp.medications}
                  color="#3b82f6"
                />

              </div>

            </div>

            <div style={styles.grid}>

              <InfoCard
                label="Organ Donor"
                value={
                  mp.organDonor
                    ? "Yes ✓"
                    : "No"
                }
                icon="💚"
                highlight={mp.organDonor}
              />

              <InfoCard
                label="Address"
                value={mp.address}
                icon="📍"
              />

            </div>

          </Section>

          {/* ================================================= */}
          {/* EMERGENCY CONTACT */}
          {/* ================================================= */}

          <Section
            icon="📞"
            title="Emergency Contact"
            color="#ef4444"
          >

            {card.emergencyContact ? (
              <>
                <div style={styles.grid}>

                  <InfoCard
                    label="Contact Name"
                    value={
                      card.emergencyContact.contactName
                    }
                    icon="👤"
                  />

                  <InfoCard
                    label="Relationship"
                    value={
                      card.emergencyContact.relationship
                    }
                    icon="🤝"
                  />

                  <InfoCard
                    label="Phone"
                    value={
                      card.emergencyContact.phone
                    }
                    icon="📱"
                    isLink={
                      card.emergencyContact.phone
                        ? `tel:${card.emergencyContact.phone}`
                        : null
                    }
                  />

                  <InfoCard
                    label="Email"
                    value={
                      card.emergencyContact.email
                    }
                    icon="✉️"
                  />

                  <InfoCard
                    label="Address"
                    value={
                      card.emergencyContact.address
                    }
                    icon="📍"
                  />

                </div>

                {card.emergencyContact.phone && (
                  <a
                    href={`tel:${card.emergencyContact.phone}`}
                    style={styles.callButton}
                  >
                    📞 Call Emergency Contact
                  </a>
                )}
              </>
            ) : (
              <p style={styles.emptyText}>
                No emergency contact available.
              </p>
            )}

          </Section>

          {/* ================================================= */}
          {/* INSURANCE */}
          {/* ================================================= */}

          <Section
            icon="🏥"
            title="Insurance Information"
            color="#10b981"
          >

            {insurance.length > 0 ? (

              <div style={styles.insuranceList}>

                {insurance.map((item, index) => (

                  <div
                    key={item._id || index}
                    style={styles.insuranceCard}
                  >

                    <div style={styles.grid}>

                      <InfoCard
                        label="Provider"
                        value={item.provider}
                        icon="🏢"
                      />

                      <InfoCard
                        label="Policy Number"
                        value={item.policyNumber}
                        icon="📋"
                      />

                      <InfoCard
                        label="Policy Holder"
                        value={item.policyHolder}
                        icon="👤"
                      />

                      <InfoCard
                        label="Valid Till"
                        value={
                          item.validTill
                            ? new Date(
                                item.validTill
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )
                            : null
                        }
                        icon="📅"
                      />

                    </div>

                  </div>

                ))}

              </div>

            ) : (

              <p style={styles.emptyText}>
                No insurance information available.
              </p>

            )}

          </Section>

          {/* ================================================= */}
          {/* MEDICAL DOCUMENTS */}
          {/* ================================================= */}

          <Section
            icon="📄"
            title="Medical Documents"
            color="#f59e0b"
          >

            {documents.length > 0 ? (

              <div style={styles.documentsGrid}>

                {documents.map((doc, index) => (

                  <div
                    key={doc._id || index}
                    style={styles.documentCard}
                  >

                    <div style={styles.documentIcon}>
                      📄
                    </div>

                    <div style={styles.documentInfo}>

                      <p style={styles.documentType}>
                        {doc.documentType ||
                          "Medical Document"}
                      </p>

                      <p style={styles.documentName}>
                        {doc.fileName ||
                          "Document"}
                      </p>

                      {doc.createdAt && (
                        <p style={styles.documentDate}>
                          Uploaded{" "}
                          {new Date(
                            doc.createdAt
                          ).toLocaleDateString(
                            "en-IN"
                          )}
                        </p>
                      )}

                    </div>

                    {doc.fileUrl && (
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.viewDocumentButton}
                      >
                        View
                      </a>
                    )}

                  </div>

                ))}

              </div>

            ) : (

              <div style={styles.noDocuments}>

                <div style={styles.folderIcon}>
                  📂
                </div>

                <p>
                  No medical documents available.
                </p>

              </div>

            )}

          </Section>

        </div>
      </div>
    );
  }

  // =====================================================
  // PUBLIC VIEW
  // =====================================================

  return (
    <div style={styles.pagePublic}>
      <div style={styles.publicContainer}>

        {card.isOfflinePayload && (
          <div style={{ background: "#fef3c7", border: "1px solid #f59e0b", color: "#92400e", padding: "10px 16px", borderRadius: "12px", textAlign: "center", fontWeight: "bold", fontSize: "14px", marginBottom: "16px" }}>
            ⚡ OFFLINE EMERGENCY PAYLOAD (Scanned without Internet)
          </div>
        )}

        <div style={styles.publicHeader}>



          <div style={styles.emergencyPulse}>
            <span style={styles.emergencyIcon}>
              🚑
            </span>
          </div>

          <h1 style={styles.publicTitle}>
            Emergency Medical Card
          </h1>

          <p style={styles.publicSubtitle}>
            Basic emergency information
          </p>

        </div>

        {/* BASIC INFORMATION */}

        <div style={styles.publicCard}>

          <div style={styles.publicInfoRow}>
            <span style={styles.publicLabel}>
              👤 Name
            </span>

            <span style={styles.publicValue}>
              {card.fullName}
            </span>
          </div>

          <div style={styles.publicDivider} />

          <div style={styles.publicInfoRow}>
            <span style={styles.publicLabel}>
              🩸 Blood Group
            </span>

            <span
              style={{
                ...styles.publicValue,
                ...styles.bloodBadge,
              }}
            >
              {card.bloodGroup ||
                "Not Available"}
            </span>
          </div>

        </div>

        {/* ONE-TAP SOS ALERT BROADCAST */}

        <div style={{ ...styles.publicCard, border: "2px solid #ef4444", background: "rgba(239, 68, 68, 0.05)", marginTop: "16px" }}>
          <h2 style={{ ...styles.publicSectionTitle, color: "#dc2626", display: "flex", alignItems: "center", gap: "8px" }}>
            🚨 One-Tap Emergency SOS Broadcast
          </h2>
          <p style={{ fontSize: "14px", color: "#475569", marginBottom: "12px" }}>
            Broadcast live GPS position to emergency contacts & verified responders nearby.
          </p>
          <button
            onClick={triggerSOS}
            disabled={sosLoading}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "#dc2626",
              color: "#ffffff",
              border: "none",
              borderRadius: "12px",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(220, 38, 38, 0.3)",
              transition: "all 0.2s ease"
            }}
          >
            {sosLoading ? "Transmitting SOS & GPS Location..." : "🚨 DISPATCH SOS ALERT NOW"}
          </button>
          {sosStatus && (
            <p style={{ marginTop: "10px", fontSize: "13px", color: "#991b1b", fontWeight: "600", textAlign: "center" }}>
              {sosStatus}
            </p>
          )}
        </div>

        {/* AI TRIAGE ASSISTANT */}
        <div style={{ ...styles.publicCard, border: "1px solid #3b82f6", background: "rgba(59, 130, 246, 0.03)", marginTop: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <h2 style={{ ...styles.publicSectionTitle, color: "#1d4ed8", margin: 0 }}>
              🤖 AI Emergency Triage Guidance
            </h2>
            <button
              onClick={fetchAITriage}
              disabled={aiLoading}
              style={{
                padding: "8px 16px",
                backgroundColor: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "13px",
                cursor: "pointer"
              }}
            >
              {aiLoading ? "Analyzing..." : "Generate AI Advice"}
            </button>
          </div>
          {aiError && <p style={{ color: "#dc2626", fontSize: "13px" }}>{aiError}</p>}
          {aiTriageText && (
            <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "10px", padding: "12px", whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: "13px", color: "#1e293b" }}>
              {aiTriageText}
            </div>
          )}
        </div>


        {/* EMERGENCY CONTACT */}

        {card.emergencyContact && (

          <div style={styles.publicCard}>

            <h2 style={styles.publicSectionTitle}>
              📞 Emergency Contact
            </h2>

            <div style={styles.publicInfoRow}>
              <span style={styles.publicLabel}>
                Name
              </span>

              <span style={styles.publicValue}>
                {card.emergencyContact.contactName}
              </span>
            </div>

            <div style={styles.publicDivider} />

            <div style={styles.publicInfoRow}>
              <span style={styles.publicLabel}>
                Relationship
              </span>

              <span style={styles.publicValue}>
                {card.emergencyContact.relationship}
              </span>
            </div>

            <div style={styles.publicDivider} />

            <div style={styles.publicInfoRow}>
              <span style={styles.publicLabel}>
                Phone
              </span>

              <span style={styles.publicValue}>
                {card.emergencyContact.phone}
              </span>
            </div>

            {card.emergencyContact.phone && (
              <a
                href={`tel:${card.emergencyContact.phone}`}
                style={styles.publicCallButton}
              >
                📞 Call Emergency Contact
              </a>
            )}

          </div>

        )}

        {/* RESPONDER LOGIN */}

        <div style={styles.responderLoginSection}>

          {!showLogin ? (
            <>

              <div style={styles.lockIcon}>
                🔒
              </div>

              <p style={styles.responderLoginText}>
                Are you a verified emergency responder?
              </p>

              <p style={styles.responderLoginSubtext}>
                Login to access full medical details
                including allergies, medications,
                conditions, insurance and medical
                documents.
              </p>

              <button
                onClick={() =>
                  setShowLogin(true)
                }
                style={styles.responderLoginButton}
              >
                🛡️ Verify as Responder
              </button>

            </>
          ) : (

            <>

              <h3 style={styles.loginFormTitle}>
                🛡️ Responder Verification
              </h3>

              <p style={styles.loginFormSubtitle}>
                Login with your verified responder
                account
              </p>

              {loginError && (
                <div style={styles.loginErrorBox}>
                  ⚠️ {loginError}
                </div>
              )}

              <form
                onSubmit={handleResponderLogin}
                style={styles.loginForm}
              >

                <div style={styles.inputGroup}>

                  <label style={styles.inputLabel}>
                    Email
                  </label>

                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) =>
                      setLoginEmail(e.target.value)
                    }
                    placeholder="responder@example.com"
                    required
                    style={styles.input}
                  />

                </div>

                <div style={styles.inputGroup}>

                  <label style={styles.inputLabel}>
                    Password
                  </label>

                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) =>
                      setLoginPassword(e.target.value)
                    }
                    placeholder="••••••••"
                    required
                    style={styles.input}
                  />

                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  style={{
                    ...styles.submitButton,
                    opacity: loginLoading
                      ? 0.7
                      : 1,
                  }}
                >
                  {loginLoading
                    ? "Verifying..."
                    : "🔓 Unlock Full Details"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowLogin(false);
                    setLoginError("");
                  }}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>

              </form>

            </>
          )}

        </div>

      </div>
    </div>
  );
};

// =====================================================
// SECTION
// =====================================================

const Section = ({
  icon,
  title,
  color,
  children,
}) => (
  <div style={styles.section}>

    <h2
      style={{
        ...styles.sectionTitle,
        borderLeftColor: color,
      }}
    >
      <span style={{ marginRight: "8px" }}>
        {icon}
      </span>

      {title}
    </h2>

    {children}

  </div>
);

// =====================================================
// INFO CARD
// =====================================================

const InfoCard = ({
  label,
  value,
  icon,
  highlight,
  isLink,
}) => {

  const content = (
    <div
      style={{
        ...styles.infoCard,
        ...(highlight
          ? styles.infoCardHighlight
          : {}),
      }}
    >

      <div style={styles.infoCardIcon}>
        {icon}
      </div>

      <p style={styles.infoCardLabel}>
        {label}
      </p>

      <p
        style={{
          ...styles.infoCardValue,
          ...(isLink
            ? { color: "#3b82f6" }
            : {}),
        }}
      >
        {value || "Not provided"}
      </p>

    </div>
  );

  if (isLink && value) {
    return (
      <a
        href={isLink}
        style={{
          textDecoration: "none",
        }}
      >
        {content}
      </a>
    );
  }

  return content;
};

// =====================================================
// CRITICAL INFO
// =====================================================

const CriticalInfo = ({
  label,
  value,
  color,
}) => (
  <div
    style={{
      ...styles.criticalCard,
      borderLeftColor: color,
    }}
  >

    <p style={styles.criticalLabel}>
      {label}
    </p>

    <p style={styles.criticalValue}>
      {value || "None reported"}
    </p>

  </div>
);

// =====================================================
// STYLES
// =====================================================

const styles = {

  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    padding: "20px",
  },

  loadingCard: {
    background:
      "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "48px",
    textAlign: "center",
    border:
      "1px solid rgba(255, 255, 255, 0.1)",
  },

  pulseIcon: {
    fontSize: "64px",
    marginBottom: "16px",
  },

  loadingText: {
    color: "#94a3b8",
    fontSize: "16px",
    marginBottom: "24px",
  },

  loadingBar: {
    width: "200px",
    height: "4px",
    background:
      "rgba(255, 255, 255, 0.1)",
    borderRadius: "4px",
    overflow: "hidden",
    margin: "0 auto",
  },

  loadingBarInner: {
    width: "40%",
    height: "100%",
    background:
      "linear-gradient(90deg, #3b82f6, #8b5cf6)",
    borderRadius: "4px",
  },

  errorCard: {
    background:
      "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "48px",
    textAlign: "center",
    border:
      "1px solid rgba(239, 68, 68, 0.3)",
    maxWidth: "400px",
  },

  errorTitle: {
    color: "#f87171",
    fontSize: "22px",
    fontWeight: "700",
    marginTop: "16px",
  },

  errorText: {
    color: "#94a3b8",
    fontSize: "14px",
    marginTop: "8px",
  },

  pageResponder: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
    padding: "24px 16px 48px",
    fontFamily:
      "'Inter', 'Poppins', sans-serif",
  },

  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },

  responderHeader: {
    background:
      "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)",
    borderRadius: "24px",
    padding: "32px",
    marginBottom: "24px",
  },

  responderBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background:
      "rgba(74, 222, 128, 0.15)",
    color: "#86efac",
    padding: "6px 16px",
    borderRadius: "100px",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "16px",
  },

  badgeIcon: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "#22c55e",
    color: "white",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },

  responderTitle: {
    color: "white",
    fontSize: "28px",
    fontWeight: "800",
    margin: "0",
  },

  responderSubtitle: {
    color:
      "rgba(199, 210, 254, 0.8)",
    fontSize: "14px",
    marginTop: "8px",
  },

  section: {
    background:
      "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    padding: "28px",
    marginBottom: "20px",
    border:
      "1px solid rgba(255, 255, 255, 0.06)",
  },

  sectionTitle: {
    color: "white",
    fontSize: "18px",
    fontWeight: "700",
    margin: "0 0 20px",
    paddingLeft: "16px",
    borderLeft: "4px solid",
    display: "flex",
    alignItems: "center",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "14px",
  },

  infoCard: {
    background:
      "rgba(255, 255, 255, 0.04)",
    borderRadius: "16px",
    padding: "18px",
    border:
      "1px solid rgba(255, 255, 255, 0.06)",
  },

  infoCardHighlight: {
    background:
      "rgba(239, 68, 68, 0.08)",
    border:
      "1px solid rgba(239, 68, 68, 0.2)",
  },

  infoCardIcon: {
    fontSize: "20px",
    marginBottom: "8px",
  },

  infoCardLabel: {
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "500",
    textTransform: "uppercase",
    margin: "0 0 4px",
  },

  infoCardValue: {
    color: "#e2e8f0",
    fontSize: "15px",
    fontWeight: "600",
    margin: "0",
    wordBreak: "break-word",
  },

  criticalSection: {
    margin: "20px 0",
    background:
      "rgba(239, 68, 68, 0.04)",
    borderRadius: "16px",
    padding: "20px",
  },

  criticalTitle: {
    color: "#fbbf24",
    fontSize: "16px",
    margin: "0 0 16px",
  },

  criticalGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  criticalCard: {
    background:
      "rgba(0, 0, 0, 0.2)",
    borderRadius: "12px",
    padding: "16px",
    borderLeft: "4px solid",
  },

  criticalLabel: {
    color: "#94a3b8",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "uppercase",
    margin: "0 0 6px",
  },

  criticalValue: {
    color: "#e2e8f0",
    fontSize: "15px",
    margin: "0",
    lineHeight: "1.6",
  },

  callButton: {
    display: "inline-block",
    background:
      "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
    color: "white",
    padding: "14px 28px",
    borderRadius: "14px",
    textDecoration: "none",
    fontWeight: "700",
    marginTop: "20px",
  },

  emptyText: {
    color: "#64748b",
    fontSize: "14px",
    fontStyle: "italic",
  },

  // =================================================
  // INSURANCE
  // =================================================

  insuranceList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  insuranceCard: {
    background:
      "rgba(16, 185, 129, 0.04)",
    borderRadius: "16px",
    padding: "4px",
    border:
      "1px solid rgba(16, 185, 129, 0.12)",
  },

  // =================================================
  // DOCUMENTS
  // =================================================

  documentsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  documentCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    background:
      "rgba(255, 255, 255, 0.04)",
    borderRadius: "14px",
    padding: "16px",
    border:
      "1px solid rgba(255, 255, 255, 0.06)",
  },

  documentIcon: {
    fontSize: "32px",
  },

  documentInfo: {
    flex: 1,
  },

  documentType: {
    color: "#e2e8f0",
    fontSize: "15px",
    fontWeight: "700",
    margin: "0 0 4px",
  },

  documentName: {
    color: "#94a3b8",
    fontSize: "13px",
    margin: "0 0 4px",
  },

  documentDate: {
    color: "#64748b",
    fontSize: "11px",
    margin: 0,
  },

  viewDocumentButton: {
    background:
      "linear-gradient(135deg, #1d4ed8, #7c3aed)",
    color: "white",
    padding: "9px 16px",
    borderRadius: "10px",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "600",
  },

  noDocuments: {
    textAlign: "center",
    padding: "30px",
    color: "#64748b",
  },

  folderIcon: {
    fontSize: "50px",
    marginBottom: "10px",
  },

  // =================================================
  // PUBLIC
  // =================================================

  pagePublic: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e1a2e 50%, #0f172a 100%)",
    display: "flex",
    justifyContent: "center",
    padding: "24px 16px 48px",
  },

  publicContainer: {
    maxWidth: "480px",
    width: "100%",
  },

  publicHeader: {
    textAlign: "center",
    marginBottom: "24px",
    padding: "32px 24px",
  },

  emergencyPulse: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background:
      "rgba(239, 68, 68, 0.1)",
    marginBottom: "20px",
  },

  emergencyIcon: {
    fontSize: "40px",
  },

  publicTitle: {
    color: "white",
    fontSize: "26px",
    fontWeight: "800",
    margin: "0",
  },

  publicSubtitle: {
    color: "#64748b",
    fontSize: "14px",
    marginTop: "8px",
  },

  publicCard: {
    background:
      "rgba(255, 255, 255, 0.04)",
    borderRadius: "20px",
    padding: "24px",
    marginBottom: "16px",
  },

  publicSectionTitle: {
    color: "white",
    fontSize: "17px",
    margin: "0 0 20px",
  },

  publicInfoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
  },

  publicLabel: {
    color: "#94a3b8",
    fontSize: "14px",
  },

  publicValue: {
    color: "#e2e8f0",
    fontSize: "15px",
    fontWeight: "600",
    textAlign: "right",
  },

  bloodBadge: {
    background:
      "rgba(239, 68, 68, 0.12)",
    color: "#f87171",
    padding: "4px 14px",
    borderRadius: "100px",
  },

  publicDivider: {
    height: "1px",
    background:
      "rgba(255, 255, 255, 0.06)",
  },

  publicCallButton: {
    display: "block",
    background:
      "linear-gradient(135deg, #dc2626, #b91c1c)",
    color: "white",
    padding: "16px",
    borderRadius: "14px",
    textDecoration: "none",
    fontWeight: "700",
    textAlign: "center",
    marginTop: "20px",
  },

  responderLoginSection: {
    background:
      "rgba(255, 255, 255, 0.03)",
    borderRadius: "20px",
    padding: "28px",
    textAlign: "center",
  },

  lockIcon: {
    fontSize: "32px",
    marginBottom: "12px",
  },

  responderLoginText: {
    color: "#e2e8f0",
    fontSize: "16px",
    fontWeight: "600",
  },

  responderLoginSubtext: {
    color: "#64748b",
    fontSize: "13px",
    lineHeight: "1.5",
  },

  responderLoginButton: {
    background:
      "linear-gradient(135deg, #1d4ed8, #7c3aed)",
    color: "white",
    border: "none",
    padding: "14px 32px",
    borderRadius: "14px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },

  loginFormTitle: {
    color: "white",
    fontSize: "18px",
  },

  loginFormSubtitle: {
    color: "#64748b",
    fontSize: "13px",
  },

  loginErrorBox: {
    background:
      "rgba(239, 68, 68, 0.1)",
    border:
      "1px solid rgba(239, 68, 68, 0.3)",
    color: "#f87171",
    borderRadius: "12px",
    padding: "12px 16px",
    marginBottom: "16px",
    textAlign: "left",
  },

  loginForm: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  inputGroup: {
    textAlign: "left",
  },

  inputLabel: {
    display: "block",
    color: "#94a3b8",
    fontSize: "13px",
    marginBottom: "6px",
  },

  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border:
      "1px solid rgba(255, 255, 255, 0.1)",
    background:
      "rgba(255, 255, 255, 0.04)",
    color: "white",
    boxSizing: "border-box",
  },

  submitButton: {
    background:
      "linear-gradient(135deg, #1d4ed8, #7c3aed)",
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },

  cancelButton: {
    background: "transparent",
    color: "#64748b",
    border:
      "1px solid rgba(255, 255, 255, 0.08)",
    padding: "12px",
    borderRadius: "12px",
    cursor: "pointer",
  },
};

export default EmergencyPage;