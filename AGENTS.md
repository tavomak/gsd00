# GSD Site - Agent Guidelines

## Development Commands

### Package Manager

- Uses **pnpm** as the package manager (configured in package.json:87)

### Core Commands

```bash
pnpm dev       # Start Next.js development server
pnpm build     # Build for production
pnpm start     # Start production server
pnpm lint      # Run ESLint on the codebase
```

### Testing

- No test scripts configured. To add testing, add to package.json:
  ```json
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:file": "jest --testPathPattern="
  }
  ```

## Code Style Guidelines

### Technology Stack

- **Framework**: Next.js 15.0.7 with React 18
- **Styling**: Tailwind CSS v3.4.1
- **Language**: JavaScript (no TypeScript)
- **Package Manager**: pnpm

### Code Formatting (Prettier)

- Trailing commas: ES5, Tab width: 2, Semicolons: required, Quotes: single

### Linting Rules (ESLint)

- Config: Airbnb + Airbnb Hooks + Next.js + Prettier
- Key rules:
  - `react/react-in-jsx-scope`: off (not needed in React 18)
  - `react/jsx-props-no-spreading`: off
  - `camelcase`: off
  - `arrow-body-style`: as-needed
  - `react/require-default-props`: off
  - `no-restricted-exports`: prevents default exports without explicit declaration
  - File extensions: .js, .jsx, .tsx allowed

### Import Order

```javascript
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useTranslation from 'next-translate/useTranslation';
import Button from '@/components/Atoms/Button';
import useNotify from '@/hooks/useNotify';
import { siteName } from '@/utils';
```

### Component Structure (Atomic Design)

- Folders: `ComponentName/index.js` + `ComponentName/ComponentName.js`
- Default export for main component, named exports for variations

### Naming Conventions

- Components/Files: PascalCase (Button, ContactForm)
- Functions/Variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Hooks: prefix with `use`, return arrays for tuple-like usage

### Component Pattern

```javascript
const ComponentName = ({
  children,
  loading = false,
  className = '',
  onClick,
}) => (
  <div className={className} onClick={onClick}>
    {loading ? <Spinner /> : children}
  </div>
);

ComponentName.propTypes = {
  children: PropTypes.node.isRequired,
  loading: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default ComponentName;
```

### Error Handling

- Use try-catch for async operations
- Implement loading states
- Use `useNotify` hook for user notifications
- Console logging allowed (eslint-disable when needed)

### Environment Variables

- Prefix with `NEXT_PUBLIC_`: `process.env.NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY`

### Styling

- Tailwind CSS only (no custom CSS)
- Primary color: `#cb820c` (primary-color in tailwind.config.js)
- Mobile-first responsive design
- Use template literals for dynamic className

### File Paths

- Use `@` alias: `@/components/Atoms/Button`, `@/hooks/useNotify`, `@/utils`

### Internationalization

- Uses `next-translate`
- Hook: `useTranslation('common')`
- Keys: `t('key_name')`

### Performance

- Next.js Image component for images
- Static generation timeout: 1000ms

### SEO

- Next.js Head for meta tags
- Script component with dangerouslySetInnerHTML for structured data
- Open Graph, Twitter Card, canonical URLs, hreflang

## Important Notes

- No TypeScript - use PropTypes for prop validation
- Follow Atomic Design structure
- Always use @ alias for internal imports
- All async ops need loading/error states
- Use existing notification system
