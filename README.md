# UP! - HQB Scavenger Hunt 🎮

**HQB Scalable HCI 2025 Scavenger Hunt** - An 8-bit themed scavenger hunt platform with customizable chibi avatars, AI-powered photo verification, and real-time leaderboards.

## 🌐 Live Demo

**Domain**: [up.era.computer](https://up.era.computer)

## 🎨 Design Philosophy

8-Bit Huaqiangbei Electronics Mall aesthetic - Think **Habbo Hotel meets Hong Kong electronics markets**. A pixelated, neon-soaked digital playground capturing the chaotic energy of Shenzhen's tech district.

## 🚀 Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS with custom 8-bit theme
- **Authentication**: Firebase Authentication (Google OAuth 2.0)
- **Database**: Cloud Firestore (NoSQL)
- **Storage**: Google Cloud Storage
- **AI**: Gemini 3 Flash Preview (photo verification)
- **Hosting**: Firebase Hosting

## 📦 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account
- Google Cloud account (for Gemini API)

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/Era-Laboratories/hqb-scav-hunt.git
cd hqb-scav-hunt
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Add your Firebase and Gemini credentials to \`.env.local\`

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

\`\`\`
hqb-scav-hunt/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Main app routes
│   ├── admin/             # Admin panel
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # UI primitives
│   ├── avatar/           # Avatar system
│   ├── challenge/        # Challenge components
│   ├── team/             # Team components
│   ├── leaderboard/      # Leaderboard components
│   └── admin/            # Admin components
├── lib/                  # Utility libraries
│   ├── firebase/         # Firebase config
│   └── utils/            # Helper functions
├── types/                # TypeScript types
└── public/               # Static assets
    ├── avatars/          # Avatar sprites
    └── images/           # App images
\`\`\`

## 🎮 Features

### For Players
- 🔐 Google OAuth authentication
- 👤 Customizable 8-bit chibi avatars (carousel UI)
- 📸 Photo challenge submissions
- 🤖 AI-powered photo verification (Gemini)
- 📍 Location-based challenges
- 👥 Team creation and management
- 🏆 Real-time leaderboards (individual & team)
- 📊 Progress tracking and stats

### For Admins
- ⚙️ Challenge creation and editing
- 📋 Submission review and moderation
- 👥 User management and RBAC
- 📊 Analytics dashboard
- 🚨 Flagging and audit system

## 🎨 Design System

### Color Palette
- **Electric Lime**: `#00FF41` - Primary accent
- **Neon Orange**: `#FF6B00` - Secondary accent
- **Hot Pink**: `#FF10F0` - Highlights
- **Cyber Blue**: `#00D9FF` - Links/info
- **Deep Purple**: `#1A0033` - Background
- **Dark Navy**: `#0A0E27` - Secondary background

### Typography
- **Headings**: Press Start 2P (pixel font)
- **Body**: DM Mono (monospace)

### Components
- Pixel borders (4px)
- Neon glow effects
- Scanline overlay
- 8px grid system

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Firebase Setup

1. Create a Firebase project
2. Enable Authentication (Google provider)
3. Create Firestore database
4. Create Storage bucket
5. Add Firebase config to `.env.local`

### Gemini API Setup

1. Enable Gemini API in Google Cloud Console
2. Create API key
3. Add to `.env.local` as `GEMINI_API_KEY`

## 📝 Linear Project

All project tasks are tracked in Linear:
**Project**: [UP! HQB Scavenger Hunt 2025](https://linear.app/era-labs/project/up-hqb-scavenger-hunt-2025-dac9980b4c70)

## 🤝 Contributing

This is a private project for HCI 2025. Contact the Era Labs team for access.

## 📄 License

Copyright © 2025 Era Laboratories. All rights reserved.

## 🎯 Milestones

- **M0**: Infrastructure & Project Setup ✅
- **M1**: Design System & 8-Bit Theme (In Progress)
- **M2**: Authentication & Onboarding
- **M3-M4**: Avatar System
- **M5-M7**: Challenge & AI System
- **M8-M10**: Teams, Leaderboard, Admin
- **M11-M12**: Testing & Deployment

---

Built with 💚 by [Era Laboratories](https://era.computer)
