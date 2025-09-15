"use client";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import Image from "next/image";
import listings from "@/data/listings";

const images = [
  {
    src: "/images/listings/listing-single-2.jpg",
    alt: "2.jpg",
  },
  {
    src: "/images/listings/listing-single-3.jpg",
    alt: "3.jpg",
  },
  {
    src: "/images/listings/listing-single-4.jpg",
    alt: "4.jpg",
  },
  {
    src: "/images/listings/listing-single-5.jpg",
    alt: "5.jpg",
  },
];

const PropertyGallery = ({id, listingData}) => {
  const data = listingData || listings.filter((elm) => elm.id == id)[0] || listings[0];
  
  // Determine if property is sold or leased
  const isSold = listingData && listingData.StandardStatus === 'Closed' && listingData.TransactionType === 'For Sale';
  const isLeased = listingData && listingData.StandardStatus === 'Closed' && listingData.TransactionType === 'For Lease';
  
  // Get images from listing data or use fallbacks
  const getListingImages = () => {
    if (listingData && listingData.Media && listingData.Media.length > 0) {
      // If we have Media array, use all available images (up to 5 for the grid)
      return listingData.Media.slice(0, 5).map(media => media.MediaURL);
    } else if (listingData && listingData.media && listingData.media.url) {
      // Fallback to single media URL if Media array is not available
      return [listingData.media.url];
    } else {
      // Fallback to placeholder images
      return [
        '/images/listings/listing-single-1.jpg',
        '/images/listings/listing-single-2.jpg',
        '/images/listings/listing-single-3.jpg',
        '/images/listings/listing-single-4.jpg',
        '/images/listings/listing-single-5.jpg'
      ];
    }
  };
  
  const listingImages = getListingImages();
  
  return (
    <>
      {/* Status Overlay */}
      {(isSold || isLeased) && (
        <div className="property-status-overlay" style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 10
        }}>
          {isSold && (
            <span className="badge bg-danger text-white px-3 py-2 rounded-pill fs-6">
              <i className="fas fa-check-circle me-1"></i>
              SOLD
            </span>
          )}
          {isLeased && (
            <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fs-6">
              <i className="fas fa-key me-1"></i>
              LEASED
            </span>
          )}
        </div>
      )}
      
      <Gallery>
        <div className="row">
          <div className="col-sm-6">
            <div className="sp-img-content mb15-md">
              <div className="popup-img preview-img-1 sp-img">
                <Item
                  original={listingImages[0]}
                  thumbnail={listingImages[0]}
                  width={610}
                  height={510}
                >
                  {({ ref, open }) => (
                    <Image
                      src={listingImages[0]}
                      width={591}
                      height={558}
                      ref={ref}
                      onClick={open}
                      alt="Property image"
                      role="button"
                      className="w-100 h-100 cover"
                    />
                  )}
                </Item>
              </div>
            </div>
          </div>
          {/* End .col-6 */}

          <div className="col-sm-6">
            <div className="row">
              {listingImages.slice(1, 5).map((imageUrl, index) => (
                <div className="col-6 ps-sm-0" key={index}>
                  <div className="sp-img-content">
                    <div
                      className={`popup-img preview-img-${index + 2} sp-img mb10`}
                    >
                      <Item
                        original={imageUrl}
                        thumbnail={imageUrl}
                        width={270}
                        height={250}
                      >
                        {({ ref, open }) => (
                          <Image
                            width={270}
                            height={250}
                            className="w-100 h-100 cover"
                            ref={ref}
                            onClick={open}
                            role="button"
                            src={imageUrl}
                            alt={`Property image ${index + 2}`}
                          />
                        )}
                      </Item>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Gallery>
    </>
  );
};

export default PropertyGallery;
