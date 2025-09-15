import React from 'react';
import './CondoListingsSkeleton.css';

function CondoListingsSkeleton() {
  return (
    <section className="pb90 pb30-md pt-0">
      <div className="container">
        <div className="row align-items-md-center justify-content-between">
          <div className="col-lg-9">
            <div className="main-title2">
              <h2 className="title">Properties in this Building</h2>
              <p className="paragraph">
                Discover available units and recent sales
              </p>
            </div>
          </div>
          {/* End .col */}
        </div>
        {/* End .row */}

        <div className="row">
          <div className="col-lg-12">
            <div className="navtab-style2">
              <nav>
                <div className="nav nav-tabs mb20" id="nav-tab" role="tablist">
                  <button
                    className="nav-link active fw600"
                    id="nav-rent-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-rent"
                    type="button"
                    role="tab"
                    aria-controls="nav-rent"
                    aria-selected="true"
                  >
                    For Rent
                  </button>
                  <button
                    className="nav-link fw600"
                    id="nav-sale-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-sale"
                    type="button"
                    role="tab"
                    aria-controls="nav-sale"
                    aria-selected="false"
                  >
                    Recently Sold
                  </button>
                </div>
              </nav>
              {/* End nav tab items */}

              <div className="tab-content" id="nav-tabContent2">
                <div
                  className="tab-pane fade show active fz15"
                  id="nav-rent"
                  role="tabpanel"
                  aria-labelledby="nav-rent-tab"
                >
                  {/* Skeleton Cards */}
                  <div className="row">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <div key={item} className="col-sm-6 col-lg-4">
                        <div className="listing-style5 skeleton-card">
                          <div className="list-thumb skeleton-image">
                            <div className="skeleton-placeholder"></div>
                          </div>
                          <div className="list-content">
                            <div className="skeleton-title"></div>
                            <div className="skeleton-text"></div>
                            <div className="list-meta d-flex align-items-center">
                              <div className="skeleton-meta"></div>
                              <div className="skeleton-meta"></div>
                              <div className="skeleton-meta"></div>
                            </div>
                            <hr className="hr" />
                            <div className="list-meta-bottom d-flex justify-content-between align-items-center">
                              <div className="skeleton-price"></div>
                              <div className="skeleton-button"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* End rent content */}

                <div
                  className="tab-pane fade fz15"
                  id="nav-sale"
                  role="tabpanel"
                  aria-labelledby="nav-sale-tab"
                >
                  {/* Skeleton Cards */}
                  <div className="row">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <div key={item} className="col-sm-6 col-lg-4">
                        <div className="listing-style5 skeleton-card">
                          <div className="list-thumb skeleton-image">
                            <div className="skeleton-placeholder"></div>
                          </div>
                          <div className="list-content">
                            <div className="skeleton-title"></div>
                            <div className="skeleton-text"></div>
                            <div className="list-meta d-flex align-items-center">
                              <div className="skeleton-meta"></div>
                              <div className="skeleton-meta"></div>
                              <div className="skeleton-meta"></div>
                            </div>
                            <hr className="hr" />
                            <div className="list-meta-bottom d-flex justify-content-between align-items-center">
                              <div className="skeleton-price"></div>
                              <div className="skeleton-button"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* End sale content */}
              </div>
            </div>
          </div>
        </div>
        {/* End .row */}
      </div>
    </section>
  );
}

export default CondoListingsSkeleton; 