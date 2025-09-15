import React from "react";

const ProperytyDescriptions = ({ listingData }) => {
  const publicRemarks = listingData?.PublicRemarks || '';
  const privateRemarks = listingData?.PrivateRemarks || '';
  const inclusions = listingData?.Inclusions || '';
  
  return (
    <>
      {publicRemarks && (
        <p className="text mb10">
          {publicRemarks}
        </p>
      )}
      
      {privateRemarks && (
        <div className="mb20">
          <h6 className="fw600 mb10">Additional Information:</h6>
          <p className="text mb10">{privateRemarks}</p>
        </div>
      )}
      
      {inclusions && (
        <div className="mb20">
          <h6 className="fw600 mb10">Included:</h6>
          <p className="text mb10">{inclusions}</p>
        </div>
      )}
      
      {!publicRemarks && !privateRemarks && !inclusions && (
        <p className="text mb10">
          This 3-bed with a loft, 2-bath home in the gated community of The
          Hideout has it all. From the open floor plan to the abundance of light
          from the windows, this home is perfect for entertaining. The living room
          and dining room have vaulted ceilings and a beautiful fireplace. You
          will love spending time on the deck taking in the beautiful views. In
          the kitchen, you&apos;ll find stainless steel appliances and a tile
          backsplash, as well as a breakfast bar.
        </p>
      )}
      <div className="agent-single-accordion">
        <div className="accordion accordion-flush" id="accordionFlushExample">
          <div className="accordion-item">
            <div
              id="flush-collapseOne"
              className="accordion-collapse collapse"
              aria-labelledby="flush-headingOne"
              data-bs-parent="#accordionFlushExample"
              style={{}}
            >
              <div className="accordion-body p-0">
                <p className="text">
                  Placeholder content for this accordion, which is intended to
                  demonstrate the class. This is the first item&apos;s accordion
                  body you get groundbreaking performance and amazing battery
                  life. Add to that a stunning Liquid Retina XDR display, the
                  best camera and audio ever in a Mac notebook, and all the
                  ports you need.
                </p>
              </div>
            </div>
            <h2 className="accordion-header" id="flush-headingOne">
              <button
                className="accordion-button p-0 collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseOne"
                aria-expanded="false"
                aria-controls="flush-collapseOne"
              >
                Show more
              </button>
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProperytyDescriptions;
