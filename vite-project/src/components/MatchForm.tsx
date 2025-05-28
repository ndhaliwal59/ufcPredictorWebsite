// components/MatchForm.tsx
import React, { useState, useEffect } from 'react';
import { Match } from '../types';
import { apiService } from '../services/api';

interface MatchFormProps {
  onSubmit: (match: Omit<Match, 'id' | 'prediction' | 'result'>) => void;
  eventDate: string;
}

const MatchForm: React.FC<MatchFormProps> = ({ onSubmit, eventDate }) => {
  const [formData, setFormData] = useState({
    fighter1: '',
    fighter2: '',
    odds1: '',
    odds2: '',
    referee: '',
  });
  
  const [suggestions, setSuggestions] = useState<{
    fighters: string[];
    referees: string[];
  }>({
    fighters: [],
    referees: [],
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReferees();
  }, []);

  const loadReferees = async () => {
    try {
      const response = await apiService.getReferees();
      if (response.success) {
        setSuggestions(prev => ({
          ...prev,
          referees: Object.keys(response.data.top_referees),
        }));
      }
    } catch (error) {
      console.error('Failed to load referees:', error);
    }
  };

  const searchFighters = async (query: string) => {
    if (query.length < 2) return;
    
    try {
      const response = await apiService.searchFighters(query);
      if (response.success) {
        setSuggestions(prev => ({
          ...prev,
          fighters: response.data.matches,
        }));
      }
    } catch (error) {
      console.error('Failed to search fighters:', error);
    }
  };

  const formatOdds = (value: string): string => {
    if (!value) return '';
    
    const trimmedValue = value.trim();
    
    if (trimmedValue === '-') return '-';
    if (trimmedValue === '+') return '+';
    
    const isNegative = trimmedValue.startsWith('-');
    const isPositive = trimmedValue.startsWith('+');
    
    const numericValue = trimmedValue.replace(/[^\d]/g, '');
    
    if (!numericValue) {
      if (isNegative) return '-';
      if (isPositive) return '+';
      return '+';
    }
    
    if (isNegative) {
      return `-${numericValue}`;
    } else {
      return `+${numericValue}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fighter1 && formData.fighter2 && formData.referee) {
      setLoading(true);
      onSubmit({
        ...formData,
        eventDate,
      });
      setFormData({
        fighter1: '',
        fighter2: '',
        odds1: '',
        odds2: '',
        referee: '',
      });
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'odds1' || name === 'odds2') {
      const formattedValue = formatOdds(value);
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
      
      if (name === 'fighter1' || name === 'fighter2') {
        searchFighters(value);
      }
    }
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
            list="fighters-list"
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
            list="fighters-list"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fighter 1 Odds</label>
          <input
            type="text"
            name="odds1"
            value={formData.odds1}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-1"
            placeholder="e.g., -150 or +200"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fighter 2 Odds</label>
          <input
            type="text"
            name="odds2"
            value={formData.odds2}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-1"
            placeholder="e.g., -150 or +200"
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
            list="referees-list"
            required
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {loading ? 'Generating Prediction...' : 'Add Match & Generate Prediction'}
          </button>
        </div>
      </form>

      <datalist id="fighters-list">
        {suggestions.fighters.map((fighter) => (
          <option key={fighter} value={fighter} />
        ))}
      </datalist>
      
      <datalist id="referees-list">
        {suggestions.referees.map((referee) => (
          <option key={referee} value={referee} />
        ))}
      </datalist>
    </div>
  );
};

export default MatchForm;
