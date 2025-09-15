'use client';

import React, { useState } from 'react';
import { uploadBuildingPhotos } from '@/lib/adminService';

export default function PhotoUpload({ buildings, onUpdate, userId }) {
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    
    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBuilding || selectedFiles.length === 0) {
      setError('Please select a building and at least one photo');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('buildingId', selectedBuilding);
      
      selectedFiles.forEach(file => {
        formData.append('photos', file);
      });

      const result = await uploadBuildingPhotos(formData);
      
      if (result.success) {
        setSuccess(`Successfully uploaded ${selectedFiles.length} photos`);
        setSelectedBuilding('');
        setSelectedFiles([]);
        setPreviewUrls([]);
        onUpdate();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred while uploading photos');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePreview = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    
    // Revoke the URL to free memory
    URL.revokeObjectURL(previewUrls[index]);
    
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
  };

  const handleReset = () => {
    // Revoke all preview URLs
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    
    setSelectedBuilding('');
    setSelectedFiles([]);
    setPreviewUrls([]);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Photo Upload</h2>
        <div className="text-sm text-gray-500">
          Upload photos for buildings
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

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Building *
            </label>
            <select
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a building...</option>
              {buildings
                .filter(building => building.isActive)
                .map(building => (
                  <option key={building.id} value={building.id}>
                    {building.name} ({building.photos.length} photos)
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Photos *
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              You can select multiple photos at once. Supported formats: JPG, PNG, GIF, WebP
            </p>
          </div>

          {previewUrls.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview ({previewUrls.length} photos)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePreview(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                    <div className="text-xs text-gray-500 mt-1 truncate">
                      {selectedFiles[index]?.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading || !selectedBuilding || selectedFiles.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Uploading...' : `Upload ${selectedFiles.length} Photos`}
            </button>
          </div>
        </form>
      </div>

      {/* Building Photos Overview */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Building Photos Overview</h3>
        <div className="space-y-4">
          {buildings
            .filter(building => building.photos.length > 0)
            .map(building => (
              <div key={building.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-900">{building.name}</h4>
                  <span className="text-sm text-gray-500">{building.photos.length} photos</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {building.photos.slice(0, 6).map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`${building.name} photo ${index + 1}`}
                      className="w-full h-20 object-cover rounded border"
                    />
                  ))}
                  {building.photos.length > 6 && (
                    <div className="w-full h-20 bg-gray-100 rounded border flex items-center justify-center text-sm text-gray-500">
                      +{building.photos.length - 6} more
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
        
        {buildings.filter(building => building.photos.length > 0).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No building photos uploaded yet
          </div>
        )}
      </div>
    </div>
  );
}
