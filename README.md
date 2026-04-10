# EdAIBuilder

**Talk to Build. Launch to Learn.**

A conversational AI platform for students in grades 6-12 to build real websites by describing their ideas in plain English. No coding required.

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/aidrisedai/edaibuilder.git
cd edaibuilder
npm install
```

### 2. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The landing page, login, and signup pages work immediately — no configuration needed.

### 3. (Optional) Configure services for full functionality

Copy the env template and fill in your keys:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your credentials:

```env
# Supabase — get these from https://supabase.com (create a free project)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Anthropic — get from https://console.anthropic.com
ANTHROPIC_API_KEY=sk-ant-...

# GitHub — create a Personal Access Token at https://github.com/settings/tokens
GITHUB_TOKEN=ghp_...
GITHUB_ORG=your-github-username

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set up the database

Run the SQL migration in your Supabase project's SQL Editor:

```bash
# Copy the contents of this file into Supabase SQL Editor and run it:
supabase/migrations/00001_initial_schema.sql
```

## What's Included

| Feature | Description |
|---------|-------------|
| Landing Page | Animated hero, features, how-it-works, testimonials, CTA |
| Auth System | Student (username + class code) and teacher (email + password) |
| Student Dashboard | XP bar, project cards, quick-start, recent activity |
| Chat UI | Streaming AI conversation with markdown support |
| AI Builder | Claude generates complete websites from descriptions |
| Live Preview | Real-time iframe preview with mobile/desktop toggle |
| AI Visualizer | 5-node pipeline showing what the AI is doing |
| Founder's Lab | Pivot Game (50 XP) + First 10 Users Challenge (60 XP) |
| Deployment | One-click GitHub Pages deploy with QR code |
| Journal | Portfolio of all Founder's Lab responses |
| Teacher Dashboard | Class management, student roster, class codes |
| Dark/Light Mode | System-aware theme with manual toggle |

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** TailwindCSS v4 + custom design system
- **UI Components:** Custom shadcn/ui-style components
- **Animations:** Framer Motion
- **State:** Zustand
- **Database:** Supabase (PostgreSQL)
- **AI:** Claude (Anthropic SDK)
- **Deployment:** GitHub Pages (student sites)

## Project Structure

```
src/
├── app/              # Next.js pages and API routes
│   ├── (auth)/       # Login & signup pages
│   ├── (dashboard)/  # Student dashboard, projects, journal, settings
│   ├── (teacher)/    # Teacher dashboard
│   └── api/          # Chat, generate, deploy, founders-lab endpoints
├── components/       # React components
│   ├── ui/           # Base UI primitives (button, card, input, etc.)
│   ├── landing/      # Landing page sections
│   ├── chat/         # Chat panel, message bubbles, input
│   ├── builder/      # Workspace, live preview, deploy button
│   ├── visualizer/   # AI pipeline visualizer
│   ├── founders-lab/ # Pivot Game, First 10 Users, XP toast
│   ├── dashboard/    # Project cards, XP bar, quick start
│   └── shared/       # Navbar, sidebar, theme toggle
├── lib/              # Utilities and integrations
│   ├── ai/           # Claude client, prompts, Founder's Lab prompts
│   ├── supabase/     # Database client (browser + server)
│   └── github/       # GitHub Pages deployment
├── stores/           # Zustand state stores
└── types/            # TypeScript type definitions
```
