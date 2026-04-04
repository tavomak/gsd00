# Environment Variables

## Required (All in .env.local)
```
NEXT_PUBLIC_CMS_API_URL           # Hygraph GraphQL endpoint
NEXT_PUBLIC_WP_API_URL            # WordPress GraphQL endpoint
HYGRAPH_TOKEN                     # Server-only Hygraph auth token
NEXT_PUBLIC_EMAIL_JS_SERVICE_ID   # EmailJS
NEXT_PUBLIC_EMAIL_JS_TEMPLATE_ID
NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY
NEXT_PUBLIC_GTM                   # Google Tag Manager
NEXT_PUBLIC_ENVIRONMENT_KEY       # production|development|local
RECAPTCHA_SECRET_KEY              # Server-only (no NEXT_PUBLIC_)
```

## Usage
Client: `process.env.NEXT_PUBLIC_*` • Server: `process.env.*`

## Security
Never commit `.env.local`. Use `.env.example` as template.
