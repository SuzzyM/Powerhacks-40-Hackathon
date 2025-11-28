# SafeHarbor Web Portal

A secure web portal providing community support, resources, AI chat assistance, and emergency SOS functionality.

## Security Features

- **No Indexing**: All pages include headers to prevent search engine indexing
- **Anonymization**: Community forum uses anonymous, non-traceable user IDs
- **Quick Exit**: Prominent button to immediately redirect to an innocuous website
- **Secure API Proxy**: All AI API calls are proxied through server-side endpoints
- **Session-Based Chat**: Chat history is not permanently stored
- **HTTPS Enforcement**: All traffic must use HTTPS with HSTS headers

## Technology Stack

- **Frontend**: Next.js (Pages Router) with TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: PostgreSQL (with Row-Level Security recommendations)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database (for production)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file with your environment variables:
```env
# Database (for production)
DATABASE_URL=postgresql://user:password@localhost:5432/safeharbor

# LLM API Key (for AI chat)
OPENAI_API_KEY=your_api_key_here

# Twilio (for SOS SMS notifications)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_phone_number

# SendGrid (for SOS email notifications)
SENDGRID_API_KEY=your_api_key_here
SENDGRID_FROM_EMAIL=noreply@safeharbor.example.com
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── pages/
│   ├── index.tsx              # Homepage
│   ├── auth/
│   │   └── login.tsx          # Login page (with MFA placeholder)
│   ├── community/
│   │   └── index.tsx          # Community forum list
│   ├── resources.tsx          # Resource directory
│   ├── chat.tsx               # AI chat page
│   ├── sos.tsx                # Emergency SOS page
│   └── api/
│       ├── chat.ts            # AI chat API endpoint
│       ├── forum.ts           # Forum API endpoint
│       └── sos-trigger.ts     # SOS trigger API endpoint
├── src/
│   ├── components/
│   │   └── QuickExitButton.tsx
│   ├── contexts/
│   │   └── CommunityContext.tsx
│   └── api/
│       ├── chat.ts
│       ├── forum.ts
│       └── sos-trigger.ts
└── styles/
    └── globals.css
```

## Deployment Strategy

### Frontend/API Host

Deploy to **Vercel** or **Netlify** for:
- Built-in CDN
- Automatic SSL certificates
- Serverless functions for API routes
- Easy CI/CD integration

### Database Host

Use a **Managed PostgreSQL Service**:
- **AWS RDS**: Enterprise-grade security, automated backups
- **Supabase**: PostgreSQL with built-in RLS and auth
- **Neon**: Serverless PostgreSQL

**Security Configuration:**
- Enable Row-Level Security (RLS) on all tables
- Configure firewall to only allow connections from Frontend/API host
- Use SSL/TLS for all database connections
- Enable automated security patching

### Web Application Firewall (WAF)

Implement **Cloudflare** or **AWS WAF** to protect against:
- XSS (Cross-Site Scripting)
- SQL Injection
- DDoS attacks
- Rate limiting

### CI/CD Pipeline

A GitHub Actions workflow placeholder is included. Configure:
- Automatic deployment on merge to `main` branch
- Environment variable management
- Database migration scripts
- Security scanning

## Security Implementation Notes

### Row-Level Security (RLS)

When setting up PostgreSQL, enable RLS on all tables:

```sql
-- Example: Enable RLS on forum_posts table
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous reads
CREATE POLICY "Allow anonymous reads" ON forum_posts
  FOR SELECT USING (true);

-- Create policy for anonymous writes (with validation)
CREATE POLICY "Allow anonymous writes" ON forum_posts
  FOR INSERT WITH CHECK (author_id LIKE 'anon_%');
```

### MFA/2FA Implementation

The login page includes placeholder comments for MFA. In production:
- Use TOTP (Time-based One-Time Password) via authenticator apps
- Support SMS-based 2FA as fallback (with rate limiting)
- Require MFA for all login attempts

### API Key Security

- Never expose API keys in client-side code
- Store all keys in environment variables
- Use server-side API routes to proxy LLM requests
- Rotate keys regularly
- Monitor usage for anomalies

## Development

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## License

This project is private and confidential.

## Support

For security concerns or issues, please contact the development team.

