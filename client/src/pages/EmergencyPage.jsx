import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const EmergencyPage = () => {
  const { userId } = useParams();

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Responder login state
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    fetchCard();
  }, [userId]);

  const fetchCard = async (token = null) => {
    try {
      setLoading(true);
      setError("");

      const config = {};

      // If a fresh token is passed (from responder login),
      // use it directly instead of relying on the interceptor
      if (token) {
        config.headers = {
          Authorization: `Bearer ${token}`,
        };
      }

      const res = await api.get(
        `/public/${userId}`,
        config
      );

      console.log("Emergency Card:", res.data);
      setCard(res.data.emergencyCard);

    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Unable to load emergency card"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RESPONDER LOGIN HANDLER
  // ==========================================

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

      // Check if this user is actually a verified responder
      if (
        user.accountType !== "responder" ||
        !user.isVerified ||
        user.verificationStatus !== "approved"
      ) {
        setLoginError(
          "Access denied. Only verified responders can view full medical details."
        );
        setLoginLoading(false);
        return;
      }

      // Store token temporarily for this session
      localStorage.setItem("token", token);

      // Re-fetch the emergency card with the responder's token
      setShowLogin(false);
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

  // ==========================================
  // LOADING STATE
  // ==========================================

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

  // ==========================================
  // ERROR STATE
  // ==========================================

  if (error || !card) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.errorCard}>
          <span style={{ fontSize: "48px" }}>⚠️</span>
          <h2 style={styles.errorTitle}>
            Emergency Card Not Found
          </h2>
          <p style={styles.errorText}>
            {error || "This emergency card does not exist or has been removed."}
          </p>
        </div>
      </div>
    );
  }

  const isVerifiedResponder =
    card.accessLevel === "verified_responder";

  // =========================================
  // VERIFIED RESPONDER — FULL MEDICAL VIEW
  // =========================================

  if (isVerifiedResponder) {
    const mp = card.medicalProfile || {};

    return (
      <div style={styles.pageResponder}>
        <div style={styles.container}>

          {/* RESPONDER HEADER */}
          <div style={styles.responderHeader}>
            <div style={styles.responderBadge}>
              <span style={styles.badgeIcon}>✓</span>
              Verified Responder Access
            </div>

            <h1 style={styles.responderTitle}>
              🚑 Emergency Medical Information
            </h1>

            <p style={styles.responderSubtitle}>
              Full medical details — accessible only to
              verified emergency responders.
            </p>
          </div>

          {/* PATIENT INFORMATION */}
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
                isLink={`tel:${card.phone}`}
              />
              <InfoCard
                label="Email"
                value={card.email}
                icon="✉️"
                isLink={`mailto:${card.email}`}
              />
              <InfoCard
                label="Blood Group"
                value={card.bloodGroup}
                icon="🩸"
                highlight
              />
            </div>
          </Section>

          {/* MEDICAL PROFILE */}
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
                  mp.height ? `${mp.height} cm` : null
                }
                icon="📏"
              />
              <InfoCard
                label="Weight"
                value={
                  mp.weight ? `${mp.weight} kg` : null
                }
                icon="⚖️"
              />
            </div>

            {/* Critical Medical Info */}
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
                value={mp.organDonor ? "Yes ✓" : "No"}
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

          {/* EMERGENCY CONTACT */}
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
                    value={card.emergencyContact.phone}
                    icon="📱"
                    isLink={`tel:${card.emergencyContact.phone}`}
                  />
                  <InfoCard
                    label="Email"
                    value={card.emergencyContact.email}
                    icon="✉️"
                  />
                  <InfoCard
                    label="Address"
                    value={card.emergencyContact.address}
                    icon="📍"
                  />
                </div>

                {card.emergencyContact?.phone && (
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

          {/* INSURANCE */}
          <Section
            icon="🏥"
            title="Insurance Information"
            color="#10b981"
          >
            {card.insurance ? (
              <div style={styles.grid}>
                <InfoCard
                  label="Provider"
                  value={card.insurance.provider}
                  icon="🏢"
                />
                <InfoCard
                  label="Policy Number"
                  value={card.insurance.policyNumber}
                  icon="📋"
                />
                <InfoCard
                  label="Policy Holder"
                  value={card.insurance.policyHolder}
                  icon="👤"
                />
                <InfoCard
                  label="Valid Till"
                  value={
                    card.insurance.validTill
                      ? new Date(
                          card.insurance.validTill
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : null
                  }
                  icon="📅"
                />
              </div>
            ) : (
              <p style={styles.emptyText}>
                No insurance information available.
              </p>
            )}
          </Section>

        </div>
      </div>
    );
  }

  // =========================================
  // PUBLIC / NORMAL USER — BASIC VIEW
  // =========================================

  return (
    <div style={styles.pagePublic}>
      <div style={styles.publicContainer}>

        {/* Emergency Header */}
        <div style={styles.publicHeader}>
          <div style={styles.emergencyPulse}>
            <span style={styles.emergencyIcon}>🚑</span>
          </div>

          <h1 style={styles.publicTitle}>
            Emergency Medical Card
          </h1>

          <p style={styles.publicSubtitle}>
            Basic emergency information
          </p>
        </div>

        {/* Basic Info */}
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
              {card.bloodGroup || "Not Available"}
            </span>
          </div>
        </div>

        {/* Emergency Contact */}
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

            {card.emergencyContact?.phone && (
              <a
                href={`tel:${card.emergencyContact.phone}`}
                style={styles.publicCallButton}
              >
                📞 Call Emergency Contact
              </a>
            )}
          </div>
        )}

        {/* Responder Login Section */}
        <div style={styles.responderLoginSection}>

          {!showLogin ? (
            <>
              <div style={styles.lockIcon}>🔒</div>
              <p style={styles.responderLoginText}>
                Are you a verified emergency responder?
              </p>
              <p style={styles.responderLoginSubtext}>
                Login to access full medical details
                including allergies, medications, conditions,
                and insurance.
              </p>
              <button
                onClick={() => setShowLogin(true)}
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
                Login with your verified responder account
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
                    opacity: loginLoading ? 0.7 : 1,
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

// =========================================
// SECTION COMPONENT
// =========================================

const Section = ({ icon, title, color, children }) => (
  <div style={styles.section}>
    <h2
      style={{
        ...styles.sectionTitle,
        borderLeftColor: color,
      }}
    >
      <span style={{ marginRight: "8px" }}>{icon}</span>
      {title}
    </h2>
    {children}
  </div>
);

// =========================================
// INFO CARD COMPONENT
// =========================================

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
        ...(highlight ? styles.infoCardHighlight : {}),
      }}
    >
      <div style={styles.infoCardIcon}>{icon}</div>
      <p style={styles.infoCardLabel}>{label}</p>
      <p
        style={{
          ...styles.infoCardValue,
          ...(isLink ? { color: "#3b82f6" } : {}),
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
        style={{ textDecoration: "none" }}
      >
        {content}
      </a>
    );
  }

  return content;
};

// =========================================
// CRITICAL INFO COMPONENT
// =========================================

const CriticalInfo = ({ label, value, color }) => (
  <div
    style={{
      ...styles.criticalCard,
      borderLeftColor: color,
    }}
  >
    <p style={styles.criticalLabel}>{label}</p>
    <p style={styles.criticalValue}>
      {value || "None reported"}
    </p>
  </div>
);

// =========================================
// STYLES
// =========================================

const styles = {
  // Loading
  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    padding: "20px",
  },

  loadingCard: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "48px",
    textAlign: "center",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },

  pulseIcon: {
    fontSize: "64px",
    animation: "pulse 2s infinite",
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
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "4px",
    overflow: "hidden",
    margin: "0 auto",
  },

  loadingBarInner: {
    width: "40%",
    height: "100%",
    background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
    borderRadius: "4px",
    animation: "loading 1.5s infinite ease-in-out",
  },

  // Error
  errorCard: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "48px",
    textAlign: "center",
    border: "1px solid rgba(239, 68, 68, 0.3)",
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

  // ======= RESPONDER VIEW =======
  pageResponder: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
    padding: "24px 16px 48px",
    fontFamily: "'Inter', 'Poppins', sans-serif",
  },

  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },

  responderHeader: {
    background: "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)",
    borderRadius: "24px",
    padding: "32px",
    marginBottom: "24px",
    boxShadow: "0 20px 60px rgba(29, 78, 216, 0.3)",
  },

  responderBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(74, 222, 128, 0.15)",
    color: "#86efac",
    padding: "6px 16px",
    borderRadius: "100px",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "16px",
    border: "1px solid rgba(74, 222, 128, 0.3)",
  },

  badgeIcon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "#22c55e",
    color: "white",
    fontSize: "11px",
    fontWeight: "700",
  },

  responderTitle: {
    color: "white",
    fontSize: "28px",
    fontWeight: "800",
    margin: "0",
    lineHeight: "1.3",
  },

  responderSubtitle: {
    color: "rgba(199, 210, 254, 0.8)",
    fontSize: "14px",
    marginTop: "8px",
    lineHeight: "1.5",
  },

  // Sections
  section: {
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    padding: "28px",
    marginBottom: "20px",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },

  sectionTitle: {
    color: "white",
    fontSize: "18px",
    fontWeight: "700",
    margin: "0 0 20px 0",
    paddingLeft: "16px",
    borderLeft: "4px solid",
    display: "flex",
    alignItems: "center",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "14px",
  },

  // Info Card
  infoCard: {
    background: "rgba(255, 255, 255, 0.04)",
    borderRadius: "16px",
    padding: "18px",
    transition: "all 0.3s ease",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    cursor: "default",
  },

  infoCardHighlight: {
    background: "rgba(239, 68, 68, 0.08)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
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
    letterSpacing: "0.05em",
    margin: "0 0 4px 0",
  },

  infoCardValue: {
    color: "#e2e8f0",
    fontSize: "15px",
    fontWeight: "600",
    margin: "0",
    wordBreak: "break-word",
  },

  // Critical Section
  criticalSection: {
    margin: "20px 0",
    background: "rgba(239, 68, 68, 0.04)",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid rgba(239, 68, 68, 0.1)",
  },

  criticalTitle: {
    color: "#fbbf24",
    fontSize: "16px",
    fontWeight: "700",
    margin: "0 0 16px 0",
  },

  criticalGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  criticalCard: {
    background: "rgba(0, 0, 0, 0.2)",
    borderRadius: "12px",
    padding: "16px",
    borderLeft: "4px solid",
  },

  criticalLabel: {
    color: "#94a3b8",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    margin: "0 0 6px 0",
  },

  criticalValue: {
    color: "#e2e8f0",
    fontSize: "15px",
    fontWeight: "500",
    margin: "0",
    lineHeight: "1.6",
  },

  callButton: {
    display: "inline-block",
    background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
    color: "white",
    padding: "14px 28px",
    borderRadius: "14px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "15px",
    marginTop: "20px",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 24px rgba(220, 38, 38, 0.3)",
  },

  emptyText: {
    color: "#64748b",
    fontSize: "14px",
    fontStyle: "italic",
  },

  // ======= PUBLIC VIEW =======
  pagePublic: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1e1a2e 50%, #0f172a 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "24px 16px 48px",
    fontFamily: "'Inter', 'Poppins', sans-serif",
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
    background: "rgba(239, 68, 68, 0.1)",
    border: "2px solid rgba(239, 68, 68, 0.3)",
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
    letterSpacing: "-0.02em",
  },

  publicSubtitle: {
    color: "#64748b",
    fontSize: "14px",
    marginTop: "8px",
  },

  publicCard: {
    background: "rgba(255, 255, 255, 0.04)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    padding: "24px",
    marginBottom: "16px",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },

  publicSectionTitle: {
    color: "white",
    fontSize: "17px",
    fontWeight: "700",
    margin: "0 0 20px 0",
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
    fontWeight: "500",
  },

  publicValue: {
    color: "#e2e8f0",
    fontSize: "15px",
    fontWeight: "600",
    textAlign: "right",
  },

  bloodBadge: {
    background: "rgba(239, 68, 68, 0.12)",
    color: "#f87171",
    padding: "4px 14px",
    borderRadius: "100px",
    border: "1px solid rgba(239, 68, 68, 0.25)",
    fontWeight: "700",
  },

  publicDivider: {
    height: "1px",
    background: "rgba(255, 255, 255, 0.06)",
  },

  publicCallButton: {
    display: "block",
    background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
    color: "white",
    padding: "16px",
    borderRadius: "14px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "16px",
    textAlign: "center",
    marginTop: "20px",
    boxShadow: "0 8px 24px rgba(220, 38, 38, 0.25)",
    transition: "all 0.3s ease",
  },

  // ======= RESPONDER LOGIN SECTION =======
  responderLoginSection: {
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    padding: "28px",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    textAlign: "center",
    marginTop: "8px",
  },

  lockIcon: {
    fontSize: "32px",
    marginBottom: "12px",
  },

  responderLoginText: {
    color: "#e2e8f0",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0 0 6px 0",
  },

  responderLoginSubtext: {
    color: "#64748b",
    fontSize: "13px",
    margin: "0 0 20px 0",
    lineHeight: "1.5",
  },

  responderLoginButton: {
    background: "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)",
    color: "white",
    border: "none",
    padding: "14px 32px",
    borderRadius: "14px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 8px 24px rgba(29, 78, 216, 0.3)",
    transition: "all 0.3s ease",
  },

  // Login Form
  loginFormTitle: {
    color: "white",
    fontSize: "18px",
    fontWeight: "700",
    margin: "0 0 6px 0",
  },

  loginFormSubtitle: {
    color: "#64748b",
    fontSize: "13px",
    margin: "0 0 20px 0",
  },

  loginErrorBox: {
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    color: "#f87171",
    borderRadius: "12px",
    padding: "12px 16px",
    fontSize: "13px",
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
    fontWeight: "500",
    marginBottom: "6px",
  },

  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(255, 255, 255, 0.04)",
    color: "white",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.3s ease",
    boxSizing: "border-box",
    fontFamily: "'Inter', 'Poppins', sans-serif",
  },

  submitButton: {
    background: "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)",
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius: "14px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 8px 24px rgba(29, 78, 216, 0.3)",
    transition: "all 0.3s ease",
    marginTop: "4px",
  },

  cancelButton: {
    background: "transparent",
    color: "#64748b",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "12px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

// =========================================
// GLOBAL ANIMATION STYLES
// =========================================

const animationStyles = document.createElement("style");
animationStyles.textContent = `
  @keyframes loading {
    0% { transform: translateX(-100%); }
    50% { transform: translateX(150%); }
    100% { transform: translateX(-100%); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;

if (!document.getElementById("emergency-page-animations")) {
  animationStyles.id = "emergency-page-animations";
  document.head.appendChild(animationStyles);
}

export default EmergencyPage;