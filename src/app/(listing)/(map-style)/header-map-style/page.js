import DefaultHeader from "@/components/common/DefaultHeader";

import Footer from "@/components/common/default-footer";
import MobileMenu from "@/components/common/mobile-menu";
import Pagination from "@/components/listing/Pagination";
import FeaturedListings from "@/components/listing/map-style/header-map-style/FeatuerdListings";
import TopFilterBar from "@/components/listing/map-style/header-map-style/TopFilterBar";
import TopFilterBar2 from "@/components/listing/map-style/header-map-style/TopFilterBar2";
import React from "react";

export const metadata = {
  title: "Header Map Style || Homez - Real Estate NextJS Template",
};

const HeaderMapStyle = () => {
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

      {/* Start Our Footer */}
      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>
      {/* End Our Footer */}
    </>
  );
};

export default HeaderMapStyle;
