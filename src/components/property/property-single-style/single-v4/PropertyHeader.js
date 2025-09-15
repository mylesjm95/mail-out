"use client";

import listings from "@/data/listings";
import React, { useState, useEffect } from "react";
import { useAuth } from '@/hooks/useAuth';
import { toggleSavedSearch } from '@/actions/savedSearchActions';

const PropertyHeader = ({id}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const { user, isAuthenticated, loading } = useAuth();
  
  const data = listings.filter((elm) => elm.id == id)[0] || listings[0];

  // Check if property is already saved (you might want to implement this based on your needs)
  useEffect(() => {
    // TODO: Check if current property is in user's saved searches
    // This would require implementing a function to check saved searches
  }, [id, user]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      // Show toast notification for authentication required
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast('Please login to save this property', 'error');
      }
      return;
    }

    setIsToggling(true);
    try {
      const result = await toggleSavedSearch(
        user.id,
        `property-${id}`, // Generate a unique identifier for the property
        data.location || 'Property Location',
        null, // emails
        { propertyId: id, propertyData: data } // preferences
      );

      if (result.success) {
        setIsSaved(!isSaved);
        // Show success toast notification
        if (typeof window !== 'undefined' && window.showToast) {
          const message = isSaved ? 'Property removed from favorites' : 'Property added to favorites!';
          const type = isSaved ? 'info' : 'success';
          window.showToast(message, type);
        }
      } else {
        // Show error toast notification
        if (typeof window !== 'undefined' && window.showToast) {
          window.showToast(result.error || 'Failed to update favorites', 'error');
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Show error toast notification
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast('An error occurred while updating favorites', 'error');
      }
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <>
      <div className="col-lg-8">
        <div className="single-property-content mb30-md">
          <h2 className="sp-lg-title">{data.title}</h2>
          <div className="pd-meta mb15 d-md-flex align-items-center">
            <p className="text fz15 mb-0 bdrr1 pr10 bdrrn-sm">
              {data.location}
            </p>
          </div>
          <div className="property-meta d-flex align-items-center">
            <a
              className="ff-heading text-thm fz15 bdrr1 pr10 bdrrn-sm"
              href="#"
            >
              <i className="fas fa-circle fz10 pe-2" />
              For {data.forRent ? 'rent':'sale'}
            </a>
            <a
              className="ff-heading bdrr1 fz15 pr10 ml10 ml0-sm bdrrn-sm"
              href="#"
            >
              <i className="far fa-clock pe-2" />{Number(new Date().getFullYear()) - Number(data.yearBuilding)} years ago
            </a>
            <a className="ff-heading ml10 ml0-sm fz15" href="#">
              <i className="flaticon-fullscreen pe-2 align-text-top" />
              8721
            </a>
          </div>
        </div>
      </div>
      {/* End .col-lg--8 */}

      <div className="col-lg-4">
        <div className="single-property-content">
          <div className="property-action text-lg-end">
            <div className="d-flex mb20 mb10-md align-items-center justify-content-lg-end">
              <button 
                className={`icon mr10 ${isSaved ? 'text-danger' : ''}`}
                onClick={handleToggleFavorite}
                disabled={isToggling}
                style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                title={isSaved ? 'Remove from favorites' : 'Add to favorites'}
              >
                <span className={`flaticon-like ${isSaved ? 'text-danger' : ''}`} />
              </button>
              <a className="icon mr10" href="#">
                <span className="flaticon-new-tab" />
              </a>
              <a className="icon mr10" href="#">
                <span className="flaticon-share-1" />
              </a>
              <a className="icon" href="#">
                <span className="flaticon-printer" />
              </a>
            </div>
            <h3 className="price mb-0">{data.price}</h3>
            <p className="text space fz15">${(Number(data.price.split('$')[1].split(',').join(''))/data.sqft).toFixed(2)}/sq ft</p>
          </div>
        </div>
      </div>
      {/* End .col-lg--4 */}
    </>
  );
};

export default PropertyHeader;
