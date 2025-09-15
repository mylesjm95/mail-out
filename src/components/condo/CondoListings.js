import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { generateListingSlug } from '@/lib/slugUtils';
import './CondoListings.css';

function CondoListings({ slug, currentType = 'rent', condoData }) {
  const [visibleCount, setVisibleCount] = useState(6);
  const ITEMS_PER_PAGE = 6;

  if (!condoData) {
    return (
      <div className="row">
        <div className="col-12 text-center">
          <p>No listings available for this building.</p>
        </div>
      </div>
    );
  }

  const transformListingData = (unit, index) => {
    const isForRent = unit.TransactionType === 'For Lease';
    const price = unit.ListPrice || unit.ClosePrice;
    const priceDisplay = price ? `$${price.toLocaleString()}` : 'Contact for price';
    const title = `${unit.StreetNumber} ${unit.StreetName} ${unit.StreetSuffix} ${unit.UnitNumber}`;
    const location = `${unit.City}, ${unit.StateOrProvince} ${unit.PostalCode}`;
    const totalBedrooms = (unit.BedroomsAboveGrade || 0) + (unit.BedroomsBelowGrade || 0);
    
    const imageUrl = unit.media?.url || '/images/listings/listing-single-1.jpg'; // Use actual image URL
    
    // Generate SEO-friendly slug for the listing
    const listingSlug = generateListingSlug(unit);
    
    return {
      id: unit.ListingKey || `unit-${index}`,
      image: imageUrl,
      title: title,
      location: location,
      price: priceDisplay,
      bedrooms: totalBedrooms,
      bathrooms: unit.BathroomsTotalInteger || 0,
      sqft: unit.LivingArea || 'N/A',
      forRent: isForRent,
      listingKey: unit.ListingKey, // Store the ListingKey for navigation
      listingSlug: listingSlug, // Store the SEO-friendly slug
      soldDate: unit.CloseDate ? new Date(unit.CloseDate).toLocaleDateString() : null,
      soldPrice: unit.ClosePrice ? `$${unit.ClosePrice.toLocaleString()}` : null
    };
  };

  // Filter data based on current type
  let filteredData = [];
  
  if (currentType === 'rent') {
    // For rent: show units that are for lease and active
    filteredData = condoData.availableUnits?.filter(unit => 
      unit.TransactionType === 'For Lease' && unit.StandardStatus === 'Active'
    ) || [];
  } else if (currentType === 'sale') {
    // For sale: show units that are for sale and active (not sold)
    filteredData = condoData.availableUnits?.filter(unit => 
      unit.TransactionType === 'For Sale' && unit.StandardStatus === 'Active'
    ) || [];
  } else if (currentType === 'sold') {
    // Sold: show units that are sold/closed
    filteredData = condoData.recentlySold || [];
  }

  const allListings = filteredData.map(transformListingData);
  const visibleListings = allListings.slice(0, visibleCount);
  const hasMore = allListings.length > visibleCount;

  if (allListings.length === 0) {
    const typeLabels = {
      'rent': 'rental',
      'sale': 'for sale',
      'sold': 'sold'
    };
    
    return (
      <div className="row">
        <div className="col-12 text-center">
          <p>No {typeLabels[currentType] || 'listings'} available for this building.</p>
        </div>
      </div>
    );
  }

  const handleShowMore = () => {
    setVisibleCount(prev => prev + ITEMS_PER_PAGE);
  };

  return (
    <>
      <div className="row">
        {visibleListings.map((listing, index) => (
          <div key={listing.id} className="col-sm-6 col-lg-4">
            <div className="listing-style5">
              <div className="list-thumb">
                <Image
                  width={382}
                  height={248}
                  className="w-100 h-100 cover"
                  src={listing.image}
                  alt="listings"
                  onError={(e) => {
                    e.target.src = '/images/listings/listing-single-1.jpg';
                  }}
                />
                {listing.soldDate && (
                  <div className="sold-listing">
                    <div className="sold-tag">SOLD</div>
                    <div className="sold-price">{listing.soldPrice}</div>
                    <div className="sold-date">{listing.soldDate}</div>
                  </div>
                )}
              </div>
              <div className="list-content">
                <h6 className="list-title">
                  <Link href={`/condo/${listing.listingSlug}`} target="_blank">
                    {listing.title}
                  </Link>
                </h6>
                <p className="list-text">{listing.location}</p>
                <div className="list-meta d-flex align-items-center">
                  <a href="#">
                    <span className="flaticon-bed" />
                    {listing.bedrooms} bed
                  </a>
                  <a href="#">
                    <span className="flaticon-shower" />
                    {listing.bathrooms} bath
                  </a>
                  <a href="#">
                    <span className="flaticon-expand" />
                    {listing.sqft} sqft
                  </a>
                </div>
                <hr className="hr" />
                <div className="list-meta-bottom d-flex justify-content-between align-items-center">
                  <div className="price fw600">
                    {listing.soldDate ? listing.soldPrice : listing.price}
                  </div>
                  <div className="text-end">
                    <Link
                      className="ud-btn2"
                      href={`/condo/${listing.listingSlug}`}
                      target="_blank"
                    >
                      View Details
                      <i className="fal fa-arrow-right-long" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Show More Button */}
      {hasMore && (
        <div className="row mt30">
          <div className="col-12 text-center">
            <button 
              className="ud-btn2"
              onClick={handleShowMore}
              style={{
                background: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'var(--primary-dark)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'var(--primary-color)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Show More ({allListings.length - visibleCount} remaining)
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default CondoListings; 