import SignIn from "./SignIn";
import SignUp from "./SignUp";
import "./LoginModal.css";
import { useState, useEffect } from "react";

const LoginSignupModal = () => {
  const [buildingInfo, setBuildingInfo] = useState(null);

  useEffect(() => {
    // Listen for custom events to update building info
    const handleBuildingSignup = (event) => {
      console.log('Building signup event received:', event.detail);
      setBuildingInfo(event.detail);
    };

    const handleClearBuildingInfo = () => {
      console.log('Clearing building info');
      setBuildingInfo(null);
    };

    // Listen for building signup requests
    window.addEventListener('building-signup', handleBuildingSignup);
    
    // Listen for modal close to clear building info
    const modal = document.getElementById('loginSignupModal');
    if (modal) {
      modal.addEventListener('hidden.bs.modal', handleClearBuildingInfo);
    }

    return () => {
      window.removeEventListener('building-signup', handleBuildingSignup);
      if (modal) {
        modal.removeEventListener('hidden.bs.modal', handleClearBuildingInfo);
      }
    };
  }, []);

  const isBuildingSignup = !!buildingInfo;
  const buildingAddress = buildingInfo?.address;

  return (
    <div className="modal-content login-modal">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalToggleLabel">
          {isBuildingSignup && buildingAddress 
            ? `Create your account to get updated for ${buildingAddress}`
            : 'Welcome to Realton'
          }
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        />
      </div>
      {/* End header */}

      {/* Custom message for building signup */}
      {isBuildingSignup && buildingAddress && (
        <div className="modal-body border-bottom">
          <div className="alert alert-info building-info-alert mb0 text-center">
            <i className="fas fa-info-circle me-2"></i>
            Sign up to receive notifications when new properties become available at this building!
          </div>
        </div>
      )}

      <div className="modal-body">
        <div className="log-reg-form">
          <div className="navtab-style2">
            <nav>
              <div className="nav nav-tabs mb20" id="nav-tab" role="tablist">
                <button
                  className="nav-link active fw600"
                  id="nav-home-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-home"
                  type="button"
                  role="tab"
                  aria-controls="nav-home"
                  aria-selected="true"
                >
                  Sign In
                </button>
                <button
                  className="nav-link fw600"
                  id="nav-profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-profile"
                  type="button"
                  role="tab"
                  aria-controls="nav-profile"
                  aria-selected="false"
                >
                  New Account
                </button>
              </div>
            </nav>
            {/* End nav tab items */}

            <div className="tab-content" id="nav-tabContent2">
              <div
                className="tab-pane fade show active fz15"
                id="nav-home"
                role="tabpanel"
                aria-labelledby="nav-home-tab"
              >
                <SignIn />
              </div>
              {/* End signin content */}

              <div
                className="tab-pane fade fz15"
                id="nav-profile"
                role="tabpanel"
                aria-labelledby="nav-profile-tab"
              >
                <SignUp 
                  buildingAddress={buildingAddress}
                  isBuildingSignup={isBuildingSignup}
                  buildingSlug={buildingInfo?.slug}
                />
              </div>
              {/* End signup content */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupModal;
