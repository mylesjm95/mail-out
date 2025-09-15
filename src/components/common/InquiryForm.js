'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createInquiry } from '@/actions/adminActions';

export default function InquiryForm({ buildingSlug, listingKey, agentId, buildingId }) {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Please sign in to submit an inquiry');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.target);
      formData.append('userId', user.id);
      if (agentId) formData.append('agentId', agentId);
      if (buildingId) formData.append('buildingId', buildingId);
      if (listingKey) formData.append('listingKey', listingKey);

      const result = await createInquiry(formData);
      
      if (result.success) {
        setSuccess(true);
        e.target.reset();
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred while submitting your inquiry');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
        <h3 className="font-medium">Inquiry Submitted Successfully!</h3>
        <p className="text-sm">We'll get back to you soon.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {buildingSlug ? 'Contact Us About This Building' : 'Have a Question?'}
      </h3>
      
      {!isAuthenticated && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4">
          <p className="text-sm">Please sign in to submit an inquiry.</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject *
          </label>
          <input
            type="text"
            name="subject"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="What would you like to know?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            name="type"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="question">General Question</option>
            <option value="tour_request">Request Tour</option>
            <option value="pricing">Pricing Information</option>
            <option value="availability">Check Availability</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message *
          </label>
          <textarea
            name="message"
            rows="4"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Please provide more details about your inquiry..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            name="priority"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !isAuthenticated}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Inquiry'}
        </button>
      </form>
    </div>
  );
}
