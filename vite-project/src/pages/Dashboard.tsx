// Dashboard.tsx
import React, { useState } from 'react';
import { Event, Match } from '../types';
import EventForm from '../components/EventForm';
import EventCard from '../components/EventCard';
import { apiService } from '../services/api';

const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  const handleAddEvent = (eventName: string, eventDate: string) => {
    const newEvent: Event = {
      id: crypto.randomUUID(),
      name: eventName,
      date: eventDate,
      matches: [],
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const handleUpdateEvent = (eventId: string, newName: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, name: newName } : event
    ));
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const handleUpdateMatches = (eventId: string, matches: Match[]) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, matches } : event
    ));
  };

  const handleUpdateMatchResult = async (eventId: string, matchId: string, result: "pending" | "hit" | "miss") => {
    try {
      await apiService.updateMatchResult(matchId, result);
      
      // Update local state
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? {
              ...event,
              matches: event.matches.map(match =>
                match.id === matchId ? { ...match, result } : match
              )
            }
          : event
      ));
    } catch (error) {
      console.error('Failed to update match result:', error);
      alert('Failed to update result. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Event</h2>
        <EventForm onSubmit={handleAddEvent} />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Events ({events.length})
        </h2>
        
        {events.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No events</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first UFC event.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onUpdateEvent={handleUpdateEvent}
                onDeleteEvent={handleDeleteEvent}
                onUpdateMatches={handleUpdateMatches}
                onUpdateMatchResult={handleUpdateMatchResult}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
