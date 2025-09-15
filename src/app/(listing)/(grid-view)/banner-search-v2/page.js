import DefaultHeader from "@/components/common/DefaultHeader";
import Footer from "@/components/common/default-footer";
import MobileMenu from "@/components/common/mobile-menu";

import React from "react";

export const metadata = {
  title: "Banner Search V2 || Homez - Real Estate NextJS Template",
};

const BannerSearchV2 = () => {
  return (
    <>
      {/* Main Header Nav */}
      <DefaultHeader />
      {/* End Main Header Nav */}

      {/* Mobile Nav  */}
      <MobileMenu />
      {/* End Mobile Nav  */}

      {/* property-banner-style2 */}
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
      
      {/* Property Filtering */}

      {/* Start Our Footer */}
      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>
      {/* End Our Footer */}
    </>
  );
};

export default BannerSearchV2;
