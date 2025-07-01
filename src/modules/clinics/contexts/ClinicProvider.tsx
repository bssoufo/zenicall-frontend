import React, { useState, useContext, useEffect } from "react";
import { ClinicContext } from "./ClinicContext";
import Clinic from "../ClinicModel";
import ClinicService from "../ClinicService";
import { AuthContext } from "../../auth/contexts/AuthContext";

interface ClinicProviderProps {
  children: React.ReactNode;
}

export const ClinicProvider: React.FC<ClinicProviderProps> = ({ children }) => {
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      loadUserClinics();
    }
  }, [isAuthenticated, user]);

  const loadUserClinics = async () => {
    try {
      setLoading(true);
      const userClinics = await ClinicService.getClinicsByUserEmail(user.email);
      
      // Ensure we always have an array
      const clinicsArray = Array.isArray(userClinics) ? userClinics : [];
      setClinics(clinicsArray);
      
      // Set the first clinic as selected by default
      if (clinicsArray.length > 0 && !selectedClinic) {
        setSelectedClinic(clinicsArray[0]);
      }
    } catch (error) {
      console.error("Error loading user clinics:", error);
      setClinics([]); // Ensure we set an empty array on error
    } finally {
      setLoading(false);
    }
  };

  const value = {
    selectedClinic,
    clinics,
    loading,
    setSelectedClinic,
    setClinics,
    setLoading,
  };

  return (
    <ClinicContext.Provider value={value}>
      {children}
    </ClinicContext.Provider>
  );
};