# SafeHarbor Web Portal

A secure web portal providing community support, resources, AI chat assistance, and a private self-care space (journaling & safety planning).

## Key Features

*   **Community Forum**: Anonymous, safe space for peer support.
*   **AI Chatbot**: Confidential support assistant powered by **Google Gemini 2.0 Flash**.
*   **Self-Care Tools**: Private journaling and safety planning.
*   **Resource Directory**: Curated list of support resources.
*   **Quick Exit**: Prominent button to immediately redirect to an innocuous website (Google Weather).

## Security Features

- **No Indexing**: All pages include headers to prevent search engine indexing.
- **Anonymization**: Community forum uses anonymous, non-traceable user IDs.
- **Secure API Proxy**: All AI API calls are proxied through server-side endpoints.
- **Session-Based Chat**: Chat history is not permanently stored.
- **HTTPS Enforcement**: All traffic must use HTTPS.
- **Supabase RLS**: Row-Level Security policies enforce data access rules at the database level.

## Technology Stack

- **Frontend**: Next.js (Pages Router) with TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: Supabase (PostgreSQL)
- **AI Model**: Google Gemini 2.0 Flash (via `@google/generative-ai`)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A [Supabase](https://supabase.com/) project
- A [Google AI Studio](https://aistudio.google.com/) API Key

### Installation

1.  **Clone the repository** (if applicable) or navigate to the project directory.

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env.local` file in the root directory with the following variables:

    ```env
    # Supabase Configuration
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

    # AI Chat Configuration (Google Gemini)
    GEMINI_API_KEY=your_gemini_api_key

    # Feature Flags
    ENABLE_CHAT=true
    ENABLE_FORUM=true
    ENABLE_RESOURCES=true
    ENABLE_SOS=false  # Disabled by default
    
    # Session Security
    SESSION_SECRET=your_random_32_char_string
    ```

4.  **Setup Database**:
    *   Go to your Supabase project's **SQL Editor**.
    *   Copy the contents of `supabase_schema.sql` from this project.
    *   Run the script to create the necessary tables (`forum_threads`, `forum_posts`, `journal_entries`, `safety_plans`) and RLS policies.

5.  **Run the development server**:
    ```bash
    npm run dev
    ```

6.  **Open the app**:
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── pages/
│   ├── index.tsx              # Homepage
│   ├── auth/
│   │   └── login.tsx          # Login page
│   ├── community/             # Forum pages
│   ├── resources.tsx          # Resource directory
│   ├── chat.tsx               # AI chat page
│   ├── self-care.tsx          # Journaling & Safety Plan page
│   └── api/
│       ├── chat.ts            # AI chat API (Gemini)
│       ├── forum.ts           # Forum API (Supabase)
│       └── journal.ts         # Journal API (Supabase)
├── src/
│   ├── components/            # Reusable UI components
│   ├── utils/
│   │   └── supabase.ts        # Supabase client initialization
│   └── api/                   # Backend logic implementation
├── supabase_schema.sql        # Database setup script
└── ...
```

## Deployment

### Vercel (Recommended)

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  Add the **Environment Variables** from your `.env.local` to the Vercel project settings.
4.  Deploy.

### Database Security

The project uses Supabase Row Level Security (RLS).
*   **Forum**: Public read access, anonymous write access.
*   **Journal/Safety Plans**: Private access (currently relaxed for demo purposes to allow anonymous creation).

## License

This project is private and confidential.
