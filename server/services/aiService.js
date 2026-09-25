import axios from "axios";

/**
 * Generate AI Triage & First-Aid Guidance based on patient medical profile
 */
export const generateAITriageAdvice = async ({
  fullName,
  bloodGroup,
  allergies,
  medicalConditions,
  medications,
  organDonor,
  gender,
}) => {
  const geminiKey = process.env.GEMINI_API_KEY;

  if (geminiKey && geminiKey.trim() !== "") {
    try {
      const prompt = `You are an expert emergency medical AI assistant (SankatMochan Triage AI).
Analyze the following patient emergency medical profile and provide rapid, high-priority triage advice for first responders and paramedics:

Patient Name: ${fullName || "Unknown"}
Blood Group: ${bloodGroup || "Unknown"}
Allergies: ${allergies || "None declared"}
Medical Conditions: ${medicalConditions || "None declared"}
Medications: ${medications || "None declared"}
Organ Donor: ${organDonor ? "Yes" : "No"}

Format your response cleanly in 3 key sections:
1. 🚨 IMMEDIATE ALERTS & CRITICAL CONTRAINDICATIONS
2. 🩺 INITIAL FIRST-AID & TRIAGE STEPS
3. 🏥 HOSPITAL PREPARATION & BLOOD REQUEST NOTES`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const aiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (aiText) return aiText;
    } catch (err) {
      console.warn("Gemini API call failed, falling back to rule engine:", err.message);
    }
  }

  // Intelligent Rule Engine Fallback (guarantees offline/fast response)
  const alerts = [];
  const triageSteps = [];
  const hospitalNotes = [];

  // Blood group guidance
  if (bloodGroup) {
    hospitalNotes.push(`• Request ${bloodGroup} Packed Red Blood Cells (PRBC) for immediate transfusion if hemorrhaging.`);
    if (bloodGroup.includes("-")) {
      hospitalNotes.push(`• Note: ${bloodGroup} is a rare Rh-negative blood type. Notify blood bank immediately.`);
    }
  }

  // Allergy alerts
  if (allergies && allergies.trim() !== "") {
    alerts.push(`⚠️ SEVERE ALLERGY WARNING: Patient reports allergies to "${allergies}". DO NOT administer related medications.`);
  } else {
    alerts.push(`ℹ️ No known drug/food allergies declared.`);
  }

  // Medical conditions
  if (medicalConditions && medicalConditions.trim() !== "") {
    alerts.push(`📋 CHRONIC CONDITION ALERT: Patient has "${medicalConditions}".`);
    const lowerCond = medicalConditions.toLowerCase();
    if (lowerCond.includes("diabet")) {
      triageSteps.push("• Measure blood glucose levels immediately (Risk of hypoglycemic shock).");
    }
    if (lowerCond.includes("asthma") || lowerCond.includes("copd") || lowerCond.includes("respiratory")) {
      triageSteps.push("• Monitor SpO2 blood oxygen and maintain clear airway.");
    }
    if (lowerCond.includes("heart") || lowerCond.includes("cardiac") || lowerCond.includes("hypertension")) {
      triageSteps.push("• Attach ECG monitor; check pulse rate and blood pressure.");
    }
  }

  // Medications
  if (medications && medications.trim() !== "") {
    alerts.push(`💊 CURRENT MEDICATIONS: "${medications}". Check for interaction risks.`);
    const lowerMed = medications.toLowerCase();
    if (lowerMed.includes("aspirin") || lowerMed.includes("warfarin") || lowerMed.includes("heparin") || lowerMed.includes("blood thinner")) {
      alerts.push("🚨 BLEEDING RISK: Patient is on blood thinners! High hemorrhage risk in trauma.");
    }
  }

  // General emergency triage steps
  triageSteps.push("• Check airway, breathing, and circulation (ABCs).");
  triageSteps.push("• Immobilize cervical spine if traumatic injury is suspected.");

  if (organDonor) {
    hospitalNotes.push("🫀 ORGAN DONOR: Registered organ donor status active.");
  }

  return `🚨 IMMEDIATE ALERTS & CONTRAINDICATIONS:
${alerts.join("\n")}

🩺 INITIAL FIRST-AID & TRIAGE STEPS:
${triageSteps.join("\n")}

🏥 HOSPITAL PREPARATION & BLOOD NOTES:
${hospitalNotes.join("\n")}`;
};
