export interface Event {
  id: string;
  name: string;
  matches: Match[];
}

export interface Match {
  id: string;
  fighter1: string;
  fighter2: string;
  odds1: number;
  odds2: number;
  referee: string;
  prediction?: MatchPrediction;
}

export interface MatchPrediction {
  fighter1: string;
  fighter2: string;
  predictedWinner: string;
  fighter1WinPercent: number;
  fighter2WinPercent: number;
  fighter1EV: number;
  fighter2EV: number;
  fighter1Odds: number;
  fighter2Odds: number;
}
