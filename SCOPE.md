# UP! The Scalable HCI 2025 Scavenger Hunt

## Project Overview

A themed scavenger hunt web application with an 8-bit Huaqiangbei electronics mall aesthetic (inspired by Habbo Hotel). Participants create customizable chibi avatars, join teams, and complete photo-based challenges verified by AI.

**Domain**: `up.era.computer`

---

## Core Features

### 1. User Application

#### Authentication & Onboarding
- [ ] Email/password sign-up and login
- [ ] OAuth options (Google recommended for HCI conference attendees)
- [ ] Onboarding flow with avatar creation
- [ ] "Who would you like to team with?" field (names/emails, optional)

#### Avatar Creator (Simple Chibi System)
- [ ] **Base Skeleton**: Single base body silhouette (gender-neutral)
- [ ] **Skin Tone**: 8 skin tone options (light to dark spectrum)
- [ ] **Eyes**: 10 eye styles + color picker (see Eye Styles below)
- [ ] **Hair**: 10 hairstyles + color picker
- [ ] **Top**: 8 shirt/jacket options (HQB electronics mall themed)
- [ ] **Accessories**: 12+ fun items (see Accessories below)
- [ ] Live preview with layer compositing
- [ ] Avatar stored as config + rendered to PNG for display
- [ ] Extensible asset system for future additions / AI generation

#### Scavenger Hunt Gameplay
- [ ] View assigned team and teammates
- [ ] Browse available challenges (with point values)
- [ ] Photo capture/upload for challenge submission
- [ ] Real-time status of submitted challenges (pending/approved/rejected)
- [ ] Team leaderboard
- [ ] Personal contribution stats

#### Challenge Submission Flow
1. User selects a challenge
2. Takes/uploads photo
3. Photo sent to Gemini 3 Flash Preview for AI verification
4. AI confirms presence of required item/location
5. Admin can override AI decisions
6. Points awarded upon approval

#### Challenge Types

**Simple Challenges** (single photo verification):
- Take a photo with old handheld devices
- Find the oldest device you can (early 2000s or older)
- Find a mini/tiny phone (jail phones)
- Selfie with AI glasses (common in HQB)
- Selfie with humanoid robot or robot dog
- Go to top floor of a side mall, photo what you find

**Discovery Challenges** (requires finding + reporting info):
- Find second-hand smartphone packing operation → report where batch is being shipped
- Find the weirdest AI product you can

**Multi-Step Challenges** (persistent AI context per user):
- **Component Hunt**: Track all components of an Apple product (iPhone/iPad/Watch - randomly assigned)
  - Must find 10 core components (logic board, screen, camera, battery, speaker, etc.)
  - NO two components from same vendor (AI tracks and enforces)
  - Each submission adds to user's tracked context
  - AI maintains conversation history per challenge per user

**Modification Challenges** (before/after verification):
- Get a cosmetic update to someone's phone (new color, laser etch, etc.)
- Requires "before" and "after" photos
- AI verifies the modification occurred

---

## Challenge & AI Context System

### Challenge Definition (Extended)
```typescript
interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;

  // Challenge type determines verification flow
  type: 'simple' | 'discovery' | 'multi-step' | 'modification';

  // AI Verification
  verificationCriteria: string;     // Base prompt for Gemini

  // For multi-step challenges
  multiStepConfig?: {
    totalSteps: number;             // e.g., 10 components
    stepDescription: string;        // What each step requires
    uniquenessRule?: string;        // e.g., "no two items from same vendor"
    contextPrompt: string;          // System prompt for maintaining context
    completionBonus?: number;       // Extra points for completing all steps
  };

  // For modification challenges
  modificationConfig?: {
    requiresBefore: boolean;
    requiresAfter: boolean;
    verificationPrompt: string;     // How to verify modification occurred
  };

  // For discovery challenges
  discoveryConfig?: {
    requiresInfo: boolean;
    infoPrompt: string;             // What info to extract from submission
    infoFields: string[];           // e.g., ["destination_country", "quantity"]
  };

  hint?: string;
  iconUrl?: string;
  isActive: boolean;
  startsAt?: Timestamp;
  endsAt?: Timestamp;
  createdAt: Timestamp;
}
```

### AI Context Session
```typescript
interface AIContextSession {
  id: string;
  challengeId: string;
  userId: string;
  teamId: string;

  // Conversation history for multi-step
  messages: {
    role: 'user' | 'assistant' | 'system';
    content: string;
    imageUrl?: string;
    timestamp: Timestamp;
  }[];

  // Progress tracking
  stepsCompleted: number;
  stepDetails: {
    stepNumber: number;
    submissionId: string;
    extractedInfo: Record<string, any>; // e.g., { vendor: "XYZ Electronics", component: "battery" }
    verifiedAt: Timestamp;
  }[];

  // Uniqueness tracking (for component hunt)
  uniqueValues: Record<string, string[]>; // e.g., { vendor: ["Shop A", "Shop B"] }

  status: 'in_progress' | 'completed' | 'abandoned';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Component Hunt Example Flow
```
Challenge: "Build an iPhone from HQB components"
Assigned: iPhone 15 Pro
Required components: logic board, display, battery, camera module,
                     speaker, microphone, taptic engine, face ID module,
                     charging port, frame/housing

User submission 1:
  - Photo of battery from "PowerCell Shop"
  - AI: "✓ Battery verified from PowerCell Shop. 1/10 complete.
         Vendors used: [PowerCell Shop]"

User submission 2:
  - Photo of display from "PowerCell Shop"
  - AI: "✗ Display appears to be from PowerCell Shop, but you already
         have a component from this vendor. Find a different vendor."

User submission 3:
  - Photo of display from "ScreenWorld"
  - AI: "✓ Display verified from ScreenWorld. 2/10 complete.
         Vendors used: [PowerCell Shop, ScreenWorld]"

... continues until 10/10 ...

Final: Bonus points awarded for completing full component set!
```

### Example Challenges (Pre-configured)

```typescript
const EXAMPLE_CHALLENGES: Partial<Challenge>[] = [
  // Simple
  {
    title: "Retro Gaming",
    description: "Find and photograph old handheld gaming devices (GameBoy, PSP, etc.)",
    points: 50,
    type: 'simple',
    verificationCriteria: "Verify the image shows vintage/retro handheld gaming devices such as GameBoy, PSP, Nintendo DS, or similar devices from before 2015."
  },
  {
    title: "Time Traveler",
    description: "Find the oldest electronic device you can (bonus for pre-2000!)",
    points: 100,
    type: 'simple',
    verificationCriteria: "Identify electronic devices in the image and estimate their age. Look for model numbers, design characteristics. Report the estimated year and device type."
  },
  {
    title: "Tiny Phone",
    description: "Find the smallest phone you can - the tinier the better!",
    points: 75,
    type: 'simple',
    verificationCriteria: "Verify this shows an unusually small mobile phone (mini phones, 'jail phones', novelty tiny phones). Bonus points for extremely small form factors."
  },
  {
    title: "AI Glasses Selfie",
    description: "Take a selfie wearing AI/smart glasses",
    points: 25,
    type: 'simple',
    verificationCriteria: "Verify this is a selfie of a person wearing smart glasses or AI-enabled glasses (Ray-Ban Meta, similar products)."
  },
  {
    title: "Robot Friend",
    description: "Selfie with a humanoid robot or robot dog",
    points: 100,
    type: 'simple',
    verificationCriteria: "Verify this shows a person posing with a humanoid robot or robotic dog (Boston Dynamics style, Unitree, etc.)."
  },
  {
    title: "Top Floor Explorer",
    description: "Find a side mall, go ALL the way to the top floor, and document what you find",
    points: 150,
    type: 'discovery',
    verificationCriteria: "Verify this appears to be a top/upper floor of a building. Describe what interesting things are visible.",
    discoveryConfig: {
      requiresInfo: true,
      infoPrompt: "Describe what you found on the top floor",
      infoFields: ["location_description", "interesting_finds"]
    }
  },

  // Discovery
  {
    title: "Global Shipping",
    description: "Find the second-hand smartphone packing operation and discover where they're shipping phones to!",
    points: 200,
    type: 'discovery',
    verificationCriteria: "Verify this shows a phone packing/shipping operation. Look for shipping labels, country names, or ask the user to report the destination.",
    discoveryConfig: {
      requiresInfo: true,
      infoPrompt: "Where are these phones being shipped to?",
      infoFields: ["destination_country", "estimated_quantity"]
    }
  },
  {
    title: "Weirdest AI",
    description: "Find the strangest AI-powered product you can",
    points: 150,
    type: 'discovery',
    verificationCriteria: "Identify what AI product is shown and rate its 'weirdness' factor. Describe what makes it unusual.",
    discoveryConfig: {
      requiresInfo: true,
      infoPrompt: "Describe this AI product and why it's weird",
      infoFields: ["product_name", "ai_capability", "weirdness_description"]
    }
  },

  // Multi-step (Component Hunt)
  {
    title: "Build an iPhone",
    description: "Track down all 10 core components of an iPhone from different vendors!",
    points: 500,
    type: 'multi-step',
    verificationCriteria: "Identify the iPhone component shown and the vendor/shop name visible in the image.",
    multiStepConfig: {
      totalSteps: 10,
      stepDescription: "Find and photograph an iPhone component with the vendor/shop name visible",
      uniquenessRule: "Each component must come from a DIFFERENT vendor. No two items from the same shop.",
      contextPrompt: `You are tracking a user's progress in collecting iPhone components from Huaqiangbei market.
        Required components: logic board, display assembly, battery, rear camera module, front camera,
        speaker, microphone, taptic engine, lightning/USB-C port, frame/housing.

        For each submission:
        1. Identify the component type
        2. Identify the vendor/shop name from signage or context
        3. Check if this vendor was already used (reject if duplicate)
        4. Check if this component type was already collected (reject if duplicate)
        5. Update progress and list remaining components`,
      completionBonus: 200
    }
  },
  {
    title: "Build an Apple Watch",
    description: "Track down all 10 core components of an Apple Watch from different vendors!",
    points: 500,
    type: 'multi-step',
    verificationCriteria: "Identify the Apple Watch component shown and the vendor/shop name visible in the image.",
    multiStepConfig: {
      totalSteps: 10,
      stepDescription: "Find and photograph an Apple Watch component with the vendor/shop name visible",
      uniquenessRule: "Each component must come from a DIFFERENT vendor. No two items from the same shop.",
      contextPrompt: `You are tracking a user's progress in collecting Apple Watch components from Huaqiangbei market.
        Required components: S-series chip, OLED display, battery, digital crown, heart rate sensor,
        speaker, microphone, taptic engine, wireless charging coil, ceramic/aluminum case.

        For each submission, identify component and vendor, enforce uniqueness rules.`,
      completionBonus: 200
    }
  },

  // Modification
  {
    title: "Phone Makeover",
    description: "Get a cosmetic modification done to a phone (new color back, laser etching, etc.)",
    points: 300,
    type: 'modification',
    verificationCriteria: "Compare before and after images to verify a cosmetic modification was made to the phone.",
    modificationConfig: {
      requiresBefore: true,
      requiresAfter: true,
      verificationPrompt: "Analyze the before and after images. Identify what cosmetic modification was performed (color change, engraving, case swap, etc.). Verify this is the same device that has been modified."
    }
  }
];
```

### 2. Admin Panel

#### Team Management
- [ ] Create/edit/delete teams
- [ ] Assign users to teams (manual or bulk)
- [ ] Set team colors and names
- [ ] View team rosters

#### Challenge Management
- [ ] Create challenges with:
  - Title and description
  - Point value
  - Required verification criteria (what AI should look for)
  - Optional hint text
  - Challenge image/icon
- [ ] Enable/disable challenges
- [ ] Set challenge availability windows

#### Submission Review
- [ ] Queue of pending submissions
- [ ] View AI verification result and confidence
- [ ] Override AI decision (approve/reject)
- [ ] Add admin notes
- [ ] Bulk approval/rejection

#### Scoring & Leaderboard
- [ ] Real-time team point totals
- [ ] Individual contributor stats
- [ ] Export results (CSV)
- [ ] Configure point multipliers or bonuses

#### Event Controls
- [ ] Start/pause/end hunt
- [ ] Broadcast announcements to all users
- [ ] View activity feed

---

## Technical Architecture

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS with custom 8-bit theme
- **State**: Zustand or React Query
- **Avatar Builder**: Canvas-based layered sprite system

### Backend
- **API**: Next.js API Routes (or separate Node.js service)
- **Database**: Cloud Firestore (real-time updates for leaderboard)
- **Auth**: Firebase Auth or NextAuth.js
- **Storage**: Google Cloud Storage (challenge photos)

### AI Verification
- **Model**: Gemini 3 Flash Preview (`gemini-2.0-flash`)
- **Process**:
  1. Image uploaded to GCS
  2. Image URL sent to Gemini with challenge criteria
  3. Gemini returns verification result + confidence
  4. Result stored with submission

### Infrastructure (GCP)
```
Project: hqb-scav-hunt
Region: asia-east1 (Taiwan - closest to HK/Shenzhen)

Services:
├── Cloud Run (Next.js app)
├── Cloud Firestore (database)
├── Cloud Storage (images)
├── Gemini API (verification via AI Studio or Vertex AI)
├── Firebase Auth (authentication)
└── Cloud CDN (static assets)
```

---

## Avatar Asset Schema

Designed for easy extension and potential AI generation during chibi creation.

### Asset Definition Schema
```typescript
interface AssetDefinition {
  id: string;                    // Unique identifier (e.g., "hair-spiky-01")
  category: AssetCategory;       // Which slot this belongs to
  name: string;                  // Display name
  description?: string;          // Tooltip/alt text

  // Rendering
  layers: AssetLayer[];          // Ordered layers for compositing
  anchor: { x: number; y: number }; // Position relative to base
  zIndex: number;                // Draw order within category

  // Customization
  colorizable: boolean;          // Can user change colors?
  colorSlots?: ColorSlot[];      // Which parts can be recolored
  defaultColors?: Record<string, string>; // Default hex values

  // Metadata
  tags: string[];                // For search/filter ("cute", "techy", "formal")
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary';
  unlockCondition?: UnlockCondition; // How to obtain (default: available)

  // Source tracking
  source: 'built-in' | 'ai-generated' | 'custom';
  generatedBy?: string;          // If AI-generated, which model/prompt
  createdAt: Timestamp;
}

type AssetCategory =
  | 'skin'
  | 'eyes'
  | 'eyebrows'
  | 'hair'
  | 'top'
  | 'bottom'
  | 'accessory-head'
  | 'accessory-face'
  | 'accessory-body'
  | 'accessory-hand'
  | 'accessory-effect';

interface AssetLayer {
  imageUrl: string;              // URL to PNG sprite (transparent)
  colorSlot?: string;            // Which color slot affects this layer
  blendMode?: 'normal' | 'multiply' | 'overlay'; // For recoloring
}

interface ColorSlot {
  id: string;                    // e.g., "primary", "secondary", "accent"
  name: string;                  // e.g., "Hair Color", "Highlight"
  defaultColor: string;          // Hex color
  allowedColors?: string[];      // Restrict to palette, or null for any
}

interface UnlockCondition {
  type: 'default' | 'challenge' | 'points' | 'team' | 'secret';
  requirement?: string;          // e.g., challenge ID or point threshold
}
```

### Asset Manifest
```typescript
// Loaded at app init, cacheable
interface AssetManifest {
  version: string;
  baseUrl: string;               // CDN prefix for asset URLs
  categories: {
    [key in AssetCategory]: {
      required: boolean;         // Must user select one?
      maxSelections: number;     // How many can be equipped (accessories)
      assets: AssetDefinition[];
    };
  };
  colorPalettes: {
    skin: string[];              // Predefined skin tones
    eyes: string[];              // Eye color presets
    hair: string[];              // Hair color presets
  };
}
```

### AI Generation Integration
```typescript
interface AIGeneratedAsset {
  // Request
  prompt: string;                // User's text description
  category: AssetCategory;       // What type to generate
  styleGuide: string;            // System prompt for consistency

  // Response
  generatedImageUrl: string;     // Raw AI output
  processedLayers: AssetLayer[]; // After background removal/processing

  // Moderation
  approved: boolean;             // Auto-approved or needs review
  moderationScore: number;       // Safety check score
}

// Example flow:
// 1. User types "rainbow mohawk with LEDs"
// 2. Send to image generation API with style guide
// 3. Process output (remove background, fit to template)
// 4. Create temporary AssetDefinition with source: 'ai-generated'
// 5. User can use immediately, admin reviews for permanent catalog
```

### Asset Storage Structure
```
/assets
├── /base
│   └── skeleton-64.png
├── /skin
│   ├── tone-01.png ... tone-08.png
├── /eyes
│   ├── round-large.png
│   ├── monolid.png
│   └── ...
├── /hair
│   ├── spiky-01-base.png      (colorizable layer)
│   ├── spiky-01-highlight.png (overlay layer)
│   └── ...
├── /tops
│   ├── hoodie-tech.png
│   └── ...
├── /accessories
│   ├── head/
│   ├── face/
│   ├── body/
│   ├── hand/
│   └── effects/
└── /ai-generated
    └── /{userId}/
        └── {assetId}.png
```

### Compositing Order (z-index)
```
1.  Background/Aura effects (lowest)
2.  Body shadow
3.  Base skeleton
4.  Skin layer
5.  Bottom clothing
6.  Top clothing
7.  Hair (back layer)
8.  Face (eyes, eyebrows, mouth)
9.  Hair (front layer)
10. Face accessories (glasses, masks)
11. Head accessories
12. Body accessories (bags, pins)
13. Hand items
14. Front effects (highest)
```

---

## Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  displayName: string;
  teamId: string | null;
  avatar: AvatarConfig;
  role: 'user' | 'admin';
  suggestedTeammates: string[]; // Names/emails of people they'd like to team with
  createdAt: Timestamp;
}

interface AvatarConfig {
  version: number;                // Schema version for migrations

  // Core features
  skinTone: string;               // Skin tone asset ID
  eyes: {
    style: string;                // Eye style asset ID
    color: string;                // Hex color
  };
  eyebrows: string;               // Eyebrow asset ID
  hair: {
    style: string;                // Hair asset ID
    colors: Record<string, string>; // Color slot → hex (primary, highlight, etc.)
  };

  // Clothing
  top: string;                    // Top asset ID
  bottom?: string;                // Bottom asset ID (optional for some styles)

  // Accessories (multiple allowed per category)
  accessories: {
    head: string[];               // Head accessory IDs
    face: string[];               // Face accessory IDs
    body: string[];               // Body accessory IDs
    hand: string[];               // Hand/held item IDs
    effect: string[];             // Effect/aura IDs
  };

  // AI-generated assets (user's custom creations)
  customAssets?: {
    assetId: string;
    category: string;
    imageUrl: string;
  }[];

  // Rendered cache
  renderedUrl?: string;           // Pre-rendered composite PNG
  renderedAt?: Timestamp;
}
```

### Team
```typescript
interface Team {
  id: string;
  name: string;
  color: string;
  points: number;
  memberIds: string[];
  createdAt: Timestamp;
}
```

### Challenge
```typescript
interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  verificationCriteria: string; // Prompt for Gemini
  hint?: string;
  iconUrl?: string;
  isActive: boolean;
  startsAt?: Timestamp;
  endsAt?: Timestamp;
  createdAt: Timestamp;
}
```

### Submission
```typescript
interface Submission {
  id: string;
  challengeId: string;
  userId: string;
  teamId: string;
  imageUrl: string;
  aiVerification: {
    approved: boolean;
    confidence: number;
    reasoning: string;
  };
  adminOverride?: {
    approved: boolean;
    adminId: string;
    note?: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  pointsAwarded: number;
  createdAt: Timestamp;
  reviewedAt?: Timestamp;
}
```

---

## 8-Bit Visual Theme

### Color Palette
- **Primary**: Electric blue (#00D4FF)
- **Secondary**: Hot pink (#FF00AA)
- **Accent**: Neon green (#00FF66)
- **Background**: Dark purple (#1A0033)
- **Text**: White (#FFFFFF) / Light gray (#CCCCCC)

### Typography
- Pixel-style font (e.g., "Press Start 2P", "VT323")
- All caps for headers
- Chunky, readable for body text

### UI Elements
- Pixelated borders and buttons
- Scanline overlay effect (subtle)
- CRT monitor frame for key screens
- Electronic component decorations
- Blinking LEDs and status lights

### Avatar Style
- 64x64 base sprites (scales well for display)
- Limited color palette per element
- Clean pixel art aesthetic
- Huaqiangbei mall worker/shopper themed options

### Eye Styles (Diverse & Inclusive)
Designed to represent participants from various backgrounds:

| ID | Name | Description |
|----|------|-------------|
| `round-large` | Round Large | Big expressive anime-style eyes |
| `round-small` | Round Small | Smaller round eyes, subtle expression |
| `almond` | Almond | Classic almond shape, versatile |
| `monolid` | Monolid | East Asian style, clean single lid |
| `hooded` | Hooded | Partially covered upper lid |
| `upturned` | Upturned | Lifted outer corners, cheerful |
| `downturned` | Downturned | Soft, gentle expression |
| `cat-eye` | Cat Eye | Sharp angled outer corners |
| `sleepy` | Sleepy/Relaxed | Half-lidded, chill vibes |
| `sparkle` | Sparkle | Anime sparkle eyes, extra expressive |

**Eye Colors** (picker + presets):
- Brown (light → dark)
- Blue (sky, ocean, steel)
- Green (emerald, hazel, sage)
- Gray
- Amber/Gold
- Black
- Special: Purple, Red, Heterochromia option

### Hair Styles
| ID | Name | Description |
|----|------|-------------|
| `short-neat` | Short & Neat | Clean professional cut |
| `short-messy` | Short Messy | Tousled casual look |
| `medium-straight` | Medium Straight | Shoulder-length straight |
| `medium-wavy` | Medium Wavy | Shoulder-length with waves |
| `long-straight` | Long Straight | Long flowing straight hair |
| `long-curly` | Long Curly | Voluminous curly hair |
| `bob` | Bob Cut | Classic bob |
| `pixie` | Pixie Cut | Short and stylish |
| `spiky` | Spiky | Anime-style spiky |
| `bun` | Top Bun | Hair tied up in bun |

**Hair Colors** (picker + presets):
- Natural: Black, Brown (light→dark), Blonde, Auburn, Gray, White
- Fashion: Pink, Blue, Purple, Green, Red, Orange
- Gradient/tips option for two-tone styles

### Accessories Catalog

#### Head Accessories
| ID | Name | Description |
|----|------|-------------|
| `headphones-big` | DJ Headphones | Over-ear chunky headphones |
| `headphones-cat` | Cat Ear Headphones | Headphones with LED cat ears |
| `cap-backwards` | Backwards Cap | Classic backwards baseball cap |
| `beanie` | Tech Beanie | Slouchy beanie |
| `visor-holo` | Holo Visor | Cyberpunk holographic visor |
| `antenna` | Antenna Headband | Robot antenna bobbing |

#### Face Accessories
| ID | Name | Description |
|----|------|-------------|
| `glasses-round` | Round Glasses | Classic round frames |
| `glasses-square` | Square Glasses | Modern square frames |
| `glasses-vr` | VR Headset | Mini VR goggles pushed up |
| `mask-surgical` | Mask | Surgical mask (HK style) |
| `mask-led` | LED Mask | Mask with pixel LED display |

#### Body Accessories
| ID | Name | Description |
|----|------|-------------|
| `lanyard` | Conference Lanyard | Badge on lanyard (customizable) |
| `bag-tote` | Tote Bag | HQB shopping tote |
| `bag-backpack` | Tech Backpack | Loaded backpack |
| `pin-circuit` | Circuit Pin | PCB-shaped lapel pin |
| `pin-led` | LED Badge | Blinking LED name badge |
| `cable-wrap` | Cable Spaghetti | Tangled cables around neck |

#### Hand/Held Items
| ID | Name | Description |
|----|------|-------------|
| `phone` | Smartphone | Holding phone (taking photos!) |
| `bubble-tea` | Bubble Tea | Boba in hand |
| `soldering-iron` | Soldering Iron | For the makers |
| `multimeter` | Multimeter | Electronics testing |
| `shopping-bag` | Shopping Bags | Multiple HQB bags |
| `drone-mini` | Mini Drone | Tiny drone hovering nearby |

#### Special/Rare
| ID | Name | Description |
|----|------|-------------|
| `aura-electric` | Electric Aura | Sparking electricity effect |
| `aura-binary` | Binary Rain | Matrix-style falling 0s and 1s |
| `pet-robot` | Robot Pet | Small robot companion |
| `wings-circuit` | Circuit Wings | PCB trace pattern wings |

---

## API Endpoints (Draft)

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Users
- `GET /api/users/:id`
- `PUT /api/users/:id/avatar`
- `GET /api/users/:id/submissions`

### Teams
- `GET /api/teams`
- `GET /api/teams/:id`
- `POST /api/teams` (admin)
- `PUT /api/teams/:id` (admin)
- `POST /api/teams/:id/members` (admin)

### Challenges
- `GET /api/challenges`
- `GET /api/challenges/:id`
- `POST /api/challenges` (admin)
- `PUT /api/challenges/:id` (admin)

### Submissions
- `POST /api/submissions`
- `GET /api/submissions` (admin: all, user: own)
- `PUT /api/submissions/:id/review` (admin)

### Leaderboard
- `GET /api/leaderboard`

### Admin
- `POST /api/admin/announce`
- `PUT /api/admin/event-status`

---

## Deployment Pipeline

1. **Development**: Local Next.js dev server
2. **Preview**: Auto-deploy PR branches to Cloud Run (preview URLs)
3. **Production**: Main branch deploys to `up.era.computer`

### CI/CD
- GitHub Actions for build/test/deploy
- Terraform or Pulumi for infrastructure (optional)

---

## Decisions Made

1. **Team Assignment**: Admin-only, but users can suggest preferred teammates during signup
2. **Avatar Assets**: Custom simple pixel art - skeleton base with swappable pieces
3. **GCP Region**: asia-east1 (Taiwan) - closest to HK/Shenzhen for HCI attendees

## Open Questions

1. **Real-time Updates**: WebSockets for live leaderboard or polling?
2. **Offline Support**: PWA with offline photo queue?
3. **Challenge Categories**: Group challenges by location/difficulty?
4. **Time Limits**: Per-challenge time limits or just event-wide?

---

## Next Steps

1. **Create GCP Project**: `hqb-scav-hunt`
2. **Enable Services**: Cloud Run, Firestore, Storage, Vertex AI
3. **Initialize Next.js**: With TypeScript, Tailwind, App Router
4. **Design Avatar System**: Sprite sheets and layering logic
5. **Build Auth Flow**: Firebase Auth integration
6. **Prototype Avatar Creator**: Canvas-based builder
7. **Set Up Gemini Integration**: Test image verification
8. **Build Admin Panel**: Team and challenge management
9. **Deploy MVP**: Cloud Run with custom domain

---

## Estimated Components

| Component | Files | Complexity |
|-----------|-------|------------|
| Auth (signup/login/session) | 8-10 | Medium |
| Avatar System (creator + renderer) | 15-20 | High |
| Avatar Asset Management | 8-10 | Medium |
| AI Asset Generation | 5-8 | Medium |
| User Dashboard | 5-8 | Medium |
| Challenge List & Details | 5-7 | Low |
| Photo Submission Flow | 8-10 | High |
| Leaderboard | 3-5 | Low |
| Admin: Team Management | 6-8 | Medium |
| Admin: Challenge Management | 6-8 | Medium |
| Admin: Submission Review | 8-10 | Medium |
| Admin: Asset Management | 4-6 | Low |
| Admin: Event Controls | 4-6 | Low |
| API Routes | 18-22 | Medium |
| Gemini Integration | 3-5 | Medium |
| Database Schema/Hooks | 6-10 | Medium |

**Total Estimate**: ~110-140 files

### Avatar Asset Count
| Category | Items | Colorizable |
|----------|-------|-------------|
| Skin Tones | 8 | No |
| Eye Styles | 10 | Yes (iris) |
| Hair Styles | 10 | Yes (multi-slot) |
| Tops | 8 | Partial |
| Accessories | 24+ | Varies |
| **Total Built-in** | **60+** | |

---

## Success Criteria

- [ ] Users can sign up and create custom avatars
- [ ] Admins can create teams and assign users
- [ ] Challenges can be created with AI verification criteria
- [ ] Photo submissions are verified by Gemini with admin override
- [ ] Real-time leaderboard shows team standings
- [ ] App performs well on mobile (primary use case)
- [ ] 8-bit aesthetic is consistent and delightful
