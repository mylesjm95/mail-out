import DefaultHeader from "@/components/common/DefaultHeader";

import MobileMenu from "@/components/common/mobile-menu";


import React from "react";

export const metadata = {
  title: "Map V4 || Homez - Real Estate NextJS Template",
};

const MapV4 = () => {
  return (
    <>
      {/* Main Header Nav */}
      <DefaultHeader />
      {/* End Main Header Nav */}

      {/* Mobile Nav  */}
      <MobileMenu />
      {/* End Mobile Nav  */}
      {/* Property Listings - Coming Soon */}
      <section className="pt0 pb90 pt60-md pb60-md">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="text-center">
                <h2>Property Listings</h2>
                <p className="text-muted">Property listings will be available soon.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MapV4;
