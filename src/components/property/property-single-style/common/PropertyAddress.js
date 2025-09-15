import React from "react";

const PropertyAddress = ({ listingData }) => {
  // Use real listing data if available, otherwise fall back to static data
  const address = listingData ? {
    address: `${listingData.StreetNumber} ${listingData.StreetName} ${listingData.StreetSuffix || ''} ${listingData.UnitNumber || ''}`.trim(),
    city: listingData.City,
    state: listingData.StateOrProvince,
    zipCode: listingData.PostalCode,
    area: listingData.Area || 'N/A',
    country: listingData.Country || 'Canada',
  } : {
    address: "10425 Tabor St",
    city: "Los Angeles",
    state: "California",
    zipCode: "90034",
    area: "Brookside",
    country: "United States",
  };

  return (
    <>
      <div className="col-md-6 col-xl-4">
        <div className="d-flex justify-content-between">
          <div className="pd-list">
            <p className="fw600 mb10 ff-heading dark-color">Address</p>
            <p className="fw600 mb10 ff-heading dark-color">City</p>
            <p className="fw600 mb-0 ff-heading dark-color">State/Province</p>
          </div>
          <div className="pd-list">
            <p className="text mb10">{address.address}</p>
            <p className="text mb10">{address.city}</p>
            <p className="text mb-0">{address.state}</p>
          </div>
        </div>
      </div>
      {/* End col */}

      <div className="col-md-6 col-xl-4 offset-xl-2">
        <div className="d-flex justify-content-between">
          <div className="pd-list">
            <p className="fw600 mb10 ff-heading dark-color">Postal Code</p>
            <p className="fw600 mb10 ff-heading dark-color">Area</p>
            <p className="fw600 mb-0 ff-heading dark-color">Country</p>
          </div>
          <div className="pd-list">
            <p className="text mb10">{address.zipCode}</p>
            <p className="text mb10">{address.area}</p>
            <p className="text mb-0">{address.country}</p>
          </div>
        </div>
      </div>
      {/* End col */}

      <div className="col-md-12">
        <iframe
          className="position-relative bdrs12 mt30 h250"
          loading="lazy"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(address.address + ', ' + address.city + ', ' + address.state + ', ' + address.country)}&t=m&z=14&output=embed&iwloc=near`}
          title={address.address}
          aria-label={address.address}
        />
      </div>
      {/* End col */}
    </>
  );
};

export default PropertyAddress;
