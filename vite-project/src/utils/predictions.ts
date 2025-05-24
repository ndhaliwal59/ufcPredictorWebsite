import { Match, MatchPrediction } from '../types';

export const generateMatchPrediction = (match: Match): MatchPrediction => {
  // Mock prediction logic - replace with actual ML model later
  const fighter1WinPercent = Math.random() * 100;
  const fighter2WinPercent = 100 - fighter1WinPercent;
  
  const predictedWinner = fighter1WinPercent > fighter2WinPercent ? match.fighter1 : match.fighter2;
  
  // Calculate Expected Value (simplified)
  const fighter1EV = (fighter1WinPercent / 100) * match.odds1 - 1;
  const fighter2EV = (fighter2WinPercent / 100) * match.odds2 - 1;
  
  return {
    fighter1: match.fighter1,
    fighter2: match.fighter2,
    predictedWinner,
    fighter1WinPercent: Math.round(fighter1WinPercent * 100) / 100,
    fighter2WinPercent: Math.round(fighter2WinPercent * 100) / 100,
    fighter1EV: Math.round(fighter1EV * 100) / 100,
    fighter2EV: Math.round(fighter2EV * 100) / 100,
    fighter1Odds: match.odds1,
    fighter2Odds: match.odds2,
  };
};
