import React from "react";
import Select, { Props as SelectProps, SingleValue } from "react-select";

interface OptionType {
  value: string;
  label: string;
}

interface CustomSelectProps {
  name?: string;
  value?: string;
  options?: OptionType[];
  onChange?: (event: { target: { name?: string; value: string } }) => void;
  placeholder?: string;
  isClearable?: boolean;
}

const customStyles: SelectProps<OptionType>["styles"] = {
  control: (provided, state) => ({
    ...provided,
    height: "40px",
    minHeight: "40px",
    borderRadius: "8px",
    borderColor: state.isFocused ? "#888" : "#ccc",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#888",
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: "40px",
    padding: "0 8px",
  }),
  input: (provided) => ({
    ...provided,
    margin: "0px",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: "40px",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: "4px",
  }),
};

const CustomSelect: React.FC<CustomSelectProps> = ({
  name = "",
  value = "",
  options = [],
  onChange = () => null,
  placeholder = "",
  isClearable = true,
}) => {
  const handleSelectChange = (selectedOption: SingleValue<OptionType>) => {
    if (onChange) {
      onChange({
        target: { name, value: selectedOption ? selectedOption.value : "" },
      });
    }
  };

  return (
    <Select
      name={name}
      value={options.find((opt) => opt.value === value) || null}
      onChange={handleSelectChange}
      options={options}
      placeholder={placeholder}
      isClearable={isClearable}
      styles={customStyles}
    />
  );
};

export default CustomSelect;
