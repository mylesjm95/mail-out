'use client';

import React, { useState } from 'react';
import { createBuilding, updateBuilding, deleteBuilding } from '@/lib/adminService';

export default function BuildingManagement({ buildings, onUpdate, userId }) {
  const [showModal, setShowModal] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.target);
      formData.append('userId', userId);

      // Convert address fields to JSON
      const address = {
        street: formData.get('street'),
        city: formData.get('city'),
        state: formData.get('state'),
        zipCode: formData.get('zipCode'),
        country: formData.get('country') || 'Canada'
      };
      formData.set('address', JSON.stringify(address));

      const result = editingBuilding 
        ? await updateBuilding(formData)
        : await createBuilding(formData);

      if (result.success) {
        setShowModal(false);
        setEditingBuilding(null);
        e.target.reset();
        onUpdate();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (building) => {
    setEditingBuilding(building);
    setShowModal(true);
  };

  const handleDelete = async (buildingId) => {
    if (!confirm('Are you sure you want to delete this building?')) return;

    setLoading(true);
    try {
      const result = await deleteBuilding(buildingId, userId);
      if (result.success) {
        onUpdate();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBuilding(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Building Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Building
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Building
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned Agents
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amenities
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Photos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {buildings.map((building) => (
              <tr key={building.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{building.name}</div>
                    <div className="text-sm text-gray-500">/{building.slug}</div>
                    {building.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs mt-1">
                        {building.description}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {building.address.street && (
                      <div>{building.address.street}</div>
                    )}
                    <div>
                      {building.address.city}, {building.address.state} {building.address.zipCode}
                    </div>
                    {building.address.country && (
                      <div className="text-gray-500">{building.address.country}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    {building.buildingAgents && building.buildingAgents.length > 0 ? (
                      building.buildingAgents.slice(0, 2).map((buildingAgent, index) => (
                        <div key={index} className="flex items-center space-x-1">
                          <span className="text-sm text-gray-900">
                            {buildingAgent.agent?.name || 'Unknown Agent'}
                          </span>
                          {buildingAgent.isPrimary && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              Primary
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">No agents assigned</span>
                    )}
                    {building.buildingAgents && building.buildingAgents.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{building.buildingAgents.length - 2} more
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {building.amenities.slice(0, 3).map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {amenity}
                      </span>
                    ))}
                    {building.amenities.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{building.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {building.photos.length} photos
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    building.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {building.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(building)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(building.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingBuilding ? 'Edit Building' : 'Add New Building'}
              </h3>
              
              <form onSubmit={handleSubmit}>
                {editingBuilding && (
                  <input type="hidden" name="buildingId" value={editingBuilding.id} />
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Building Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      defaultValue={editingBuilding?.name || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug *
                    </label>
                    <input
                      type="text"
                      name="slug"
                      required
                      defaultValue={editingBuilding?.slug || ''}
                      placeholder="building-name-slug"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows="3"
                    defaultValue={editingBuilding?.description || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="street"
                      placeholder="Street Address"
                      defaultValue={editingBuilding?.address?.street || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      defaultValue={editingBuilding?.address?.city || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State/Province"
                      defaultValue={editingBuilding?.address?.state || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="Postal Code"
                      defaultValue={editingBuilding?.address?.zipCode || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="amenities"
                    defaultValue={editingBuilding?.amenities?.join(', ') || ''}
                    placeholder="e.g., Gym, Pool, Concierge, Parking"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {editingBuilding && (
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        value="true"
                        defaultChecked={editingBuilding.isActive}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Active</span>
                    </label>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingBuilding ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
