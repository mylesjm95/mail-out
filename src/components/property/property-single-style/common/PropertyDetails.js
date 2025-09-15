import React from "react";

const PropertyDetails = ({ listingData }) => {
  const columns = [
    [
      {
        label: "Property ID",
        value: listingData ? listingData.ListingKey : "RT48",
      },
      {
        label: "Price",
        value: listingData ? `$${parseInt(listingData.ListPrice || 0).toLocaleString()}` : "$252,000",
      },
      {
        label: "Property Size",
        value: listingData ? (listingData.LivingAreaRange ? `${listingData.LivingAreaRange} Sq Ft` : (listingData.LivingArea ? `${listingData.LivingArea} Sq Ft` : 'N/A')) : "1500 Sq Ft",
      },
      {
        label: "Bathrooms",
        value: listingData ? (listingData.BathroomsTotalInteger || 'N/A') : "3",
      },
      {
        label: "Bedrooms",
        value: listingData ? (listingData.BedroomsTotal || 'N/A') : "2",
      },
      {
        label: "Parking",
        value: listingData ? (listingData.ParkingTotal ? `${listingData.ParkingTotal} space${listingData.ParkingTotal > 1 ? 's' : ''}` : 'N/A') : "2",
      },
      {
        label: "Locker",
        value: listingData ? (listingData.Locker || 'N/A') : "N/A",
      },
    ],
    [
      {
        label: "Year Built",
        value: listingData ? (listingData.YearBuilt || 'N/A') : "2022",
      },
      {
        label: "Property Type",
        value: listingData ? (listingData.PropertySubType || 'N/A') : "Apartment",
      },
      {
        label: "Property Status",
        value: listingData ? (listingData.StandardStatus || 'N/A') : "For Sale",
      },
      {
        label: "Transaction Type",
        value: listingData ? (listingData.TransactionType || 'N/A') : "For Sale",
      },
      {
        label: "Close Date",
        value: listingData && listingData.CloseDate ? 
          new Date(listingData.CloseDate).toLocaleDateString() : 'N/A',
      },
      {
        label: "Close Price",
        value: listingData && listingData.ClosePrice ? 
          `$${parseInt(listingData.ClosePrice).toLocaleString()}` : 'N/A',
      },
      {
        label: "Lease Amount",
        value: listingData && listingData.LeaseAmount ? 
          `$${parseInt(listingData.LeaseAmount).toLocaleString()}/month` : 'N/A',
      },
      {
        label: "Furnished",
        value: listingData ? (listingData.Furnished || 'N/A') : "N/A",
      },
      {
        label: "Exposure",
        value: listingData ? (listingData.Exposure || 'N/A') : "N/A",
      },
      {
        label: "Pets Allowed",
        value: listingData ? (listingData.PetsAllowed?.join(', ') || 'N/A') : "N/A",
      },
    ],
  ];

  return (
    <div className="row">
      {columns.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className={`col-md-6 col-xl-4${
            columnIndex === 1 ? " offset-xl-2" : ""
          }`}
        >
          {column.map((detail, index) => (
            <div key={index} className="d-flex justify-content-between">
              <div className="pd-list">
                <p className="fw600 mb10 ff-heading dark-color">
                  {detail.label}
                </p>
              </div>
              <div className="pd-list">
                <p className="text mb10">{detail.value}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PropertyDetails;
