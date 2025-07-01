import { createContext } from "react";
import Clinic from "../ClinicModel";

interface ClinicContextType {
  selectedClinic: Clinic | null;
  clinics: Clinic[];
  loading: boolean;
  setSelectedClinic: (clinic: Clinic | null) => void;
  setClinics: (clinics: Clinic[]) => void;
  setLoading: (loading: boolean) => void;
}

const initialValue: ClinicContextType = {
  selectedClinic: null,
  clinics: [],
  loading: false,
  setSelectedClinic: () => {},
  setClinics: () => {},
  setLoading: () => {},
};

export const ClinicContext = createContext<ClinicContextType>(initialValue);