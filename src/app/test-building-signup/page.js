'use client';

import React from 'react';
import FloatingUpdatesButton from '@/components/condo/FloatingUpdatesButton';

export default function TestBuildingSignup() {
  return (
    <div className="container mt-5">
      <h1>Test Building Signup Feature</h1>
      <p>This page tests the building signup functionality.</p>
      
      <div className="row">
        <div className="col-md-6">
          <h3>Test Building 1</h3>
          <FloatingUpdatesButton 
            buildingSlug="test-building-1"
            buildingAddress="123 Test Street, Test City"
          />
        </div>
        
        <div className="col-md-6">
          <h3>Test Building 2</h3>
          <FloatingUpdatesButton 
            buildingSlug="test-building-2"
            buildingAddress="456 Another Street, Another City"
          />
        </div>
      </div>
      
      <div className="mt-4">
        <h3>Instructions:</h3>
        <ol>
          <li>Click the &quot;Get Updates&quot; button on either building</li>
          <li>The modal should open with a custom message about the building</li>
          <li>The modal should automatically switch to the signup tab</li>
          <li>Fill out the signup form</li>
          <li>After signup, a saved search should be created for that building</li>
        </ol>
      </div>
    </div>
  );
}
