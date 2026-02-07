---
name: portal-tailwind
description: Portal frontend styling with Tailwind CSS. Use when creating portal components, pages, or styling. All Tailwind classes must use tw- prefix. Never mix with Bootstrap dashboard components.
---

# Portal Tailwind Styling

The portal uses Tailwind CSS while the main dashboard uses Bootstrap. These MUST remain separate.

## Critical Rule

**ALL Tailwind classes must use the `tw-` prefix.**

```jsx
// CORRECT
<div className="tw-bg-white tw-rounded-lg tw-shadow tw-p-4">

// WRONG - will conflict with Bootstrap
<div className="bg-white rounded-lg shadow p-4">
```

## Scope

| Area | Styling | Can Use Tailwind? |
|------|---------|-------------------|
| `frontend/src/pages/portal/**` | Tailwind CSS | Yes |
| `frontend/src/components/portal/**` | Tailwind CSS | Yes |
| `frontend/src/layouts/PortalLayout.jsx` | Tailwind CSS | Yes |
| `frontend/src/pages/dashboards/**` | Bootstrap + SCSS | **No** |
| `frontend/src/components/**` (non-portal) | Bootstrap + SCSS | **No** |

## Component Template

```jsx
import React from 'react';
import '../../styles/portal-tailwind.css';

export default function ComponentName({ prop1, prop2 }) {
  return (
    <div className="tw-bg-white tw-rounded-lg tw-shadow">
      {/* Component content */}
    </div>
  );
}
```

## Design System

### Colors
- Primary: `tw-bg-indigo-600`, `tw-text-indigo-600`
- Text primary: `tw-text-gray-900`
- Text secondary: `tw-text-gray-700`
- Text muted: `tw-text-gray-500`
- Backgrounds: `tw-bg-white`, `tw-bg-gray-50`, `tw-bg-gray-100`

### Status Colors
- Success: `tw-bg-green-100 tw-text-green-800`
- Warning: `tw-bg-yellow-100 tw-text-yellow-800`
- Error: `tw-bg-red-100 tw-text-red-800`
- Info: `tw-bg-blue-100 tw-text-blue-800`

### Typography
- Page title: `tw-text-2xl tw-font-bold tw-text-gray-900`
- Section title: `tw-text-lg tw-font-medium tw-text-gray-900`
- Body: `tw-text-sm tw-text-gray-700`
- Small: `tw-text-xs tw-text-gray-500`

### Spacing
- Card padding: `tw-p-4` to `tw-p-6`
- Section gaps: `tw-space-y-4` to `tw-space-y-6`
- Container: `tw-max-w-7xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8`

## Portal Component Classes

Pre-defined component classes in `portal-tailwind.css`:

```jsx
<div className="portal-card">
  <div className="portal-card-header">Title</div>
  <div className="portal-card-body">Content</div>
</div>

<button className="portal-btn-primary">Primary</button>
<button className="portal-btn-secondary">Secondary</button>

<span className="portal-badge-success">Active</span>
<span className="portal-badge-warning">Pending</span>
```

## Icons

Use Heroicons (`@heroicons/react`):

```jsx
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

<CheckCircleIcon className="tw-h-5 tw-w-5 tw-text-green-500" />
```

## Common Patterns

### Card
```jsx
<div className="tw-bg-white tw-rounded-lg tw-shadow tw-p-6">
  <h3 className="tw-text-lg tw-font-medium tw-text-gray-900">Title</h3>
  <p className="tw-mt-2 tw-text-sm tw-text-gray-500">Description</p>
</div>
```

### Button
```jsx
<button className="tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-border tw-border-transparent tw-text-sm tw-font-medium tw-rounded-md tw-shadow-sm tw-text-white tw-bg-indigo-600 hover:tw-bg-indigo-700">
  Click me
</button>
```

### Input
```jsx
<input
  type="text"
  className="tw-block tw-w-full tw-rounded-md tw-border-0 tw-py-1.5 tw-text-gray-900 tw-shadow-sm tw-ring-1 tw-ring-inset tw-ring-gray-300 placeholder:tw-text-gray-400 focus:tw-ring-2 focus:tw-ring-inset focus:tw-ring-indigo-600 sm:tw-text-sm"
/>
```

## Files Reference

- `frontend/src/styles/portal-tailwind.css` - Portal styles
- `frontend/src/components/portal/` - Portal components
- `frontend/src/pages/portal/` - Portal pages
- `documentation/technical/frontend/design-system.md` - Full design system

## Fetching Tailwind UI Components

```bash
node frontend/scripts/fetch-tailwind-ui.js "<url>"
```

Then convert to React with `tw-` prefix on all classes.
