'use client';

import React, { useState } from 'react';
import { assignAgentToUser } from '@/lib/adminService';

export default function UserManagement({ users, agents, onUpdate, userId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleAssignAgent = async (userId, agentId) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await assignAgentToUser(userId, agentId, userId);
      if (result.success) {
        setSuccess('Agent assigned successfully');
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

  const handleRemoveAgent = async (userId) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await assignAgentToUser(userId, null, userId);
      if (result.success) {
        setSuccess('Agent removed successfully');
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <div className="text-sm text-gray-500">
          {users.length} total users
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
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned Agent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Saved Searches
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inquiries
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {user.name || 'No name'}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-red-100 text-red-800'
                      : user.role === 'agent'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.assignedAgent ? (
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.assignedAgent.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.assignedAgent.email}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">No agent assigned</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user._count.savedSearches}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user._count.inquiries}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-col space-y-2">
                    {user.assignedAgent ? (
                      <button
                        onClick={() => handleRemoveAgent(user.id)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        Remove Agent
                      </button>
                    ) : (
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAssignAgent(user.id, e.target.value);
                          }
                        }}
                        disabled={loading}
                        className="text-sm border border-gray-300 rounded px-2 py-1 disabled:opacity-50"
                        defaultValue=""
                      >
                        <option value="">Assign Agent</option>
                        {agents
                          .filter(agent => agent.isActive)
                          .map(agent => (
                            <option key={agent.id} value={agent.id}>
                              {agent.name}
                            </option>
                          ))}
                      </select>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No users found</div>
        </div>
      )}
    </div>
  );
}
