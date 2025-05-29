// components/MatchTable.tsx
import React, { useState } from 'react';
import { Match } from '../types';

interface MatchTableProps {
  matches: Match[];
  onDeleteMatch: (matchId: string) => void;
  onUpdateMatchResult: (matchId: string, result: "pending" | "hit" | "miss") => void;
}

const MatchTable: React.FC<MatchTableProps> = ({ matches, onDeleteMatch, onUpdateMatchResult }) => {
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);

  console.log('=== MATCH TABLE DEBUG ===');
  console.log('Matches received:', matches);
  
  matches.forEach((match, index) => {
    console.log(`Match ${index}:`, match);
    console.log(`  Prediction:`, match.prediction);
    console.log(`  Prediction data:`, match.prediction_data);
  });

  if (matches.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No matches added yet. Add your first match above.
      </div>
    );
  }

  const toggleExpanded = (matchId: string) => {
    setExpandedMatch(expandedMatch === matchId ? null : matchId);
  };

  const getResultBadge = (result: "pending" | "hit" | "miss") => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      hit: "bg-green-100 text-green-800",
      miss: "bg-red-100 text-red-800"
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[result]}`}>
        {result.charAt(0).toUpperCase() + result.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fighters
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Predicted Winner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Win % / Confidence
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expected Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Odds
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Referee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Result
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {matches.map((match) => (
              <React.Fragment key={match.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="space-y-1">
                      <div>{match.fighter1}</div>
                      <div className="text-gray-600">vs</div>
                      <div>{match.fighter2}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {match.prediction?.predictedWinner || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="space-y-1">
                      <div>{match.fighter1}: {match.prediction?.fighter1WinPercent || 0}%</div>
                      <div>{match.fighter2}: {match.prediction?.fighter2WinPercent || 0}%</div>
                      {match.prediction?.confidence && (
                        <div className="text-xs text-gray-500">
                          Confidence: {match.prediction.confidence.toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="space-y-1">
                      <div className={match.prediction?.fighter1EV && match.prediction.fighter1EV > 0 ? 'text-green-600' : 'text-red-600'}>
                        {match.fighter1}: {match.prediction?.fighter1EV?.toFixed(2) || 0}
                      </div>
                      <div className={match.prediction?.fighter2EV && match.prediction.fighter2EV > 0 ? 'text-green-600' : 'text-red-600'}>
                        {match.fighter2}: {match.prediction?.fighter2EV?.toFixed(2) || 0}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="space-y-1">
                      <div>{match.fighter1}: {match.odds1}</div>
                      <div>{match.fighter2}: {match.odds2}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {match.referee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="space-y-2">
                      {getResultBadge(match.result)}
                      <div className="flex space-x-1">
                        <button
                          onClick={() => onUpdateMatchResult(match.id, "hit")}
                          className="text-xs bg-green-100 hover:bg-green-200 text-green-800 px-2 py-1 rounded transition-colors"
                          disabled={match.result === "hit"}
                        >
                          Hit
                        </button>
                        <button
                          onClick={() => onUpdateMatchResult(match.id, "miss")}
                          className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded transition-colors"
                          disabled={match.result === "miss"}
                        >
                          Miss
                        </button>
                        <button
                          onClick={() => onUpdateMatchResult(match.id, "pending")}
                          className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-2 py-1 rounded transition-colors"
                          disabled={match.result === "pending"}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => toggleExpanded(match.id)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      {expandedMatch === match.id ? 'Hide Details' : 'Show Details'}
                    </button>
                    <button
                      onClick={() => onDeleteMatch(match.id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                
                {/* Expanded Details */}
                {expandedMatch === match.id && match.prediction && (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 bg-gray-50">
                      <div className="space-y-6">
                        
                        {/* Method Predictions */}
                        {(match.prediction.fighter1MethodPercentages || match.prediction.fighter2MethodPercentages) && (
                          <div>
                            <h4 className="text-lg font-semibold mb-3 text-gray-900">Win Method Predictions</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {match.prediction.fighter1MethodPercentages && (
                                <div className="bg-white p-4 rounded-lg shadow">
                                  <h5 className="font-medium text-gray-900 mb-2">{match.fighter1}</h5>
                                  <div className="space-y-2">
                                    {match.prediction.fighter1MethodPercentages.map((method, index) => (
                                      <div key={index} className="flex justify-between">
                                        <span className="text-sm text-gray-600">{method.method}:</span>
                                        <span className="text-sm font-medium text-gray-600">{method.percentage.toFixed(1)}%</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {match.prediction.fighter2MethodPercentages && (
                                <div className="bg-white p-4 rounded-lg shadow">
                                  <h5 className="font-medium text-gray-900 mb-2">{match.fighter2}</h5>
                                  <div className="space-y-2">
                                    {match.prediction.fighter2MethodPercentages.map((method, index) => (
                                      <div key={index} className="flex justify-between">
                                        <span className="text-sm text-gray-600">{method.method}:</span>
                                        <span className="text-sm font-medium text-gray-600">{method.percentage.toFixed(1)}%</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* SHAP Plot */}
                        {match.prediction.shapPlot && (
                          <div>
                            <h4 className="text-lg font-semibold mb-3 text-gray-900">Feature Importance Analysis</h4>
                            <div className="bg-white p-4 rounded-lg shadow">
                              <img 
                                src={match.prediction.shapPlot} 
                                alt="SHAP Feature Analysis"
                                className="w-full h-auto max-w-4xl mx-auto"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MatchTable;
