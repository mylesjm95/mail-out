"use client";

import listings from "@/data/listings";
import React, { useState, useEffect } from "react";
import { useAuth } from '@/hooks/useAuth';
import { toggleSavedSearch } from '@/actions/savedSearchActions';

const PropertyHeader = ({ id, listingData }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const { user, isAuthenticated, loading } = useAuth();
  
  // Use real listing data if available, otherwise fall back to static data
  const data = listingData || listings.filter((elm) => elm.id == id)[0] || listings[0];

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
          <h2 className="sp-lg-title">
            {listingData ? `${listingData.StreetNumber} ${listingData.StreetName} ${listingData.StreetSuffix || ''} ${listingData.UnitNumber || ''}`.trim() : data.title}
          </h2>
          <div className="pd-meta mb15 d-md-flex align-items-center">
            <p className="text fz15 mb-0 bdrr1 pr10 bdrrn-sm">
              {listingData ? `${listingData.City}, ${listingData.StateOrProvince} ${listingData.PostalCode}` : data.location}
            </p>
            <a
              className="ff-heading text-thm fz15 bdrr1 pr10 ml0-sm ml10 bdrrn-sm"
              href="#"
            >
              <i className="fas fa-circle fz10 pe-2" />
              For {listingData ? (listingData.TransactionType === 'For Lease' ? 'rent' : 'sale') : (data.forRent ? "rent" : "sale")}
            </a>
            <a
              className="ff-heading bdrr1 fz15 pr10 ml10 ml0-sm bdrrn-sm"
              href="#"
            >
              <i className="far fa-clock pe-2" />
              {listingData ? 'Recently listed' : `${Number(new Date().getFullYear()) - Number(data.yearBuilding)} years ago`}
            </a>
            <a className="ff-heading ml10 ml0-sm fz15" href="#">
              <i className="flaticon-fullscreen pe-2 align-text-top" />
              {listingData ? listingData.ListingKey : '8721'}
            </a>
          </div>
          <div className="property-meta d-flex align-items-center">
            <a className="text fz15" href="#">
              <i className="flaticon-bed pe-2 align-text-top" />
              {listingData ? (listingData.BedroomsTotal || 'N/A') : data.bed} bed
            </a>
            <a className="text ml20 fz15" href="#">
              <i className="flaticon-shower pe-2 align-text-top" />
              {listingData ? (listingData.BathroomsTotalInteger || 'N/A') : data.bath} bath
            </a>
            <a className="text ml20 fz15" href="#">
              <i className="flaticon-expand pe-2 align-text-top" />
              {listingData ? (listingData.LivingAreaRange ? `${listingData.LivingAreaRange} sqft` : (listingData.LivingArea ? `${listingData.LivingArea} sqft` : 'N/A')) : `${data.sqft} sqft`}
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
            {/* Price and Status Display */}
            {listingData && (listingData.ClosePrice || listingData.LeaseAmount) ? (
              // Property has been sold or leased
              <div className="price-status-container">
                <div className="status-badge mb-2">
                  {listingData.StandardStatus === 'Closed' && listingData.TransactionType === 'For Sale' ? (
                    <span className="badge bg-danger text-white px-3 py-2 rounded-pill">
                      <i className="fas fa-check-circle me-1"></i>
                      SOLD
                    </span>
                  ) : listingData.StandardStatus === 'Closed' && listingData.TransactionType === 'For Lease' ? (
                    <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
                      <i className="fas fa-key me-1"></i>
                      LEASED
                    </span>
                  ) : null}
                </div>
                
                <div className="price-comparison">
                  <div className="original-price text-muted text-decoration-line-through mb-1">
                    <small>Listed at: ${parseInt(listingData.ListPrice || 0).toLocaleString()}</small>
                  </div>
                  <h3 className="price mb-0 text-success">
                    {listingData.ClosePrice ? 
                      `$${parseInt(listingData.ClosePrice).toLocaleString()}` : 
                      `$${parseInt(listingData.LeaseAmount || 0).toLocaleString()}/month`
                    }
                  </h3>
                  <div className="sale-date text-muted">
                    <small>
                      {listingData.CloseDate ? 
                        `Sold on ${new Date(listingData.CloseDate).toLocaleDateString()}` :
                        listingData.LeasedEntryTimestamp ?
                        `Leased on ${new Date(listingData.LeasedEntryTimestamp).toLocaleDateString()}` :
                        'Date not available'
                      }
                    </small>
                  </div>
                </div>
              </div>
            ) : (
              // Property is still available
              <div>
                <h3 className="price mb-0">
                  {listingData ? `$${parseInt(listingData.ListPrice || 0).toLocaleString()}` : data.price}
                </h3>
                <p className="text space fz15">
                  {listingData && (listingData.LivingArea || listingData.LivingAreaRange) ? 
                    (() => {
                      const area = listingData.LivingArea || (listingData.LivingAreaRange ? parseInt(listingData.LivingAreaRange.split('-')[1]) : null);
                      return area ? `$${Math.round((listingData.ListPrice || 0) / area).toLocaleString()}/sq ft` : 'Price per sq ft not available';
                    })() :
                    data.price ? 
                      `$${(
                        Number(data.price.split("$")[1].split(",").join("")) / data.sqft
                      ).toFixed(2)}/sq ft` :
                      'Price per sq ft not available'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* End .col-lg--4 */}
    </>
  );
};

export default PropertyHeader;
