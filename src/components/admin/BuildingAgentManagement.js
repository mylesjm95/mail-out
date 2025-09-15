'use client';

import React, { useState, useEffect } from 'react';
import { getBuildingAgents, assignAgentToBuilding, removeAgentFromBuilding } from '@/lib/adminService';

export default function BuildingAgentManagement({ buildings, agents, onUpdate, userId }) {
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [buildingAgents, setBuildingAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (selectedBuilding) {
      loadBuildingAgents();
    } else {
      setBuildingAgents([]);
    }
  }, [selectedBuilding]);

  const loadBuildingAgents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getBuildingAgents(selectedBuilding, userId);
      if (result.success) {
        setBuildingAgents(result.buildingAgents);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load building agents');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignAgent = async (agentId, isPrimary = false) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await assignAgentToBuilding(selectedBuilding, agentId, isPrimary, userId);
      if (result.success) {
        setSuccess('Agent assigned successfully');
        loadBuildingAgents();
        onUpdate();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to assign agent');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAgent = async (agentId) => {
    if (!confirm('Are you sure you want to remove this agent from the building?')) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await removeAgentFromBuilding(selectedBuilding, agentId, userId);
      if (result.success) {
        setSuccess('Agent removed successfully');
        loadBuildingAgents();
        onUpdate();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to remove agent');
    } finally {
      setLoading(false);
    }
  };

  const availableAgents = agents.filter(agent => 
    agent.isActive && 
    !buildingAgents.some(ba => ba.agent.id === agent.id)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Building-Agent Assignments</h2>
        <div className="text-sm text-gray-500">
          Assign agents to buildings for inquiry routing
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

      {/* Building Selection */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Select Building</h3>
        <select
          value={selectedBuilding}
          onChange={(e) => setSelectedBuilding(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Choose a building...</option>
          {buildings
            .filter(building => building.isActive)
            .map(building => (
              <option key={building.id} value={building.id}>
                {building.name} ({building.buildingAgents?.length || 0} agents)
              </option>
            ))}
        </select>
      </div>

      {selectedBuilding && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assigned Agents */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Assigned Agents</h3>
            
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading...</p>
              </div>
            ) : buildingAgents.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No agents assigned to this building</p>
            ) : (
              <div className="space-y-3">
                {buildingAgents.map((buildingAgent) => (
                  <div key={buildingAgent.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-medium text-gray-900">
                          {buildingAgent.agent.name}
                          {buildingAgent.isPrimary && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Primary
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{buildingAgent.agent.email}</div>
                        {buildingAgent.agent.phone && (
                          <div className="text-sm text-gray-500">{buildingAgent.agent.phone}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {!buildingAgent.isPrimary && (
                        <button
                          onClick={() => handleAssignAgent(buildingAgent.agent.id, true)}
                          disabled={loading}
                          className="text-blue-600 hover:text-blue-900 text-sm disabled:opacity-50"
                        >
                          Set Primary
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveAgent(buildingAgent.agent.id)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-900 text-sm disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available Agents */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Available Agents</h3>
            
            {availableAgents.length === 0 ? (
              <p className="text-gray-500 text-center py-4">All agents are already assigned to this building</p>
            ) : (
              <div className="space-y-3">
                {availableAgents.map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{agent.name}</div>
                      <div className="text-sm text-gray-500">{agent.email}</div>
                      {agent.phone && (
                        <div className="text-sm text-gray-500">{agent.phone}</div>
                      )}
                      {agent.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {agent.specialties.slice(0, 2).map((specialty, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAssignAgent(agent.id, true)}
                        disabled={loading}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        Add as Primary
                      </button>
                      <button
                        onClick={() => handleAssignAgent(agent.id, false)}
                        disabled={loading}
                        className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
