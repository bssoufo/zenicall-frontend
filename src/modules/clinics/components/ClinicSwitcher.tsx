import React from "react";
import CustomSelect from "../../../@zenidata/components/CustomSelect";
import { useClinic } from "../hooks/useClinic";

interface ClinicSwitcherProps {
  className?: string;
}

export const ClinicSwitcher: React.FC<ClinicSwitcherProps> = ({ className }) => {
  const { selectedClinic, clinics, loading, setSelectedClinic } = useClinic();

  const handleClinicChange = (event: { target: { name?: string; value: string } }) => {
    if (!clinics) return;
    const clinic = clinics.find(c => c.id === event.target.value);
    if (clinic) {
      setSelectedClinic(clinic);
    }
  };

  if (loading) {
    return <div className="clinic-switcher-loading">Loading clinics...</div>;
  }

  if (!clinics || clinics.length === 0) {
    return null;
  }

  if (clinics.length === 1) {
    return (
      <div className={`clinic-switcher single-clinic ${className || ""}`}>
        <span className="clinic-name">{clinics[0].name}</span>
      </div>
    );
  }

  const options = clinics.map(clinic => ({
    value: clinic.id,
    label: clinic.name
  }));

  return (
    <div className={`clinic-switcher ${className || ""}`}>
      <CustomSelect
        options={options}
        value={selectedClinic?.id || ""}
        onChange={handleClinicChange}
        placeholder="Select a clinic"
        isClearable={false}
      />
    </div>
  );
};