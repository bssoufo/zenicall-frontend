/**
 * React hook for backend enum translation
 * 
 * Provides convenient hooks for translating backend enum values with automatic
 * namespace loading and optimized translation functions.
 */

import { useTranslation } from 'react-i18next';
import { 
  translateEnum, 
  translateCallReason, 
  translateCallStatus,
  SupportedEnumType 
} from '../utils/enumTranslation';

/**
 * Main hook for enum translation with automatic namespace management
 * 
 * @param namespaces - Additional translation namespaces to load
 * @returns Object with translation functions
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { translateReason, translateStatus, t } = useEnumTranslation();
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
export const useEnumTranslation = (namespaces: string[] = []) => {
  // Always include core namespaces for enum translations
  const coreNamespaces = ['call-logs', 'core', 'auth'];
  const allNamespaces = [...new Set([...coreNamespaces, ...namespaces])];
  
  const { t } = useTranslation(allNamespaces);

  return {
    // Generic function for any enum type
    translateEnum: (
      enumValue: string | null | undefined,
      enumType: SupportedEnumType,
      fallback?: string
    ) => translateEnum(enumValue, enumType, t, fallback),

    // Convenience functions for common enums
    translateReason: (reason: string | null | undefined) => 
      translateCallReason(reason, t),
    
    translateStatus: (status: string | null | undefined) => 
      translateCallStatus(status, t),

    // Expose the raw translation function for custom usage
    t
  };
};

/**
 * Specialized hook for call log related enums
 * Automatically loads call-logs namespace and provides optimized functions
 * 
 * @example
 * ```tsx
 * const CallLogItem = ({ callLog }) => {
 *   const { reason, status } = useCallLogEnums();
 *   
 *   return (
 *     <div>
 *       <span>Reason: {reason(callLog.reason_for_call)}</span>
 *       <span>Status: {status(callLog.status)}</span>
 *     </div>
 *   );
 * };
 * ```
 */
export const useCallLogEnums = () => {
  const { t } = useTranslation(['call-logs']);

  return {
    reason: (value: string | null | undefined) => translateCallReason(value, t),
    status: (value: string | null | undefined) => translateCallStatus(value, t),
    t
  };
};

/**
 * Hook for getting enum options for dropdowns/selects
 * 
 * @param enumType - The enum type to get options for
 * @returns Array of {value, label} objects for use in select components
 * 
 * @example
 * ```tsx
 * const ReasonFilter = () => {
 *   const reasonOptions = useEnumOptions('callReason');
 *   
 *   return (
 *     <select>
 *       <option value="">All Reasons</option>
 *       {reasonOptions.map(option => (
 *         <option key={option.value} value={option.value}>
 *           {option.label}
 *         </option>
 *       ))}
 *     </select>
 *   );
 * };
 * ```
 */
export const useEnumOptions = (enumType: SupportedEnumType) => {
  const { translateEnum, t } = useEnumTranslation();

  // Define enum values based on type
  const getEnumValues = (type: SupportedEnumType): string[] => {
    switch (type) {
      case 'callReason':
        return [
          'NEW_APPOINTMENT',
          'CANCELLATION', 
          'RESCHEDULE',
          'GENERAL_MESSAGE',
          'EMERGENCY',
          'OTHER'
        ];
      case 'callStatus':
        return ['NEW', 'IN_PROGRESS', 'DONE', 'ARCHIVED'];
      case 'callbackPreference':
        return ['MORNING', 'AFTERNOON', 'EVENING', 'ANYTIME'];
      default:
        return [];
    }
  };

  const enumValues = getEnumValues(enumType);
  
  return enumValues.map(value => ({
    value,
    label: translateEnum(value, enumType)
  }));
};

/**
 * Hook for dynamic enum translation with runtime enum type
 * Useful when enum type is determined at runtime
 * 
 * @param enumType - The enum type (can change during component lifecycle)
 * @returns Translation function for the specified enum type
 * 
 * @example
 * ```tsx
 * const DynamicEnumDisplay = ({ enumType, enumValue }) => {
 *   const translateDynamic = useDynamicEnumTranslation(enumType);
 *   
 *   return <span>{translateDynamic(enumValue)}</span>;
 * };
 * ```
 */
export const useDynamicEnumTranslation = (enumType: SupportedEnumType) => {
  const { translateEnum } = useEnumTranslation();
  
  return (enumValue: string | null | undefined, fallback?: string) => 
    translateEnum(enumValue, enumType, fallback);
};