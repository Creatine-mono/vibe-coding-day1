
export interface Player {
  health: number;
  maxHealth: number;
  attack: number;
}

export interface Choice {
  text: string;
  prompt: string;
}

export interface GameResponse {
  narrative: string;
  choices: Choice[];
  playerUpdate?: {
    healthChange?: number;
  };
  gameOver?: boolean;
  gameWon?: boolean;
  gameMessage?: string;
}

export interface StorySegment {
  id: number;
  narrative: string;
  isPlayerChoice?: boolean;
  choiceText?: string;
}
