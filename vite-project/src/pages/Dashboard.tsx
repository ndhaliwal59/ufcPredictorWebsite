import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import { Event, Match } from '../types';
import EventForm from '../components/EventForm';
import EventCard from '../components/EventCard';
import { apiService } from '../services/api';

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const [, setLocation] = useLocation();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Logout handler
  const handleLogout = () => {
    logout();
    setLocation('/'); // Redirect to login page
  };

  // Load events when component mounts
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getEvents();
      
      if (Array.isArray(response)) {
        
        // Transform the response to match frontend expectations
        const eventsWithMatches = response.map(event => ({
          ...event,
          matches: (event.matches || []).map((match: any) => {
            
            return {
              ...match,
              // Map prediction_data to prediction for frontend compatibility
              prediction: match.prediction_data || match.prediction,
              // Keep original prediction_data as well
              prediction_data: match.prediction_data
            };
          })
        }));
        
        setEvents(eventsWithMatches);
      } else {
        console.error('API response is not an array:', response);
        setEvents([]);
      }
    } catch (error) {
      console.error('Failed to load events:', error);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (eventName: string, eventDate: string, location: string) => {
    try {
      setError(null);
      const response = await apiService.createEvent(eventName, eventDate, location);
      if (response) {
        // Ensure the new event has a matches array
        const newEvent = { ...response, matches: response.matches || [] };
        setEvents(prev => [newEvent, ...prev]);
      }
    } catch (error) {
      console.error('Failed to create event:', error);
      setError('Failed to create event. Please try again.');
    }
  };

  const handleUpdateEvent = async (eventId: string, newName: string, newDate: string, newLocation: string) => {
    try {
      setError(null);
      const response = await apiService.updateEvent(eventId, newName, newDate, newLocation);
      if (response) {
        setEvents(prev => prev.map(event => 
          event.id === eventId ? { ...response, matches: response.matches || event.matches || [] } : event
        ));
      }
    } catch (error) {
      console.error('Failed to update event:', error);
      setError('Failed to update event. Please try again.');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      setError(null);
      await apiService.deleteEvent(eventId);
      setEvents(prev => prev.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Failed to delete event:', error);
      setError('Failed to delete event. Please try again.');
    }
  };

  const handleUpdateMatches = (eventId: string, matches: Match[]) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, matches: matches || [] } : event
    ));
  };

  const handleUpdateMatchResult = async (eventId: string, matchId: string, result: "pending" | "hit" | "miss") => {
    try {
      setError(null);
      await apiService.updateMatchResult(matchId, result);
      
      // Update local state
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? {
              ...event,
              matches: (event.matches || []).map(match =>
                match.id === matchId ? { ...match, result } : match
              )
            }
          : event
      ));
    } catch (error) {
      console.error('Failed to update match result:', error);
      setError('Failed to update result. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Logout Button */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">UFC Predictions Dashboard</h1>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Global Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
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
