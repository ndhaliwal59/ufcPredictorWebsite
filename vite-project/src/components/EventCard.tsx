import React, { useState } from 'react';
import { Event, Match } from '../types';
import MatchForm from './MatchForm';
import MatchTable from './MatchTable';
import { apiService } from '../services/api';
import { transformBackendResponse } from '../utils/calculations';

interface EventCardProps {
  event: Event;
  onUpdateEvent: (eventId: string, newName: string, newDate: string, newLocation: string) => void;
  onDeleteEvent: (eventId: string) => void;
  onUpdateMatches: (eventId: string, matches: Match[]) => void;
  onUpdateMatchResult: (eventId: string, matchId: string, result: "pending" | "hit" | "miss") => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onUpdateEvent,
  onDeleteEvent,
  onUpdateMatches,
  onUpdateMatchResult,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(event.name);
  const [editDate, setEditDate] = useState(event.date);
  const [editLocation, setEditLocation] = useState(event.location || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>(event.matches || []);

  React.useEffect(() => {
    setMatches(event.matches || []);
  }, [event.matches]);

  const handleSaveEdit = async () => {
    if (editName.trim() && editDate) {
      await onUpdateEvent(event.id, editName.trim(), editDate, editLocation.trim());
      setIsEditing(false);
    }
  };

  const handleAddMatch = async (matchData: Omit<Match, 'id' | 'prediction' | 'result'>) => {
    setLoading(true);
    setError(null);
    
    try {

      // Get prediction from ML model
      const response = await apiService.getPrediction(
        matchData.fighter1,
        matchData.fighter2,
        matchData.eventDate,
        matchData.referee
      );

      if (response.success) {
        // Transform the backend response to frontend format
        const prediction = transformBackendResponse(
          response.data,
          matchData.odds1,
          matchData.odds2
        );

        // Create the new match object with both prediction fields
        const newMatch: Match = {
          id: `temp-${Date.now()}`, // Temporary ID, will be replaced by backend
          fighter1: matchData.fighter1,
          fighter2: matchData.fighter2,
          odds1: matchData.odds1,
          odds2: matchData.odds2,
          referee: matchData.referee,
          weightclass: matchData.weightclass, // Make sure this is included
          eventDate: matchData.eventDate,
          prediction: prediction, // For immediate UI display
          prediction_data: prediction, // For backend consistency
          result: "pending"
        };

        // Prepare match data for database - INCLUDE WEIGHTCLASS
        const matchPayload = {
          fighter1: matchData.fighter1,
          fighter2: matchData.fighter2,
          odds1: matchData.odds1,
          odds2: matchData.odds2,
          referee: matchData.referee,
          weightclass: matchData.weightclass, // <-- CRITICAL: Include weightclass
          event_date: matchData.eventDate,
          prediction_data: prediction // Send the full prediction object
        };

        // Create match in database
        const matchResponse = await apiService.createMatch(event.id, matchPayload);

        if (matchResponse) {
          // Update the match with the real ID from backend
          const finalMatch: Match = {
            ...newMatch,
            id: matchResponse.id,
            prediction: matchResponse.prediction_data || prediction,
            prediction_data: matchResponse.prediction_data || prediction
          };

          const updatedMatches = [...matches, finalMatch];
          setMatches(updatedMatches);
          onUpdateMatches(event.id, updatedMatches);
          
        }
      } else {
        throw new Error('Failed to generate prediction');
      }
    } catch (error) {
      console.error('=== MATCH CREATION ERROR ===', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Failed to create match: ${errorMessage}`);
      alert('Failed to generate prediction or save match. Please check the fighter names and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMatch = async (matchId: string) => {
    try {
      setError(null);
      await apiService.deleteMatch(matchId);
      const updatedMatches = matches.filter(match => match.id !== matchId);
      setMatches(updatedMatches);
      onUpdateMatches(event.id, updatedMatches);
    } catch (error) {
      console.error('Failed to delete match:', error);
      setError('Failed to delete match. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    // Use the same date formatting logic to avoid timezone issues
    const [year, month, day] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isPastEvent = new Date(event.date) < new Date();

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Event Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3 py-2 text-gray-900 rounded-md"
              placeholder="Event name"
            />
            <input
              type="text"
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              className="w-full px-3 py-2 text-gray-900 rounded-md"
              placeholder="Location"
            />
            <input
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="px-3 py-2 text-gray-900 rounded-md"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md text-sm"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditName(event.name);
                  setEditDate(event.date);
                  setEditLocation(event.location || '');
                }}
                className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-md text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold">{event.name}</h3>
              <p className="text-blue-100 mt-1">{formatDate(event.date)}</p>
              {event.location && (
                <p className="text-blue-200 text-sm mt-1">{event.location}</p>
              )}
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm bg-blue-500 px-2 py-1 rounded">
                  {matches.length} match{matches.length !== 1 ? 'es' : ''}
                </span>
                {isPastEvent && (
                  <span className="text-sm bg-yellow-500 px-2 py-1 rounded">
                    Past Event
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this event?')) {
                    onDeleteEvent(event.id);
                  }
                }}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <div className="flex">
            <div className="flex-1">{error}</div>
            <button
              onClick={() => setError(null)}
              className="ml-4 text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {loading && (
          <div className="text-center py-4">
            <div className="text-lg text-gray-600">Generating prediction...</div>
          </div>
        )}

        {/* Matches Table */}
        {matches.length > 0 && (
          <div className="mb-8">
            <MatchTable
              matches={matches}
              onDeleteMatch={handleDeleteMatch}
              onUpdateMatchResult={(matchId, result) => onUpdateMatchResult(event.id, matchId, result)}
            />
          </div>
        )}

        {/* Add Match Form - Now always visible */}
        <div className="space-y-4">
          {isPastEvent && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <div className="flex">
                <svg className="h-5 w-5 text-yellow-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-yellow-800">
                  <strong>Past Event:</strong> This event has already occurred. You can still add matches for record-keeping purposes.
                </p>
              </div>
            </div>
          )}
          
          <MatchForm
            onSubmit={handleAddMatch}
            eventDate={event.date}
            disabled={loading}
          />
        </div>

        {/* Empty state for past events with no matches - now only shows if no form is rendered */}
        {matches.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <p>No matches added yet. Use the form above to add matches.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default EventCard;
