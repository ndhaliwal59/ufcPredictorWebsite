// types.ts
export interface Event {
  id: string;
  name: string;
  date: string;
  matches: Match[];
}

export interface Match {
  id: string;
  fighter1: string;
  fighter2: string;
  odds1: string; // Changed from number to string
  odds2: string; // Changed from number to string
  referee: string;
  eventDate: string;
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
  fighter1Odds: string; // Changed from number to string
  fighter2Odds: string; // Changed from number to string
  shapPlot?: string;
  fighter1MethodPercentages?: MethodPrediction[];
  fighter2MethodPercentages?: MethodPrediction[];
  confidence: number;
}

export interface MethodPrediction {
  method: string;
  percentage: number;
}

export interface BackendPredictionResponse {
  success: boolean;
  data: {
    fight_type: string;
    fighter_1_name: string;
    fighter_1_win_percentage: string;
    fighter_2_name: string;
    fighter_2_win_percentage: string;
    predicted_winner: string;
    event_date: string;
    referee: string;
    fighter_1_method_percentages?: string[];
    fighter_2_method_percentages?: string[];
    shap_plot?: string;
  };
}
