// src/components/UI/Accordion/Accordion.jsx
import React, { useState } from "react";

interface Props {
  title: string;
  children: React.ReactNode;
}
function Accordion({ title, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className={`accordion ${isOpen ? "open" : ""}`}>
      <div className="accordion-header" onClick={toggleAccordion}>
        <span className="accordion-title">{title}</span>
        <span className="accordion-icon">{isOpen ? "-" : "+"}</span>
      </div>
      {isOpen && <div className="accordion-content">{children}</div>}
    </div>
  );
}
export default Accordion;
