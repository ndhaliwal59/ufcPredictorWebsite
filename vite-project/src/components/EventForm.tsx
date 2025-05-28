// components/EventForm.tsx
import React, { useState } from 'react';

interface EventFormProps {
  onSubmit: (eventName: string, eventDate: string) => void;
}

const EventForm: React.FC<EventFormProps> = ({ onSubmit }) => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (eventName.trim() && eventDate) {
      onSubmit(eventName.trim(), eventDate);
      setEventName('');
      setEventDate('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4">
      <input
        type="text"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        placeholder="Event name (e.g., UFC 300)"
        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-2 text-black"
        required
      />
      <input
        type="date"
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-2"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
      >
        Add Event
      </button>
    </form>
  );
};

export default EventForm;
