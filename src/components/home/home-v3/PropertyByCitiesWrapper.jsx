'use client'
import listings from "@/data/listings";
import Link from 'next/link';
import React, { useEffect, useState, useMemo, memo } from 'react'
import FeaturedListings from './FeatuerdListings';
import CondoListings from '@/components/condo/CondoListings';

function PropertyByCitiesWrapper({ slug, condoData }) {
  const [currentType, setCurrentType] = useState('rent')

  // Memoize the filtered data to prevent unnecessary recalculations
  const pageData = useMemo(() => {
    if (currentType == 'rent') {
      return listings.filter((elm) => elm.forRent)
    } else {
      return listings.filter((elm) => !elm.forRent)
    }
  }, [currentType])

  // If we have a slug, we're on a condo page and should show condo data
  const isCondoPage = !!slug

  return (
    <section className="pb90 pb30-md pt-0">
      <div className="container">
        <div className="row">
          <div className="col-lg-9">
            <div className="main-title2">
              <h2 className="title">
                {isCondoPage ? `Properties in ${slug}` : "Discover Popular Properties"}
              </h2>
              <p className="paragraph">
                {isCondoPage 
                  ? "Discover available properties in this building"
                  : "Aliquam lacinia diam quis lacus euismod"
                }
              </p>
            </div>
          </div>
          {/* End .col-lg-9 */}

          <div className="col-lg-3">
            <div className="dark-light-navtab style2 text-start text-lg-end mt-0 mt-lg-4 mb-4">
              <ul
                className="nav nav-pills justify-content-start justify-content-lg-end"
                id="pills-tab"
                role="tablist"
              >
                <li className="nav-item" role="presentation" onClick={() => setCurrentType('rent')}>
                  <button className={`nav-link ${currentType == 'rent' ? 'active' : ''} `} type="button">
                    For Rent
                  </button>
                </li>
                <li className="nav-item" role="presentation" onClick={() => setCurrentType('sale')}>
                  <button className={`nav-link ${currentType == 'sale' ? 'active' : ''} `} type="button">
                    For Sale
                  </button>
                </li>
                <li className="nav-item" role="presentation" onClick={() => setCurrentType('sold')}>
                  <button className={`nav-link me-0 ${currentType == 'sold' ? 'active' : ''} `} type="button">
                    Sold
                  </button>
                </li>
              </ul>
            </div>
          </div>
          {/* End .col-lg-3 */}
        </div>
        {/* End .row */}

        <div className="row">
          {isCondoPage ? (
            <CondoListings 
              slug={slug} 
              currentType={currentType} 
              condoData={condoData}
            />
          ) : (
            <FeaturedListings cities={pageData} />
          )}
        </div>
        {/* End .row */}
      </div>
    </section>
  )
}

// Memoize the component to prevent unnecessary re-renders
export default memo(PropertyByCitiesWrapper);
