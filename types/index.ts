// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatarConfig: AvatarConfig;
  teamId?: string;
  role: 'admin' | 'participant' | 'viewer';
  points: number;
  challengesCompleted: number;
  createdAt: Date;
  updatedAt: Date;
}

// Avatar Types
export interface AvatarConfig {
  version: string;
  body: {
    type: 'tshirt' | 'hoodie' | 'tank' | 'suit' | 'vest';
    color: string;
  };
  head: {
    shape: 'round' | 'square' | 'oval';
    skinTone: string;
  };
  eyes: {
    style: 'normal' | 'happy' | 'surprised' | 'wink' | 'star' | 'heart' | 'dollar' | 'spiral';
    color: string;
  };
  accessories: {
    glasses?: 'normal' | 'sunglasses' | '3d' | 'monocle' | 'nerd' | null;
    hat?: 'cap' | 'beanie' | 'hardhat' | 'spiky' | 'long' | 'bun' | null;
  };
  special?: {
    glow: boolean;
    animation?: string | null;
  };
}

// Challenge Types
export type ChallengeType = 'photo' | 'location' | 'task' | 'trivia';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  location?: {
    name: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    radius?: number; // meters
  };
  requirements: string[];
  points: number;
  bonusPoints?: number;
  aiVerificationPrompt?: string;
  status: 'active' | 'draft' | 'archived';
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// Submission Types
export interface Submission {
  id: string;
  userId: string;
  challengeId: string;
  photoUrl?: string;
  notes?: string;
  aiVerification?: {
    passed: boolean;
    feedback: string;
    confidence: number;
  };
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

// Team Types
export interface Team {
  id: string;
  name: string;
  color: string;
  avatarUrl?: string;
  memberIds: string[];
  points: number;
  challengesCompleted: number;
  createdAt: Date;
  updatedAt: Date;
}

// Leaderboard Types
export interface LeaderboardEntry {
  userId: string;
  userName: string;
  avatarConfig: AvatarConfig;
  teamId?: string;
  teamName?: string;
  points: number;
  challengesCompleted: number;
  rank: number;
}

// Context Types
export interface ChallengeContext {
  userId: string;
  challengeId: string;
  history: {
    step: number;
    photoUrl: string;
    aiResponse: string;
    timestamp: Date;
  }[];
  currentStep: number;
  expiresAt: Date;
}
