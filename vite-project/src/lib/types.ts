// Fight data types
export interface Fighter {
  name: string;
  image: string;
}

export interface FightPrediction {
  fighterA: Fighter;
  fighterB: Fighter;
  predictionA: number;
  predictionB: number;
  ourOddsA: string;
  ourOddsB: string;
  bookieOddsA: string;
  bookieOddsB: string;
  hasValue: boolean;
  valueOn: 'A' | 'B' | null;
  event: string;
  type: string;
}

export interface FightMatch {
  id: string;
  fighterA: Fighter;
  fighterB: Fighter;
  predictedWinner: 'A' | 'B';
  confidence: number;
  aiOddsA: string;
  aiOddsB: string;
  bookieOddsA: string;
  bookieOddsB: string;
  expectedValue: number;
  weightClass: string;
  isMainEvent: boolean;
  stats?: FightStats;
}

export interface FightStats {
  fighterA: FighterStats;
  fighterB: FighterStats;
}

export interface FighterStats {
  significantStrikes: number;
  significantStrikesLanded: number;
  significantStrikeAccuracy: number;
  takedowns: number;
  takedownsLanded: number;
  takedownAccuracy: number;
  knockdowns: number;
  submissionAttempts: number;
  reversals: number;
  controlTime: string;
  wins: number;
  losses: number;
  draws: number;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  matches: FightMatch[];
}

// Feature types
export interface Feature {
  icon: string;
  title: string;
  description: string;
}

// Step types
export interface Step {
  number: number;
  icon: string;
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
  image: string;
}

// Testimonial types
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  rating: number;
}

// FAQ types
export interface FAQ {
  question: string;
  answer: string;
}
