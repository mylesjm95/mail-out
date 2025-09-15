"use client";

const Hero = ({ buildingSlug, buildingAddress }) => {
  return (
    <>
      <div className="inner-banner-style3">
        <h2 className="hero-title mb30 animate-up-1">
          Find The Perfect Place to Live With your Family
        </h2>
        <div className="text-center mb30">
          <button
            className="ud-btn btn-thm btn-lg px-5 py-3"
            type="button"
            onClick={() => {
              // Dispatch custom event with building information
              if (buildingSlug && buildingAddress) {
                const buildingSignupEvent = new CustomEvent('building-signup', {
                  detail: {
                    slug: buildingSlug,
                    address: buildingAddress
                  }
                });
                window.dispatchEvent(buildingSignupEvent);
              }

              // Create a hidden button that triggers the modal
              const hiddenButton = document.createElement('button');
              hiddenButton.setAttribute('data-bs-toggle', 'modal');
              hiddenButton.setAttribute('data-bs-target', '#loginSignupModal');
              hiddenButton.style.display = 'none';
              document.body.appendChild(hiddenButton);
              hiddenButton.click();
              document.body.removeChild(hiddenButton);
            }}
          >
            <span className="flaticon-email me-2" />
            Get Updates for This Building
          </button>
        </div>
      </div>
      {/* End Hero content */}
    </>
  );
};

export default Hero;
