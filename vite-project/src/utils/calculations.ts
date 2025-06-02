// utils/calculations.ts
import type { MethodPrediction, BackendPredictionResponse, MatchPrediction } from '../types';

export function parseOddsToNumber(odds: string): number {
  // Remove any whitespace
  const cleanOdds = odds.trim();
  
  // Remove + or - sign and convert to number
  const numericOdds = parseInt(cleanOdds.replace(/[+-]/, ''));
  
  // Return with proper sign
  if (cleanOdds.startsWith('-')) {
    return -numericOdds;
  } else {
    return numericOdds;
  }
}

export function calculateEV(winPercent: number, odds: string): number {
  // Parse odds string to get numeric value
  const numericOdds = parseOddsToNumber(odds);
  
  // Convert American odds to decimal odds
  const decimalOdds = numericOdds > 0 ? (numericOdds / 100) + 1 : (100 / Math.abs(numericOdds)) + 1;
  
  // Calculate Expected Value: (Win Probability * Payout) - (Loss Probability * Stake)
  const winProbability = winPercent / 100;
  const lossProbability = 1 - winProbability;
  const payout = decimalOdds - 1; // Profit per $1 bet
  
  const ev = (winProbability * payout) - (lossProbability * 1);
  
  return Math.round(ev * 100) / 100; // Round to 2 decimal places
}

export function parseMethodPercentages(methodStrings: string[] | undefined): MethodPrediction[] {
  if (!methodStrings || !Array.isArray(methodStrings)) {
    return [];
  }
  
  return methodStrings.map(str => {
    try {
      // Handle different potential formats
      const parts = str.split(':');
      if (parts.length === 2) {
        const method = parts[0].trim();
        const percentStr = parts[1].trim().replace('%', '').replace(' ', '');
        const percentage = parseFloat(percentStr) || 0;
        return { method, percentage };
      }
      
      // Fallback - try to extract method and percentage from string
      const match = str.match(/^(.+?)[\s:]+(\d+\.?\d*)%?$/);
      if (match) {
        const method = match[1].trim();
        const percentage = parseFloat(match[2]) || 0;
        return { method, percentage };
      }
      
      // Final fallback
      return { method: str, percentage: 0 };
    } catch (error) {
      console.warn('Failed to parse method percentage:', str, error);
      return { method: str, percentage: 0 };
    }
  });
}

export function transformBackendResponse(
  backendData: BackendPredictionResponse['data'],
  fighter1Odds: string,
  fighter2Odds: string
): MatchPrediction {
  const fighter1WinPercent = parseFloat(backendData.fighter_1_win_percentage.replace('%', ''));
  const fighter2WinPercent = parseFloat(backendData.fighter_2_win_percentage.replace('%', ''));

  const fighter1EV = calculateEV(fighter1WinPercent, fighter1Odds);
  const fighter2EV = calculateEV(fighter2WinPercent, fighter2Odds);

  const confidence = Math.max(fighter1WinPercent, fighter2WinPercent);

  return {
    fighter1: backendData.fighter_1_name,
    fighter2: backendData.fighter_2_name,
    predictedWinner: backendData.predicted_winner,
    fighter1WinPercent,
    fighter2WinPercent,
    fighter1EV,
    fighter2EV,
    fighter1Odds,
    fighter2Odds,
    confidence,
    shapPlot: backendData.shap_plot,
    fighter1MethodPercentages: parseMethodPercentages(backendData.fighter_1_method_percentages),
    fighter2MethodPercentages: parseMethodPercentages(backendData.fighter_2_method_percentages),
  };
}
