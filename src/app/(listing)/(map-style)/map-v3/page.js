import DefaultHeader from "@/components/common/DefaultHeader";
import MobileMenu from "@/components/common/mobile-menu";

import React from "react";

export const metadata = {
  title: "Map V3 || Homez - Real Estate NextJS Template",
};

const MapV3 = () => {
  return (
    <>
      {/* Main Header Nav */}
      <DefaultHeader />
      {/* End Main Header Nav */}

      {/* Mobile Nav  */}
      <MobileMenu />
      {/* End Mobile Nav  */}

      {/* Temporarily disabled due to build issue */}
      <div className="container py-5">
        <h1>Map V3 - Temporarily Unavailable</h1>
        <p>This page is being updated and will be available soon.</p>
      </div>
    </>
  );
};

export default MapV3;
