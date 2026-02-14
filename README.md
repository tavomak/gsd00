# GSD Site

A modern, multilingual Next.js website built with Tailwind CSS and following Atomic Design principles.

## Technology Stack

- **Framework:** Next.js 15.0.7 (Pages Router)
- **React:** 18
- **Styling:** Tailwind CSS 3.4.1
- **Package Manager:** pnpm
- **Internationalization:** next-translate
- **Language:** JavaScript (with PropTypes)
- **Architecture:** Atomic Design Pattern

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- pnpm

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Project Structure

The project follows **Atomic Design** methodology:

```
components/
├── Atoms/          # Basic building blocks (Button, Input, Spinner, etc.)
├── Molecules/      # Simple combinations of atoms (Card, ContactForm, etc.)
└── Templates/      # Page templates

pages/              # Next.js pages
├── _app.js         # App wrapper
├── _document.js    # Document structure
├── index.js        # Home page
├── contact/        # Contact page
└── api/            # API routes

locales/            # Internationalization
├── en/             # English translations
└── es/             # Spanish translations

hooks/              # Custom React hooks
utils/              # Utility functions and constants
styles/             # Global styles and CSS modules
public/             # Static assets
```

## Code Style

### Naming Conventions

- **Components/Files:** PascalCase (`Button`, `ContactForm`)
- **Functions/Variables:** camelCase (`handleClick`, `userData`)
- **Constants:** UPPER_SNAKE_CASE (`API_URL`)
- **Hooks:** Prefix with `use` (`useNotify`, `useTranslation`)

### Component Pattern

```javascript
import PropTypes from 'prop-types';

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

### Import Order

1. React imports
2. Third-party libraries
3. Components (using @ alias)
4. Hooks
5. Utils and constants

```javascript
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useTranslation from 'next-translate/useTranslation';
import Button from '@/components/Atoms/Button';
import useNotify from '@/hooks/useNotify';
import { siteName } from '@/utils';
```

## Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_EMAIL_JS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAIL_JS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY=your_public_key
```

All client-side environment variables must be prefixed with `NEXT_PUBLIC_`.

## Internationalization

The site supports multiple languages using `next-translate`:

```javascript
import useTranslation from 'next-translate/useTranslation';

const Component = () => {
  const { t } = useTranslation('common');
  return <h1>{t('welcome_message')}</h1>;
};
```

Translation files are located in `/locales/{language}/common.json`.

## Styling

- Uses **Tailwind CSS** exclusively (no custom CSS modules except for animations)
- Primary color: `#cb820c`
- Mobile-first responsive design
- Use `@` alias for internal imports

## Linting

The project uses ESLint with Airbnb config:

```bash
pnpm lint
```

Key ESLint configurations:

- No React import needed (React 18+)
- Props spreading allowed
- Arrow functions with as-needed body style
- Default props not required

## Additional Documentation

For detailed development guidelines and agent instructions, see [AGENTS.md](AGENTS.md).

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [next-translate Documentation](https://github.com/aralroca/next-translate)
