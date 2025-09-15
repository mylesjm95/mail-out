'use client'

import Link from "next/link";
import React, { useState } from "react";
import { login } from "@/actions/authActions";

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await login(formData);
      
      if (result.error) {
        setError(result.error);
        // Show error toast
        if (typeof window !== 'undefined' && window.showToast) {
          window.showToast(result.error, "error");
        }
      } else if (result.success) {
        setSuccess("Sign in successful! Redirecting...");
        
        // Show success toast
        if (typeof window !== 'undefined' && window.showToast) {
          window.showToast("Welcome back! You're now logged in.", "success");
        }
        
        // Wait a moment for the user to see the success message, then close modal and refresh
        setTimeout(() => {
          // Close the modal - try multiple approaches
          const modal = document.getElementById('loginSignupModal');
          if (modal) {
            // Try Bootstrap 5 method first
            if (typeof window !== 'undefined' && window.bootstrap) {
              try {
                const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
                if (bootstrapModal) {
                  bootstrapModal.hide();
                } else {
                  // If no instance exists, create one and hide it
                  const newModal = new window.bootstrap.Modal(modal);
                  newModal.hide();
                }
              } catch (error) {
                console.log('Bootstrap modal close failed, trying alternative method');
              }
            }
            
            // Fallback: manually hide the modal
            if (modal.classList.contains('show')) {
              modal.classList.remove('show');
              modal.style.display = 'none';
              // Remove backdrop
              const backdrop = document.querySelector('.modal-backdrop');
              if (backdrop) {
                backdrop.remove();
              }
              // Remove modal-open class from body
              document.body.classList.remove('modal-open');
              document.body.style.paddingRight = '';
            }
          }
          
          // Force a page refresh to update authentication state
          setTimeout(() => {
            // Try to trigger auth state update first
            if (typeof window !== 'undefined' && window.dispatchEvent) {
              window.dispatchEvent(new Event('storage'));
            }
            
            // Then refresh the page to ensure UI updates
            window.location.reload();
          }, 500);
        }, 1000);
        
        // The page will redirect automatically due to revalidation
      }
    } catch (err) {
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
    <form className="form-style1">
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

      <div className="mb15">
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
      </div>

      <div className="checkbox-style1 d-block d-sm-flex align-items-center justify-content-between mb10">
        <label className="custom_checkbox fz14 ff-heading">
          Remember me
          <input type="checkbox" defaultChecked="checked" disabled={isLoading} />
          <span className="checkmark" />
        </label>
        <a className="fz14 ff-heading" href="#">
          Lost your password?
        </a>
      </div>

      <div className="d-grid mb20">
        <button 
          className="ud-btn btn-thm" 
          type="submit" 
          formAction={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Signing in...
            </>
          ) : (
            <>
              Sign in <i className="fal fa-arrow-right-long" />
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
      <div className="d-grid mb10">
        <button className="ud-btn btn-fb" type="button" disabled={isLoading}>
          <i className="fab fa-facebook-f" /> Continue Facebook
        </button>
      </div>
      <div className="d-grid mb20">
        <button className="ud-btn btn-apple" type="button" disabled={isLoading}>
          <i className="fab fa-apple" /> Continue Apple
        </button>
      </div>
      
      <p className="dark-color text-center mb0 mt10">
        Not signed up?{" "}
        <button 
          type="button" 
          className="dark-color fw600 text-decoration-underline border-0 bg-transparent"
          onClick={() => {
            // Switch to signup tab
            const signupTab = document.getElementById('nav-profile-tab');
            if (signupTab) {
              signupTab.click();
            }
          }}
        >
          Create an account.
        </button>
      </p>
    </form>
  );
};

export default SignIn;
