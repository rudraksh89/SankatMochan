import { useEffect, useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";

import PersonalInfo from "../components/medical/PersonalInfo";
import MedicalInfo from "../components/medical/MedicalInfo";
import EmergencyContacts from "../components/medical/EmergencyContacts";
import InsuranceInfo from "../components/medical/InsuranceInfo";
import MedicalDocuments from "../components/medical/MedicalDocuments";
import ProfileProgress from "../components/medical/ProfileProgress";
import SaveButton from "../components/medical/SaveButton";

import api from "../api/axios";

const MedicalProfile = () => {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [profile, setProfile] = useState({
    bloodGroup: "",
    dateOfBirth: "",
    gender: "Male",
    height: "",
    weight: "",
    allergies: "",
    medicalConditions: "",
    medications: "",
    organDonor: false,
    address: "",
  });

  const [insurance, setInsurance] = useState({
    provider: "",
    policyNumber: "",
    policyHolder: "",
    validTill: "",
  });

  const [documents, setDocuments] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [
        profileRes,
        insuranceRes,
        documentRes,
        emergencyRes,
      ] = await Promise.allSettled([
        api.get("/profile"),
        api.get("/insurance"),
        api.get("/documents"),
        api.get("/emergency"),
      ]);

      // Profile
      if (profileRes.status === "fulfilled") {
        const data = profileRes.value.data;

        console.log("Profile API:", data.profile);

        setUser(data.user);

        setProfile({
          ...data.profile,
          dateOfBirth: data.profile.dateOfBirth
            ? data.profile.dateOfBirth.split("T")[0]
            : "",
        });
      }

      // Insurance
      if (insuranceRes.status === "fulfilled") {
        const data = insuranceRes.value.data;

        console.log("Insurance API:", data.insurance);

        setInsurance({
          ...data.insurance,
          validTill: data.insurance.validTill
            ? data.insurance.validTill.split("T")[0]
            : "",
        });
      }

      // Documents
      if (documentRes.status === "fulfilled") {
        console.log("Documents API:", documentRes.value.data.documents);

        setDocuments(documentRes.value.data.documents || []);
      }

      // Emergency
      if (emergencyRes.status === "fulfilled") {
        console.log("Emergency API:", emergencyRes.value.data.contacts);

        setEmergencyContacts(emergencyRes.value.data.contacts || []);
      }

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("React Profile State:", profile);
  }, [profile]);

  useEffect(() => {
    console.log("React Insurance State:", insurance);
  }, [insurance]);

  useEffect(() => {
    console.log("React Emergency State:", emergencyContacts);
  }, [emergencyContacts]);

  useEffect(() => {
    console.log("React Documents State:", documents);
  }, [documents]);

  const saveInsurance = async () => {
    try {
      await api.put("/insurance", insurance);
    } catch {
      await api.post("/insurance", insurance);
    }
  };

  const saveProfile = async () => {
    console.log("Sending profile:", profile);
    try {
      try {
        await api.put("/profile", profile);
      } catch (err) {
        if (err.response?.status === 404) {
          await api.post("/profile", profile);
        } else {
          throw err;
        }
      }

      await saveInsurance();

      alert("Profile Updated Successfully");

      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">

        <ProfileProgress
          profile={profile}
          insurance={insurance}
          emergencyContacts={emergencyContacts}
          documents={documents}
        />

        <PersonalInfo
          user={user}
          profile={profile}
          setProfile={setProfile}
        />

        <MedicalInfo
          profile={profile}
          setProfile={setProfile}
        />

        <EmergencyContacts
          emergencyContacts={emergencyContacts}
          setEmergencyContacts={setEmergencyContacts}
        />

        <InsuranceInfo
          insurance={insurance}
          setInsurance={setInsurance}
        />

        <MedicalDocuments
          documents={documents}
          setDocuments={setDocuments}
        />

        <SaveButton saveProfile={saveProfile} />

      </div>
    </DashboardLayout>
  );
};

export default MedicalProfile;