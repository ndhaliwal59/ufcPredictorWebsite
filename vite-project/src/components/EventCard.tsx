import React, { useState } from 'react';
import { Event, Match } from '../types';
import { generateMatchPrediction } from '../utils/predictions';
import MatchForm from './MatchForm';
import MatchTable from './MatchTable';
import EventForm from './EventForm';

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddMatch = (matchData: Omit<Match, 'id' | 'prediction'>) => {
    const newMatch: Match = {
      ...matchData,
      id: crypto.randomUUID(),
      prediction: generateMatchPrediction(matchData as Match),
    };
    
    const updatedMatches = [...event.matches, newMatch];
    onUpdateMatches(event.id, updatedMatches);
  };

  const handleDeleteMatch = (matchId: string) => {
    const updatedMatches = event.matches.filter(match => match.id !== matchId);
    onUpdateMatches(event.id, updatedMatches);
  };

  const handleUpdateEvent = (newName: string) => {
    onUpdateEvent(event.id, newName);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        {isEditing ? (
          <EventForm
            onSubmit={handleUpdateEvent}
            initialValue={event.name}
            isEditing={true}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-900">{event.name}</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {event.matches.length} matches
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteEvent(event.id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {isExpanded ? 'Collapse' : 'Manage Matches'}
              </button>
            </div>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="p-6 space-y-6">
          <MatchForm onSubmit={handleAddMatch} />
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Matches & Predictions</h3>
            <MatchTable matches={event.matches} onDeleteMatch={handleDeleteMatch} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCard;
