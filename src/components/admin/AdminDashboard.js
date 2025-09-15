'use client';

import React, { useState, useEffect } from 'react';
import { fetchAgents, fetchBuildings, fetchUsers, fetchInquiries } from '@/lib/adminService';
import AgentManagement from './AgentManagement';
import BuildingManagement from './BuildingManagement';
import UserManagement from './UserManagement';
import InquiryManagement from './InquiryManagement';
import PhotoUpload from './PhotoUpload';
import BuildingAgentManagement from './BuildingAgentManagement';

export default function AdminDashboard({ userId }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [agents, setAgents] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [users, setUsers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [agentsResult, buildingsResult, usersResult, inquiriesResult] = await Promise.all([
        fetchAgents(userId),
        fetchBuildings(userId),
        fetchUsers(userId),
        fetchInquiries(userId)
      ]);

      if (agentsResult.success) setAgents(agentsResult.agents);
      if (buildingsResult.success) setBuildings(buildingsResult.buildings);
      if (usersResult.success) setUsers(usersResult.users);
      if (inquiriesResult.success) setInquiries(inquiriesResult.inquiries);
    } catch (err) {
      setError('Failed to load admin data');
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'agents', label: 'Agents', icon: '👥' },
    { id: 'buildings', label: 'Buildings', icon: '🏢' },
    { id: 'building-agents', label: 'Building-Agent Assignments', icon: '🔗' },
    { id: 'users', label: 'Users', icon: '👤' },
    { id: 'inquiries', label: 'Inquiries', icon: '💬' },
    { id: 'photos', label: 'Photo Upload', icon: '📸' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={loadData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage agents, buildings, and user assignments</p>
            </div>
            <div className="text-sm text-gray-500">
              Welcome back, Admin
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Agents</p>
                  <p className="text-2xl font-bold text-gray-900">{agents.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">🏢</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Buildings</p>
                  <p className="text-2xl font-bold text-gray-900">{buildings.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-2xl">👤</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <span className="text-2xl">💬</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Inquiries</p>
                  <p className="text-2xl font-bold text-gray-900">{inquiries.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <AgentManagement 
            agents={agents} 
            onUpdate={loadData}
            userId={userId}
          />
        )}

        {activeTab === 'buildings' && (
          <BuildingManagement 
            buildings={buildings} 
            onUpdate={loadData}
            userId={userId}
          />
        )}

        {activeTab === 'building-agents' && (
          <BuildingAgentManagement 
            buildings={buildings} 
            agents={agents}
            onUpdate={loadData}
            userId={userId}
          />
        )}

        {activeTab === 'users' && (
          <UserManagement 
            users={users} 
            agents={agents}
            onUpdate={loadData}
            userId={userId}
          />
        )}

        {activeTab === 'inquiries' && (
          <InquiryManagement 
            inquiries={inquiries} 
            onUpdate={loadData}
            userId={userId}
          />
        )}

        {activeTab === 'photos' && (
          <PhotoUpload 
            buildings={buildings}
            onUpdate={loadData}
            userId={userId}
          />
        )}
      </div>
    </div>
  );
}
