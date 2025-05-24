import React, { useState } from 'react';
import { Match } from '../types';

interface MatchFormProps {
  onSubmit: (match: Omit<Match, 'id' | 'prediction'>) => void;
}

const MatchForm: React.FC<MatchFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    fighter1: '',
    fighter2: '',
    odds1: 0,
    odds2: 0,
    referee: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fighter1 && formData.fighter2 && formData.referee) {
      onSubmit(formData);
      setFormData({
        fighter1: '',
        fighter2: '',
        odds1: 0,
        odds2: 0,
        referee: '',
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Match</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-900">
        <div>
          <label className="block text-sm font-medium text-gray-700">Fighter 1</label>
          <input
            type="text"
            name="fighter1"
            value={formData.fighter1}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fighter 2</label>
          <input
            type="text"
            name="fighter2"
            value={formData.fighter2}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fighter 1 Odds</label>
          <input
            type="number"
            name="odds1"
            value={formData.odds1}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fighter 2 Odds</label>
          <input
            type="number"
            name="odds2"
            value={formData.odds2}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-1"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Referee</label>
          <input
            type="text"
            name="referee"
            value={formData.referee}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-1"
            required
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Add Match & Generate Prediction
          </button>
        </div>
      </form>
    </div>
  );
};

export default MatchForm;
