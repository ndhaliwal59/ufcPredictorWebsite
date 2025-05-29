// components/EventForm.tsx
import React, { useState } from 'react';

interface EventFormProps {
  onSubmit: (eventName: string, eventDate: string, location: string) => void;
}

const EventForm: React.FC<EventFormProps> = ({ onSubmit }) => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (eventName.trim() && eventDate) {
      onSubmit(eventName.trim(), eventDate, location.trim());
      setEventName('');
      setEventDate('');
      setLocation('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input
        type="text"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        placeholder="Event name (e.g., UFC 300)"
        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-2 text-black"
        required
      />
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location (e.g., Las Vegas, Nevada)"
        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-2 text-black"
      />
      <div className="flex gap-2">
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
        >
          Add Event
        </button>
      </div>
    </form>
  );
};

export default EventForm;
