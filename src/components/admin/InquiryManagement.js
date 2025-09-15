'use client';

import React, { useState } from 'react';
import { updateInquiryStatus } from '@/lib/adminService';

export default function InquiryManagement({ inquiries, onUpdate, userId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filter, setFilter] = useState('all');

  const handleStatusUpdate = async (inquiryId, newStatus) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await updateInquiryStatus(inquiryId, newStatus, userId);
      if (result.success) {
        setSuccess('Status updated successfully');
        onUpdate();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    if (filter === 'all') return true;
    return inquiry.status === filter;
  });

  const statusOptions = [
    { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-800' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-800' }
  ];

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    normal: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Inquiry Management</h2>
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Inquiries</option>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="text-sm text-gray-500">
            {filteredInquiries.length} inquiries
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inquiry
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Building
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInquiries.map((inquiry) => (
              <tr key={inquiry.id}>
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {inquiry.subject}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {inquiry.message}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Type: {inquiry.type}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {inquiry.user.name || 'No name'}
                    </div>
                    <div className="text-sm text-gray-500">{inquiry.user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {inquiry.agent ? (
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {inquiry.agent.name}
                      </div>
                      <div className="text-sm text-gray-500">{inquiry.agent.email}</div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Unassigned</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {inquiry.building ? (
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {inquiry.building.name}
                      </div>
                      <div className="text-sm text-gray-500">/{inquiry.building.slug}</div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    statusOptions.find(s => s.value === inquiry.status)?.color || 'bg-gray-100 text-gray-800'
                  }`}>
                    {statusOptions.find(s => s.value === inquiry.status)?.label || inquiry.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    priorityColors[inquiry.priority] || 'bg-gray-100 text-gray-800'
                  }`}>
                    {inquiry.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(inquiry.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <select
                    value={inquiry.status}
                    onChange={(e) => handleStatusUpdate(inquiry.id, e.target.value)}
                    disabled={loading}
                    className="text-sm border border-gray-300 rounded px-2 py-1 disabled:opacity-50"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredInquiries.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No inquiries found</div>
        </div>
      )}
    </div>
  );
}
