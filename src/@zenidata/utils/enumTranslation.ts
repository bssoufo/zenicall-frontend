/**
 * Utility for translating backend enums consistently across the application
 * 
 * This utility provides a standardized approach for translating backend enum values
 * using the existing i18next infrastructure with namespace-based translations.
 */

import { TFunction } from 'i18next';

/**
 * Supported enum types that can be translated
 */
export type SupportedEnumType = 
  | 'callReason' 
  | 'callStatus'
  | 'priority'
  | 'userRole'
  | 'notificationType';

/**
 * Translation namespace mapping for different enum types
 */
const ENUM_NAMESPACE_MAP: Record<SupportedEnumType, string> = {
  callReason: 'call-logs',
  callStatus: 'call-logs', 
  priority: 'core',
  userRole: 'auth',
  notificationType: 'core'
};

/**
 * Translates a backend enum value to a human-readable localized string
 * 
 * @param enumValue - The enum value from backend (e.g., "NEW_APPOINTMENT", "IN_PROGRESS")
 * @param enumType - The type of enum to translate
 * @param t - The i18next translation function
 * @param fallback - Optional fallback value if translation not found
 * @returns Translated enum value or fallback
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const { t } = useTranslation(['call-logs']);
 * const translatedReason = translateEnum('New Appointment', 'callReason', t);
 * // Returns: "Nouveau RDV" (in French) or "New Appointment" (in English)
 * 
 * // With fallback
 * const translatedStatus = translateEnum('UNKNOWN_STATUS', 'callStatus', t, 'Unknown');
 * // Returns: "Unknown" if translation not found
 * ```
 */
export const translateEnum = (
  enumValue: string | null | undefined,
  enumType: SupportedEnumType,
  t: TFunction,
  fallback?: string
): string => {
  // Handle null/undefined values
  if (!enumValue) {
    return fallback || 'N/A';
  }

  // Get the appropriate namespace for this enum type
  const namespace = ENUM_NAMESPACE_MAP[enumType];
  
  // Try multiple formats to handle backend variations
  const possibleKeys = [
    `${namespace}:enums.${enumType}.${enumValue}`, // Exact match
    `${namespace}:enums.${enumType}.${enumValue.replace(/_/g, ' ')}`, // SNAKE_CASE to Space Case
    `${namespace}:enums.${enumType}.${enumValue.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}` // Proper Case
  ];
  
  // Try each possible translation key
  for (const key of possibleKeys) {
    const translated = t(key, '');
    if (translated && translated !== key) {
      return translated;
    }
  }
  
  // If no translation found, return fallback or formatted value
  if (fallback) {
    return fallback;
  }
  
  // As last resort, format the enum value nicely
  return enumValue.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Utility for translating call reasons specifically
 * This is a convenience wrapper for the most common use case
 * 
 * @param reason - Call reason from backend
 * @param t - Translation function
 * @returns Translated call reason
 */
export const translateCallReason = (
  reason: string | null | undefined,
  t: TFunction
): string => {
  return translateEnum(reason, 'callReason', t, 'Non spécifié');
};

/**
 * Utility for translating call statuses specifically
 * 
 * @param status - Call status from backend  
 * @param t - Translation function
 * @returns Translated call status
 */
export const translateCallStatus = (
  status: string | null | undefined,
  t: TFunction
): string => {
  return translateEnum(status, 'callStatus', t, 'Inconnu');
};

/**
 * Hook for getting enum translation functions with automatic namespace loading
 * 
 * @param enumType - The enum type to prepare translations for
 * @returns Object with translation functions
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { translateReason, translateStatus } = useEnumTranslations();
 *   
 *   return (
 *     <div>
 *       <span>{translateReason(callLog.reason_for_call)}</span>
 *       <span>{translateStatus(callLog.status)}</span>
 *     </div>
 *   );
 * };
 * ```
 */
export const useEnumTranslations = () => {
  // This would require useTranslation hook, but we keep it as utility functions
  // for maximum flexibility. Components can call useTranslation themselves.
  
  return {
    translateEnum,
    translateCallReason,
    translateCallStatus
  };
};

/**
 * Validates if an enum type is supported by the translation system
 * 
 * @param enumType - The enum type to validate
 * @returns True if supported, false otherwise
 */
export const isSupportedEnumType = (enumType: string): enumType is SupportedEnumType => {
  return Object.keys(ENUM_NAMESPACE_MAP).includes(enumType as SupportedEnumType);
};

/**
 * Gets all available enum values for a specific type from translations
 * Useful for generating select options, validation, etc.
 * 
 * @param enumType - The enum type
 * @param t - Translation function  
 * @returns Array of {value, label} objects
 */
export const getEnumOptions = (
  enumType: SupportedEnumType,
  t: TFunction
): Array<{value: string; label: string}> => {
  const namespace = ENUM_NAMESPACE_MAP[enumType];
  
  // This would need to be implemented based on the specific translation structure
  // For now, we provide the interface for future implementation
  
  // Example implementation for callReason:
  if (enumType === 'callReason') {
    const reasons = [
      'New Appointment',
      'Cancellation', 
      'Reschedule',
      'General Message',
      'Emergency',
      'Other'
    ];
    
    return reasons.map(reason => ({
      value: reason,
      label: translateEnum(reason, enumType, t)
    }));
  }
  
  return [];
};