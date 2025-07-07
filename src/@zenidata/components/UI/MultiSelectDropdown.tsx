/**
 * MultiSelectDropdown Component
 * 
 * A fully accessible multiselect dropdown with:
 * - Chips display for selected items in closed state
 * - Checkbox interface when opened
 * - Full keyboard navigation support
 * - ARIA accessibility compliance
 * - Customizable styling
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './MultiSelectDropdown.css';

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface MultiSelectDropdownProps {
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  maxDisplayedChips?: number;
  searchable?: boolean;
  clearable?: boolean;
  onClear?: () => void;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selectedValues,
  onChange,
  placeholder = "Select options...",
  disabled = false,
  className = "",
  id,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  maxDisplayedChips = 3,
  searchable = false,
  clearable = true,
  onClear
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownPanelRef = useRef<HTMLDivElement>(null);

  // Filter options based on search term
  const filteredOptions = searchable && searchTerm
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Get selected option labels for chips
  const selectedOptions = options.filter(option => 
    selectedValues.includes(option.value)
  );

  // Update dropdown position when opened
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Don't close if clicking on the trigger container
      if (containerRef.current && containerRef.current.contains(target)) {
        return;
      }
      
      // Don't close if clicking on the dropdown panel (now in portal)
      if (dropdownPanelRef.current && dropdownPanelRef.current.contains(target)) {
        return;
      }
      
      // Close dropdown if clicking outside both elements
      setIsOpen(false);
      setSearchTerm('');
      setFocusedIndex(-1);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Focus management when opening/closing
  useEffect(() => {
    if (isOpen) {
      if (searchable && searchInputRef.current) {
        searchInputRef.current.focus();
      } else if (listRef.current) {
        listRef.current.focus();
      }
    }
  }, [isOpen, searchable]);

  // Toggle option selection
  const toggleOption = useCallback((value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    
    onChange(newSelectedValues);
  }, [selectedValues, onChange]);

  // Remove individual chip
  const removeChip = useCallback((valueToRemove: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newSelectedValues = selectedValues.filter(v => v !== valueToRemove);
    onChange(newSelectedValues);
  }, [selectedValues, onChange]);

  // Clear all selections
  const clearAll = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    onChange([]);
    if (onClear) {
      onClear();
    }
  }, [onChange, onClear]);

  // Keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        if (!isOpen) {
          event.preventDefault();
          setIsOpen(true);
        } else if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          event.preventDefault();
          toggleOption(filteredOptions[focusedIndex].value);
        }
        break;
        
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
        triggerRef.current?.focus();
        break;
        
      case 'ArrowDown':
        if (!isOpen) {
          event.preventDefault();
          setIsOpen(true);
        } else {
          event.preventDefault();
          setFocusedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
        
      case 'ArrowUp':
        if (isOpen) {
          event.preventDefault();
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        }
        break;
        
      case 'Home':
        if (isOpen) {
          event.preventDefault();
          setFocusedIndex(0);
        }
        break;
        
      case 'End':
        if (isOpen) {
          event.preventDefault();
          setFocusedIndex(filteredOptions.length - 1);
        }
        break;
        
      default:
        // Let search input handle character input
        break;
    }
  }, [disabled, isOpen, focusedIndex, filteredOptions, toggleOption]);

  // Generate display text for trigger button
  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }
    
    if (selectedValues.length <= maxDisplayedChips) {
      return null; // Show chips instead
    }
    
    return `${selectedValues.length} selected`;
  };

  const displayText = getDisplayText();

  return (
    <div 
      ref={containerRef}
      className={`multiselect-dropdown ${className} ${disabled ? 'disabled' : ''} ${isOpen ? 'open' : ''}`}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button */}
      <div
        ref={triggerRef}
        className="multiselect-trigger"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        id={id}
        aria-disabled={disabled}
      >
        <div className="multiselect-display">
          {displayText ? (
            <span className="multiselect-placeholder">{displayText}</span>
          ) : (
            <div className="multiselect-chips">
              {selectedOptions.slice(0, maxDisplayedChips).map(option => (
                <span key={option.value} className="multiselect-chip">
                  <span className="chip-label">{option.label}</span>
                  <button
                    type="button"
                    className="chip-remove"
                    onClick={(e) => removeChip(option.value, e)}
                    aria-label={`Remove ${option.label}`}
                    tabIndex={-1}
                  >
                    <i className="fas fa-times" aria-hidden="true"></i>
                  </button>
                </span>
              ))}
              {selectedValues.length > maxDisplayedChips && (
                <span className="multiselect-chip overflow-indicator">
                  +{selectedValues.length - maxDisplayedChips} more
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="multiselect-actions">
          {clearable && selectedValues.length > 0 && (
            <button
              type="button"
              className="multiselect-clear"
              onClick={clearAll}
              aria-label="Clear all selections"
              tabIndex={-1}
            >
              <i className="fas fa-times" aria-hidden="true"></i>
            </button>
          )}
          <span className="multiselect-arrow">
            <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`} aria-hidden="true"></i>
          </span>
        </div>
      </div>

      {/* Dropdown Panel - Portal rendered to body */}
      {isOpen && createPortal(
        <div 
          ref={dropdownPanelRef}
          className="multiselect-panel"
          style={{
            position: 'absolute',
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            zIndex: 9999
          }}
        >
          {searchable && (
            <div className="multiselect-search">
              <input
                ref={searchInputRef}
                type="text"
                className="search-input"
                placeholder="Search options..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          )}
          
          <ul
            ref={listRef}
            className="multiselect-options"
            role="listbox"
            aria-multiselectable="true"
            tabIndex={-1}
          >
            {filteredOptions.length === 0 ? (
              <li className="multiselect-option no-options" role="option">
                {searchTerm ? 'No matching options' : 'No options available'}
              </li>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = selectedValues.includes(option.value);
                const isFocused = index === focusedIndex;
                
                return (
                  <li
                    key={option.value}
                    className={`multiselect-option ${isSelected ? 'selected' : ''} ${isFocused ? 'focused' : ''} ${option.disabled ? 'disabled' : ''}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => !option.disabled && toggleOption(option.value)}
                  >
                    <div className="option-checkbox">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => !option.disabled && toggleOption(option.value)}
                        disabled={option.disabled}
                        tabIndex={-1}
                        aria-hidden="true"
                      />
                      <span className="checkbox-checkmark">
                        <i className="fas fa-check" aria-hidden="true"></i>
                      </span>
                    </div>
                    <span className="option-label">{option.label}</span>
                  </li>
                );
              })
            )}
          </ul>
        </div>,
        document.body
      )}
    </div>
  );
};

export default MultiSelectDropdown;