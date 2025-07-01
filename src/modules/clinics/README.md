# Clinic Switcher Module

This module provides a reusable clinic switcher component that allows users to switch between different clinics they are associated with.

## Features

- **Automatic clinic loading**: Loads clinics associated with the authenticated user's email
- **Default selection**: Automatically selects the first clinic in the list
- **Reusable component**: Can be used anywhere in the application
- **Context-based state management**: Provides global access to selected clinic
- **Responsive design**: Adapts to different screen sizes

## Usage

### 1. ClinicSwitcher Component

```tsx
import { ClinicSwitcher } from "../modules/clinics";

function MyComponent() {
  return (
    <div>
      <ClinicSwitcher className="my-custom-class" />
    </div>
  );
}
```

### 2. Using the Clinic Context

```tsx
import { useClinic } from "../modules/clinics";

function MyComponent() {
  const { selectedClinic, clinics, loading } = useClinic();

  if (loading) return <div>Loading clinics...</div>;
  
  return (
    <div>
      <h1>Current Clinic: {selectedClinic?.name}</h1>
      <p>Available Clinics: {clinics.length}</p>
    </div>
  );
}
```

### 3. Programmatically Setting Clinic

```tsx
import { useClinic } from "../modules/clinics";

function MyComponent() {
  const { clinics, setSelectedClinic } = useClinic();

  const handleSelectClinic = (clinicId: number) => {
    const clinic = clinics.find(c => c.id === clinicId);
    if (clinic) {
      setSelectedClinic(clinic);
    }
  };

  return (
    <div>
      {clinics.map(clinic => (
        <button 
          key={clinic.id} 
          onClick={() => handleSelectClinic(clinic.id)}
        >
          {clinic.name}
        </button>
      ))}
    </div>
  );
}
```

## API Reference

### ClinicService Methods

- `getClinics()`: Get all clinics
- `getClinicById(id)`: Get a specific clinic by ID  
- `addClinic(dto)`: Create a new clinic
- `getClinicsByUserEmail(email)`: Get clinics associated with a user email

### ClinicContext Properties

- `selectedClinic`: Currently selected clinic (or null)
- `clinics`: Array of all available clinics for the user
- `loading`: Boolean indicating if clinics are being loaded
- `setSelectedClinic(clinic)`: Function to change the selected clinic
- `setClinics(clinics)`: Function to update the clinics list
- `setLoading(loading)`: Function to update loading state

### ClinicSwitcher Props

- `className?`: Optional CSS class name for styling

## Integration

The clinic switcher is already integrated into the main AppLayout component and will automatically appear for authenticated users with multiple clinics. For users with a single clinic, it displays the clinic name without a dropdown.

## Styling

The component uses the existing CustomSelect styling and includes additional CSS classes:

- `.clinic-switcher`: Main container
- `.clinic-switcher.single-clinic`: When user has only one clinic
- `.clinic-switcher-loading`: Loading state
- `.app-layout-clinic-switcher`: AppLayout-specific styling
- `.iz_admin-bar-clinic`: Header bar styling

Custom styles can be added by targeting these classes or by passing a custom `className` prop.