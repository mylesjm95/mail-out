'use client'

import Link from "next/link";
import React, { useState } from "react";
import { signup } from "@/actions/authActions";
import { createBuildingSavedSearch } from "@/actions/savedSearchActions";
import { createClient } from "@/utilis/supabase/client";

const SignUp = ({ buildingAddress, isBuildingSignup = false, buildingSlug }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData(e.target);
      
      // Validate form data before submission
      const email = formData.get('email')?.trim();
      const password = formData.get('password');
      const name = formData.get('name')?.trim();
      
      if (!email || !password || !name) {
        setError("Please fill in all required fields.");
        setIsLoading(false);
        return;
      }
      
      console.log('Submitting signup form with:', { email, name, passwordLength: password?.length });
      
      const result = await signup(formData);
      console.log('Signup result:', result);
      
      if (result.error) {
        setError(result.error);
        // Show error toast
        if (typeof window !== 'undefined' && window.showToast) {
          window.showToast(result.error, "error");
        }
      } else if (result.success) {
        console.log('Signup successful:', result);
        
        // If this is a building signup, create a saved search
        if (isBuildingSignup && buildingAddress && result.user) {
          try {
            // Create a saved search for the building
            const savedSearchResult = await createBuildingSavedSearch(
              result.user.id,
              buildingSlug || buildingAddress.toLowerCase().replace(/\s+/g, '-'), // Use buildingSlug if available
              buildingAddress
            );
            
            if (savedSearchResult.success) {
              setSuccess("Account created successfully! You're now subscribed to updates for this building.");
              
              // Show success toast
              if (typeof window !== 'undefined' && window.showToast) {
                window.showToast("Account created and subscribed to building updates!", "success");
              }
            } else {
              setSuccess("Account created successfully!");
              
              // Show success toast
              if (typeof window !== 'undefined' && window.showToast) {
                window.showToast("Account created!", "success");
              }
            }
          } catch (savedSearchError) {
            console.error('Error creating saved search:', savedSearchError);
            // Still show success for account creation
            setSuccess("Account created successfully!");
            
            if (typeof window !== 'undefined' && window.showToast) {
              window.showToast("Account created!", "success");
            }
          }
        } else {
          setSuccess("Account created successfully!");
          
          // Show success toast
          if (typeof window !== 'undefined' && window.showToast) {
            window.showToast("Account created!", "success");
          }
        }
        
        // Clear form
        e.target.reset();
        
        // Handle auto signin based on email confirmation status
        if (result.needsEmailConfirmation) {
          // User needs to confirm email first
          setSuccess("Account created successfully! Please check your email and confirm your account, then sign in.");
          
          // Show info toast about email confirmation
          if (typeof window !== 'undefined' && window.showToast) {
            window.showToast("Please check your email and confirm your account before signing in.", "info");
          }
        } else if (result.autoSignin && result.credentials) {
          // User can be signed in immediately
          console.log('Attempting client-side signin with credentials:', result.credentials);
          try {
            const supabase = createClient();
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email: result.credentials.email,
              password: result.credentials.password,
            });

            if (signInError) {
              console.error('Client-side signin error:', signInError);
              setSuccess("Account created successfully! Please sign in with your new credentials.");
              
              // Show error toast
              if (typeof window !== 'undefined' && window.showToast) {
                window.showToast("Account created! Please sign in with your new credentials.", "success");
              }
            } else if (signInData.user) {
              console.log('Client-side signin successful:', signInData.user);
              setSuccess("Account created and signed in successfully!");
              
              // Show success toast
              if (typeof window !== 'undefined' && window.showToast) {
                window.showToast("Account created and signed in successfully!", "success");
              }
              
              // Close the modal and redirect
              setTimeout(() => {
                console.log('Attempting to close modal and redirect...');
                
                // Check if Bootstrap is available
                if (typeof bootstrap === 'undefined') {
                  console.error('Bootstrap is not available, cannot close modal programmatically');
                  // Fallback: try to redirect anyway
                  if (typeof window !== 'undefined') {
                    window.location.href = '/dashboard/dashboard-home';
                  }
                  return;
                }
                
                // Close the modal using multiple methods to ensure it works
                const modal = document.getElementById('loginSignupModal');
                if (modal) {
                  console.log('Found modal, attempting to close...');
                  
                  // Method 1: Try to get Bootstrap modal instance and hide it
                  try {
                    const modalInstance = bootstrap.Modal.getInstance(modal);
                    if (modalInstance) {
                      console.log('Using existing Bootstrap modal instance');
                      modalInstance.hide();
                    } else {
                      console.log('Creating new Bootstrap modal instance');
                      // Method 2: Try to create a new instance and hide it
                      const newModalInstance = new bootstrap.Modal(modal);
                      newModalInstance.hide();
                    }
                  } catch (error) {
                    console.log('Bootstrap modal close failed, trying alternative method:', error);
                    // Method 3: Use data attribute to close
                    modal.setAttribute('data-bs-dismiss', 'modal');
                    const closeEvent = new Event('click');
                    modal.dispatchEvent(closeEvent);
                  }
                  
                  // Method 4: Try to trigger the close button directly
                  const closeButton = modal.querySelector('.btn-close');
                  if (closeButton) {
                    console.log('Clicking close button');
                    closeButton.click();
                  }
                  
                  // Method 5: Try to trigger the modal close event
                  const modalCloseEvent = new CustomEvent('hidden.bs.modal', {
                    bubbles: true,
                    cancelable: true
                  });
                  modal.dispatchEvent(modalCloseEvent);
                  
                  // Method 6: Try to use the data-bs-dismiss attribute on the modal itself
                  modal.setAttribute('data-bs-dismiss', 'modal');
                  
                  // Method 7: Try to find any button with data-bs-dismiss and click it
                  const dismissButtons = modal.querySelectorAll('[data-bs-dismiss="modal"]');
                  dismissButtons.forEach(button => {
                    if (button !== closeButton) {
                      console.log('Clicking dismiss button');
                      button.click();
                    }
                  });
                  
                  // Method 8: Final fallback - try to remove modal backdrop and hide modal
                  const backdrop = document.querySelector('.modal-backdrop');
                  if (backdrop) {
                    console.log('Removing modal backdrop');
                    backdrop.remove();
                  }
                  
                  // Remove modal classes that make it visible
                  console.log('Removing modal classes and hiding modal');
                  modal.classList.remove('show');
                  modal.classList.remove('fade');
                  modal.style.display = 'none';
                  modal.setAttribute('aria-hidden', 'true');
                  modal.removeAttribute('aria-modal');
                  
                  // Remove body classes
                  document.body.classList.remove('modal-open');
                  document.body.style.overflow = '';
                  document.body.style.paddingRight = '';
                } else {
                  console.log('Modal not found, proceeding with redirect');
                }
                
                // Redirect to dashboard
                if (typeof window !== 'undefined') {
                  console.log('Redirecting to dashboard...');
                  window.location.href = '/dashboard/dashboard-home';
                }
              }, 2000); // Increased timeout to give modal more time to close
            }
          } catch (signinError) {
            console.error('Client-side signin failed:', signinError);
            setSuccess("Account created successfully! Please sign in with your new credentials.");
            
            // Show error toast
            if (typeof window !== 'undefined' && window.showToast) {
              window.showToast("Account created! Please sign in with your new credentials.", "success");
            }
          }
        } else {
          // Fallback case
          setSuccess("Account created successfully! Please sign in with your new credentials.");
          
          // Show success toast
          if (typeof window !== 'undefined' && window.showToast) {
            window.showToast("Account created! Please sign in with your new credentials.", "success");
          }
        }
      }
    } catch (err) {
      console.error('Signup form error:', err);
      const errorMessage = "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      // Show error toast
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast(errorMessage, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = () => {
    // Clear errors when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  return (
    <form className="form-style1" onSubmit={handleSubmit}>
      {/* Error Message */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb20" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError("")}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="alert alert-success alert-dismissible fade show mb20" role="alert">
          <i className="fas fa-check-circle me-2"></i>
          {success}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setSuccess("")}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Building-specific message */}
      {isBuildingSignup && buildingAddress && (
        <div className="alert alert-info building-info-alert mb20">
          <i className="fas fa-building me-2"></i>
          <strong>Building:</strong> {buildingAddress}
        </div>
      )}

      <div className="mb25">
        <label className="form-label fw600 dark-color">Name</label>
        <input
          type="text"
          name="name"
          className={`form-control ${error && error.includes('name') ? 'is-invalid' : ''}`}
          placeholder="Enter Full Name"
          required
          onChange={handleInputChange}
          disabled={isLoading}
        />
        {error && error.includes('name') && (
          <div className="invalid-feedback">{error}</div>
        )}
      </div>

      <div className="mb25">
        <label className="form-label fw600 dark-color">Email</label>
        <input
          type="email"
          name="email"
          className={`form-control ${error && error.includes('email') ? 'is-invalid' : ''}`}
          placeholder="Enter Email"
          required
          onChange={handleInputChange}
          disabled={isLoading}
        />
        {error && error.includes('email') && (
          <div className="invalid-feedback">{error}</div>
        )}
      </div>

      <div className="mb20">
        <label className="form-label fw600 dark-color">Password</label>
        <input
          type="password"
          name="password"
          className={`form-control ${error && error.includes('password') ? 'is-invalid' : ''}`}
          placeholder="Enter Password"
          required
          onChange={handleInputChange}
          disabled={isLoading}
        />
        {error && error.includes('password') && (
          <div className="invalid-feedback">{error}</div>
        )}
        <small className="form-text text-muted">
          Password must be at least 6 characters long
        </small>
      </div>

      <div className="d-grid mb20">
        <button 
          className="ud-btn btn-thm" 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Creating account...
            </>
          ) : (
            <>
              {isBuildingSignup ? 'Create account & subscribe' : 'Create account'} <i className="fal fa-arrow-right-long" />
            </>
          )}
        </button>
      </div>

      <div className="hr_content mb20">
        <hr />
        <span className="hr_top_text">OR</span>
      </div>

      <div className="d-grid mb10">
        <button className="ud-btn btn-white" type="button" disabled={isLoading}>
          <i className="fab fa-google" /> Continue Google
        </button>
      </div>
      <div className="d-grid mb20">
        <button className="ud-btn btn-apple" type="button" disabled={isLoading}>
          <i className="fab fa-apple" /> Continue Apple
        </button>
      </div>
      
      <p className="dark-color text-center mb0 mt10">
        Already Have an Account?{" "}
        <button 
          type="button" 
          className="dark-color fw600 text-decoration-underline border-0 bg-transparent"
          onClick={() => {
            // Switch to signin tab
            const signinTab = document.getElementById('nav-home-tab');
            if (signinTab) {
              signinTab.click();
            }
          }}
        >
          Login
        </button>
      </p>
    </form>
  );
};

export default SignUp;
