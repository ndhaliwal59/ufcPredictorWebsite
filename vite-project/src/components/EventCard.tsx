// components/EventCard.tsx
import React, { useState } from 'react';
import { Event, Match } from '../types';
import MatchForm from './MatchForm';
import MatchTable from './MatchTable';
import { apiService } from '../services/api';
import { transformBackendResponse } from '../utils/calculations';

interface EventCardProps {
  event: Event;
  onUpdateEvent: (eventId: string, newName: string) => void;
  onDeleteEvent: (eventId: string) => void;
  onUpdateMatches: (eventId: string, matches: Match[]) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onUpdateEvent,
  onDeleteEvent,
  onUpdateMatches,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(event.name);
  const [editDate, setEditDate] = useState(event.date);
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    onUpdateEvent(event.id, editName);
    setIsEditing(false);
  };

  const handleAddMatch = async (matchData: Omit<Match, 'id' | 'prediction'>) => {
    setLoading(true);
    try {
      console.log('Sending prediction request with data:', {
        fighter_1: matchData.fighter1,
        fighter_2: matchData.fighter2,
        event_date: matchData.eventDate,
        referee: matchData.referee,
        prediction_type: 'method'
      });

      const response = await apiService.getPrediction(
        matchData.fighter1,
        matchData.fighter2,
        matchData.eventDate,
        matchData.referee
      );

      console.log('Prediction response:', response);

      if (response.success) {
        const prediction = transformBackendResponse(
          response.data,
          matchData.odds1, // Now string
          matchData.odds2  // Now string
        );

        const newMatch: Match = {
          id: crypto.randomUUID(),
          ...matchData,
          prediction,
        };

        const updatedMatches = [...event.matches, newMatch];
        onUpdateMatches(event.id, updatedMatches);
      }
    } catch (error) {
      console.error('Detailed error:', error);
      alert('Failed to generate prediction. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMatch = (matchId: string) => {
    const updatedMatches = event.matches.filter(match => match.id !== matchId);
    onUpdateMatches(event.id, updatedMatches);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-xl font-semibold text-gray-900 border-b-2 border-blue-500 focus:outline-none bg-transparent"
              />
              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="block text-sm text-gray-600 border rounded px-2 py-1"
              />
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{event.name}</h3>
              <p className="text-sm text-gray-600">{event.date}</p>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteEvent(event.id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <MatchForm onSubmit={handleAddMatch} eventDate={event.date} />
        
        {loading && (
          <div className="text-center py-4">
            <div className="text-blue-600">Generating prediction...</div>
          </div>
        )}
        
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-3">
            Matches ({event.matches.length})
          </h4>
          <MatchTable 
            matches={event.matches} 
            onDeleteMatch={handleDeleteMatch}
          />
        </div>
      </div>
    </div>
  );
};

export default EventCard;
