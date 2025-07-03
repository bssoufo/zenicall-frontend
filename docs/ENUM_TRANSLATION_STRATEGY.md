# Backend Enum Translation Strategy

## Overview

This document outlines the standardized approach for translating backend enum values in the ZeniCall frontend application. The strategy leverages the existing i18next infrastructure to provide consistent, reusable, and maintainable enum translations.

## Architecture

### 1. Translation Files Structure

```
src/modules/{module}/i18n/
├── en.json
└── fr.json
```

Each translation file contains an `enums` section:

```json
{
  "enums": {
    "callReason": {
      "New Appointment": "Nouveau RDV",
      "General Message": "Message général",
      "Other": "Autre"
    },
    "callStatus": {
      "New": "Nouveau",
      "In Progress": "En cours",
      "Done": "Terminé"
    }
  }
}
```

### 2. Utility Functions

Located at: `src/@zenidata/utils/enumTranslation.ts`

**Core Functions:**
- `translateEnum()` - Generic enum translation
- `translateCallReason()` - Specific call reason translation
- `translateCallStatus()` - Specific call status translation
- `getEnumOptions()` - Get all enum options for dropdowns

## Usage Examples

### Basic Usage

```tsx
import { useTranslation } from 'react-i18next';
import { translateCallReason, translateCallStatus } from '@zenidata/utils/enumTranslation';

const MyComponent = () => {
  const { t } = useTranslation(['call-logs']);
  
  const callLog = {
    reason_for_call: 'New Appointment',
    status: 'In Progress'
  };
  
  return (
    <div>
      <span>Reason: {translateCallReason(callLog.reason_for_call, t)}</span>
      <span>Status: {translateCallStatus(callLog.status, t)}</span>
    </div>
  );
};
```

### Generic Enum Translation

```tsx
import { translateEnum } from '@zenidata/utils/enumTranslation';

const translatedValue = translateEnum(
  'URGENT',           // Backend enum value
  'priority',         // Enum type
  t,                  // Translation function
  'Unknown Priority'  // Fallback (optional)
);
```

### Dropdown Options Generation

```tsx
import { getEnumOptions } from '@zenidata/utils/enumTranslation';

const ReasonSelect = () => {
  const { t } = useTranslation(['call-logs']);
  const reasonOptions = getEnumOptions('callReason', t);
  
  return (
    <select>
      {reasonOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
```

## Supported Enum Types

| Enum Type | Namespace | Description |
|-----------|-----------|-------------|
| `callReason` | call-logs | Call reasons (New Appointment, Emergency, etc.) |
| `callStatus` | call-logs | Call statuses (New, In Progress, Done, etc.) |
| `priority` | core | Priority levels (Low, Medium, High, etc.) |
| `userRole` | auth | User roles (Admin, Manager, User, etc.) |
| `notificationType` | core | Notification types (Info, Warning, Error, etc.) |

## Adding New Enum Types

### 1. Update Translation Files

Add the new enum to the appropriate namespace:

```json
// src/modules/your-module/i18n/en.json
{
  "enums": {
    "yourNewEnum": {
      "BACKEND_VALUE_1": "Human Readable Label 1",
      "BACKEND_VALUE_2": "Human Readable Label 2"
    }
  }
}
```

### 2. Update Utility Types

Add the new enum type to `enumTranslation.ts`:

```typescript
export type SupportedEnumType = 
  | 'callReason' 
  | 'callStatus'
  | 'yourNewEnum';  // Add here

const ENUM_NAMESPACE_MAP: Record<SupportedEnumType, string> = {
  // ... existing mappings
  yourNewEnum: 'your-module'  // Add mapping
};
```

### 3. Create Specific Helper (Optional)

For frequently used enums, create a specific helper:

```typescript
export const translateYourEnum = (
  value: string | null | undefined,
  t: TFunction
): string => {
  return translateEnum(value, 'yourNewEnum', t, 'Default Value');
};
```

## Benefits

### ✅ **Consistency**
- Standardized approach across all modules
- Consistent fallback handling
- Unified translation key structure

### ✅ **Reusability**
- Generic utility functions
- Module-agnostic design
- Easy to extend for new enum types

### ✅ **Maintainability**
- Centralized translation logic
- Easy to update translations
- Type-safe enum handling

### ✅ **Performance**
- Leverages existing i18next infrastructure
- No additional dependencies
- Efficient translation caching

## Migration Guide

### From Hardcoded Mappings

**Before:**
```tsx
const getStatusLabel = (status: string) => {
  const labels = {
    'NEW': 'Nouveau',
    'IN_PROGRESS': 'En cours'
  };
  return labels[status] || status;
};
```

**After:**
```tsx
import { translateCallStatus } from '@zenidata/utils/enumTranslation';

const getStatusLabel = (status: string) => {
  return translateCallStatus(status, t);
};
```

### From Component-Specific Translation

**Before:**
```tsx
const reasonLabel = t(`myComponent.reason.${reason}`);
```

**After:**
```tsx
const reasonLabel = translateCallReason(reason, t);
```

## Best Practices

1. **Always use the utility functions** instead of direct i18next calls for enums
2. **Provide meaningful fallbacks** for unknown enum values
3. **Add new enum types** to the utility rather than creating component-specific logic
4. **Use TypeScript types** to ensure enum type safety
5. **Document new enum types** in this strategy guide

## Example Implementation

See the implementation in:
- `src/modules/call-logs/components/DashboardCallReasonDistribution.tsx`
- Translation files in `src/modules/call-logs/i18n/`
- Utility functions in `src/@zenidata/utils/enumTranslation.ts`

This strategy ensures consistent, maintainable, and scalable enum translation across the entire application.