import listings from "@/data/listings";
import React from "react";


const OverView = ({id, listingData}) => {
  const data = listingData || listings.filter((elm) => elm.id == id)[0] || listings[0];
  const overviewData = [
    {
      icon: "flaticon-bed",
      label: "Bedroom",
      value: listingData ? (listingData.BedroomsTotal || 'N/A') : data.bed,
    },
    {
      icon: "flaticon-shower",
      label: "Bath",
      value: listingData ? (listingData.BathroomsTotalInteger || 'N/A') : data.bath,
    },
    {
      icon: "flaticon-event",
      label: "Year Built",
      value: listingData ? (listingData.YearBuilt || 'N/A') : data.yearBuilding,
    },
    {
      icon: "flaticon-garage",
      label: "Parking",
      value: listingData ? (listingData.ParkingTotal ? `${listingData.ParkingTotal} space${listingData.ParkingTotal > 1 ? 's' : ''}` : 'N/A') : "2",
      xs: true,
    },
    {
      icon: "flaticon-expand",
      label: "Sqft",
      value: listingData ? (listingData.LivingAreaRange ? `${listingData.LivingAreaRange} sqft` : (listingData.LivingArea ? `${listingData.LivingArea} sqft` : 'N/A')) : data.sqft,
      xs: true,
    },
    {
      icon: "flaticon-home-1",
      label: "Property Type",
      value: listingData ? (listingData.PropertySubType || 'N/A') : data.propertyType,
    },
    {
      icon: "flaticon-tag",
      label: "Status",
      value: listingData ? (() => {
        if (listingData.StandardStatus === 'Closed' && listingData.TransactionType === 'For Sale') {
          return 'SOLD';
        } else if (listingData.StandardStatus === 'Closed' && listingData.TransactionType === 'For Lease') {
          return 'LEASED';
        } else {
          return listingData.StandardStatus || 'Active';
        }
      })() : 'Active',
    },
  ];
  
 
  return (
    <>
      {overviewData.map((item, index) => (
        <div
          key={index}
          className={`col-sm-6 col-lg-4 ${item.xs ? "mb25-xs" : "mb25"}`}
        >
          <div className="overview-element d-flex align-items-center">
            <span className={`icon ${item.icon}`} />
            <div className="ml15">
              <h6 className="mb-0">{item.label}</h6>
              <p className="text mb-0 fz15">{item.value}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default OverView;
