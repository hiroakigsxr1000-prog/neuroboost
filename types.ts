export enum GameType {
  REFLEX = 'REFLEX',
  CALCULATION = 'CALCULATION',
  MEMORY = 'MEMORY',
  RIDDLE = 'RIDDLE'
}

export interface GameResult {
  date: string;
  type: GameType;
  score: number;
  details?: string; // e.g., "Avg 200ms" or "Level 5"
}

export interface UserProfile {
  name: string;
  history: GameResult[];
}

export interface Riddle {
  question: string;
  answer: string;
  hint: string;
}
