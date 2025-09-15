'use client'

import React, { useState, useEffect } from "react";
import { useAuth } from '@/hooks/useAuth';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';
import { createBuildingSavedSearch, removeBuildingSavedSearch } from '@/actions/savedSearchActions';
import SearchBox from "./SearchBox";
import ListingStatus from "./ListingStatus";
import PropertyType from "./PropertyType";
import PriceSlider from "./PriceRange";
import Bedroom from "./Bedroom";
import Bathroom from "./Bathroom";
import Location from "./Location";
import SquareFeet from "./SquareFeet";
import YearBuilt from "./YearBuilt";
import OtherFeatures from "./OtherFeatures";

const ListingSidebar = ({filterFunctions}) => {
  const [isSaving, setIsSaving] = useState(false);
  const { user, isAuthenticated, loading } = useAuth();
  
  // Generate search hash for subscription checking
  const searchHash = filterFunctions ? generateSearchHash(filterFunctions) : null;
  
  // Use the efficient subscription hook
  const { 
    isSubscribed: isSaved, 
    isChecking: isCheckingSaved, 
    updateSubscriptionStatus 
  } = useSubscriptionStatus(user?.id, searchHash);

  // No need for manual subscription checking - handled by the hook

  // Generate a hash based on current search criteria
  const generateSearchHash = (filters) => {
    if (!filters) return 'default-search';
    
    try {
      // Create a string representation of current filters
      const filterString = JSON.stringify({
        location: filters.location || 'any',
        propertyType: filters.propertyType || 'any',
        priceRange: filters.priceRange || 'any',
        bedrooms: filters.bedrooms || 'any',
        bathrooms: filters.bathrooms || 'any',
        // Add other filter criteria as needed
      });
      
      // Create a simple hash (you could use a more sophisticated hashing algorithm)
      return `search-${btoa(filterString).slice(0, 20)}`;
    } catch (error) {
      console.error('Error generating search hash:', error);
      // Fallback to a timestamp-based hash if JSON.stringify fails
      return `search-${Date.now()}`;
    }
  };

  const handleSaveSearch = async () => {
    if (!isAuthenticated) {
      // Show toast notification for authentication required
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast('Please login to save your search', 'error');
      }
      return;
    }

    // If already saved, remove the saved search
    if (isSaved) {
      await handleRemoveSavedSearch();
      return;
    }

    setIsSaving(true);
    try {
      // Generate search hash based on current criteria
      const searchHash = generateSearchHash(filterFunctions);
      
      // Get current search criteria from filterFunctions
      const searchCriteria = {
        location: filterFunctions?.location || 'Current Location',
        propertyType: filterFunctions?.propertyType || 'Any',
        priceRange: filterFunctions?.priceRange || 'Any',
        bedrooms: filterFunctions?.bedrooms || 'Any',
        bathrooms: filterFunctions?.bathrooms || 'Any',
        // Add other filter criteria as needed
        timestamp: new Date().toISOString()
      };

      // Create a saved search with the generated hash
      const result = await createBuildingSavedSearch(
        user.id,
        searchHash,
        searchCriteria,
        null, // emails
        searchCriteria // preferences
      );

      if (result.success) {
        updateSubscriptionStatus(true);
        // Show success toast notification
        if (typeof window !== 'undefined' && window.showToast) {
          window.showToast('Search saved successfully! You\'ll be notified of new matches.', 'success');
        }
      } else {
        // Check if it's a duplicate error
        if (result.error && result.error.includes('already subscribed')) {
          updateSubscriptionStatus(true);
          if (typeof window !== 'undefined' && window.showToast) {
            window.showToast('This search is already saved!', 'info');
          }
        } else {
          // Show error toast notification
          if (typeof window !== 'undefined' && window.showToast) {
            window.showToast(result.error || 'Failed to save search', 'error');
          }
        }
      }
    } catch (error) {
      console.error('Error saving search:', error);
      // Show error toast notification
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast('An error occurred while saving the search', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveSavedSearch = async () => {
    if (!user || !filterFunctions) return;
    
    setIsSaving(true);
    try {
      const searchHash = generateSearchHash(filterFunctions);
      
      const result = await removeBuildingSavedSearch(user.id, searchHash);
      
      if (result.success) {
        updateSubscriptionStatus(false);
        if (typeof window !== 'undefined' && window.showToast) {
          window.showToast('Search removed from saved searches', 'success');
        }
      } else {
        if (typeof window !== 'undefined' && window.showToast) {
          window.showToast(result.error || 'Failed to remove saved search', 'error');
        }
      }
    } catch (error) {
      console.error('Error removing saved search:', error);
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast('An error occurred while removing the saved search', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="list-sidebar-style1">
      <div className="widget-wrapper">
        <h6 className="list-title">Find your home</h6>
        <SearchBox filterFunctions={filterFunctions} />
      </div>
      {/* End .widget-wrapper */}

      <div className="widget-wrapper">
        <h6 className="list-title">Listing Status</h6>
        <div className="radio-element">
          <ListingStatus filterFunctions={filterFunctions} />
        </div>
      </div>
      {/* End .widget-wrapper */}

      <div className="widget-wrapper">
        <h6 className="list-title">Property Type</h6>
        <div className="checkbox-style1">
          <PropertyType filterFunctions={filterFunctions} />
        </div>
      </div>
      
      {/* End .widget-wrapper */}

      <div className="widget-wrapper">
        <h6 className="list-title">Price Range</h6>
        {/* Range Slider Desktop Version */}
        <div className="range-slider-style1">
          <PriceSlider filterFunctions={filterFunctions} />
        </div>
      </div>
      {/* End .widget-wrapper */}

      <div className="widget-wrapper">
        <h6 className="list-title">Bedrooms</h6>
        <div className="d-flex">
          <Bedroom filterFunctions={filterFunctions} />
        </div>
      </div>
      {/* End .widget-wrapper */}

      <div className="widget-wrapper">
        <h6 className="list-title">Bathrooms</h6>
        <div className="d-flex">
          <Bathroom filterFunctions={filterFunctions}  />
        </div>
      </div>
      {/* End .widget-wrapper */}

      <div className="widget-wrapper advance-feature-modal">
        <h6 className="list-title">Location</h6>
        <div className="form-style2 input-group">
          <Location filterFunctions={filterFunctions} />
        </div>
      </div>
      {/* End .widget-wrapper */}

      <div className="widget-wrapper">
        <h6 className="list-title">Square Feet</h6>
        <SquareFeet filterFunctions={filterFunctions}/>
      </div>
      {/* End .widget-wrapper */}

      <div className="widget-wrapper">
        <h6 className="list-title">Year Built</h6>
        <YearBuilt filterFunctions={filterFunctions}/>
      </div>
      {/* End .widget-wrapper */}

      <div className="widget-wrapper">
        <div className="feature-accordion">
          <div className="accordion" id="accordionExample">
            <div className="accordion-item border-none">
              <h2 className="accordion-header" id="headingOne">
                <button
                  className="accordion-button border-none p-0 after-none feature-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  <span className="flaticon-settings" /> Other Features
                </button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapse"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body p-0 mt15">
                  <OtherFeatures filterFunctions={filterFunctions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End .widget-wrapper */}

      <div className="widget-wrapper mb20">
        <div className="btn-area d-grid align-items-center">
          <button className="ud-btn btn-thm">
            <span className="flaticon-search align-text-top pr10" />
            Search
          </button>
        </div>
      </div>
      {/* End .widget-wrapper */}

      <div className="reset-area d-flex align-items-center justify-content-between">
        <div onClick={()=>filterFunctions.resetFilter()} className="reset-button cursor" href="#">
          <span className="flaticon-turn-back" />
          <u>Reset all filters</u>
        </div>
        <button 
          className={`reset-button ${isSaved ? 'saved' : ''}`}
          onClick={handleSaveSearch}
          disabled={isSaving || isCheckingSaved}
          style={{ 
            border: 'none', 
            background: 'none', 
            cursor: isSaving || isCheckingSaved ? 'not-allowed' : 'pointer',
            opacity: isSaving || isCheckingSaved ? 0.6 : 1,
            transition: 'all 0.2s ease'
          }}
          title={isSaved ? 'Click to remove this saved search' : 'Save your current search criteria to get notified of new matches'}
        >
          {isCheckingSaved || isSaving ? (
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
          ) : (
            <span 
              className={`flaticon-favourite ${isSaved ? 'text-success' : ''}`} 
              style={{ 
                color: isSaved ? '#28a745' : 'inherit',
                transition: 'color 0.2s ease'
              }}
            />
          )}
          <u style={{ 
            color: isSaved ? '#28a745' : 'inherit',
            fontWeight: isSaved ? '600' : 'normal',
            transition: 'all 0.2s ease'
          }}>
            {isCheckingSaved ? 'Checking...' : 
             isSaving ? (isSaved ? 'Removing...' : 'Saving...') : 
             isSaved ? 'Remove Search' : 
             'Save Search'}
          </u>
        </button>
      </div>
    </div>
  );
};

export default ListingSidebar;
