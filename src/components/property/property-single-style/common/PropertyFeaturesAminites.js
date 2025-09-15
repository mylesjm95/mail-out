import React from "react";

const PropertyFeaturesAminites = ({ listingData }) => {
  // Combine building amenities and property features
  const buildingAmenities = listingData?.AssociationAmenities || [];
  const propertyFeatures = listingData?.PropertyFeatures || [];
  const interiorFeatures = listingData?.InteriorFeatures || [];
  const cooling = listingData?.Cooling || [];
  const heating = listingData?.HeatType ? [listingData.HeatType] : [];
  const laundryFeatures = listingData?.LaundryFeatures || [];
  
  // Combine all features and amenities
  const allFeatures = [
    ...buildingAmenities,
    ...propertyFeatures,
    ...interiorFeatures,
    ...cooling,
    ...heating,
    ...laundryFeatures
  ].filter((feature, index, self) => self.indexOf(feature) === index); // Remove duplicates
  
  // Split into rows of 4 items each
  const featuresAmenitiesData = [];
  for (let i = 0; i < allFeatures.length; i += 4) {
    featuresAmenitiesData.push(allFeatures.slice(i, i + 4));
  }
  
  // Fallback to static data if no real data
  const displayData = featuresAmenitiesData.length > 0 ? featuresAmenitiesData : [
    ["Air Conditioning", "Barbeque", "Dryer", "Gym"],
    ["Lawn", "Microwave", "Outdoor Shower", "Refrigerator"],
    ["Swimming Pool", "TV Cable", "Washer", "WiFi6"],
  ];

  return (
    <>
      {displayData.map((row, rowIndex) => (
        <div key={rowIndex} className="col-sm-6 col-md-4">
          <div className="pd-list">
            {row.map((item, index) => (
              <p key={index} className="text mb10">
                <i className="fas fa-circle fz6 align-middle pe-2" />
                {item}
              </p>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default PropertyFeaturesAminites;
