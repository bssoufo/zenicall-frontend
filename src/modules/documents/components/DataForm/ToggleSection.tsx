// components/ToggleSection.tsx
import React, { ReactNode } from 'react';

interface ToggleSectionProps {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

export const ToggleSection: React.FC<ToggleSectionProps> = ({
  title,
  children,
  isOpen,
  onToggle,
}) => (
  <div className="iz_toggle-block">
    <h3 className="iz_toggle-title" onClick={onToggle}>
      {title}
    </h3>
    <div className={`iz_content-fields ${isOpen ? 'iz_is-open' : ''}`}>
      {children}
    </div>
  </div>
);
