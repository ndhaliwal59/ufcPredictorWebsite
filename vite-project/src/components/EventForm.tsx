import React, { useState } from 'react';

interface EventFormProps {
  onSubmit: (eventName: string) => void;
  initialValue?: string;
  isEditing?: boolean;
  onCancel?: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ 
  onSubmit, 
  initialValue = '', 
  isEditing = false,
  onCancel 
}) => {
  const [eventName, setEventName] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (eventName.trim()) {
      onSubmit(eventName.trim());
      if (!isEditing) {
        setEventName('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">
          Event Name
        </label>
        <input
          type="text"
          id="eventName"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 pl-2"
          placeholder="Enter event name"
          required
        />
      </div>
      <div className="flex space-x-2">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {isEditing ? 'Update Event' : 'Add Event'}
        </button>
        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default EventForm;
