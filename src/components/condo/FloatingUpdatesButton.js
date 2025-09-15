'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';
import { createBuildingSavedSearch } from '@/actions/savedSearchActions';
import UpdatesConfirmationModal from './UpdatesConfirmationModal';
import './FloatingUpdatesButton.css';

function FloatingUpdatesButton({ buildingSlug, buildingAddress }) {
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { user, isAuthenticated, loading } = useAuth();
  
  // Use the efficient subscription hook
  const { 
    isSubscribed: isAlreadySubscribed, 
    isChecking: isCheckingSubscription, 
    updateSubscriptionStatus 
  } = useSubscriptionStatus(user?.id, buildingSlug);

  useEffect(() => {
    setMounted(true);
  }, []);

  // No need for manual subscription checking - handled by the hook

  // Don't render until mounted
  if (!mounted) return null;

  const openAuthModal = () => {
    // Dispatch custom event with building information
    if (buildingSlug && buildingAddress) {
      console.log('Dispatching building signup event:', { buildingSlug, buildingAddress });
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
    hiddenButton.setAttribute('type', 'button');
    
    // Add the button to the DOM temporarily
    document.body.appendChild(hiddenButton);
    
    // Trigger the modal
    try {
      if (typeof window !== 'undefined' && window.bootstrap) {
        const authModal = document.getElementById('loginSignupModal');
        if (authModal) {
          const bootstrapModal = new window.bootstrap.Modal(authModal);
          bootstrapModal.show();
          
          // If this is a building signup, automatically switch to signup tab
          if (buildingSlug && buildingAddress) {
            // Use a more reliable method to switch tabs
            const switchToSignupTab = () => {
              const signupTab = document.getElementById('nav-profile-tab');
              if (signupTab) {
                signupTab.click();
                return true;
              }
              return false;
            };
            
            // Try immediately first
            if (!switchToSignupTab()) {
              // If not successful, try with a small delay
              setTimeout(switchToSignupTab, 50);
            }
          }
        }
      } else {
        hiddenButton.click();
        
        // If this is a building signup, automatically switch to signup tab
        if (buildingSlug && buildingAddress) {
          const switchToSignupTab = () => {
            const signupTab = document.getElementById('nav-profile-tab');
            if (signupTab) {
              signupTab.click();
              return true;
            }
            return false;
          };
          
          // Try immediately first
          if (!switchToSignupTab()) {
            // If not successful, try with a small delay
            setTimeout(switchToSignupTab, 50);
          }
        }
      }
    } catch (error) {
      // Fallback: click the hidden button
      hiddenButton.click();
      
      // If this is a building signup, automatically switch to signup tab
      if (buildingSlug && buildingAddress) {
        const switchToSignupTab = () => {
          const signupTab = document.getElementById('nav-profile-tab');
          if (signupTab) {
            signupTab.click();
            return true;
          }
          return false;
        };
        
        // Try immediately first
        if (!switchToSignupTab()) {
          // If not successful, try with a small delay
          setTimeout(switchToSignupTab, 50);
        }
      }
    }
    
    // Clean up the hidden button
    setTimeout(() => {
      if (document.body.contains(hiddenButton)) {
        document.body.removeChild(hiddenButton);
      }
    }, 100);
  };

  const handleGetUpdatesClick = () => {
    if (!isAuthenticated) {
      // Open auth modal if user is not authenticated
      openAuthModal();
      return;
    }

    if (isAlreadySubscribed) {
      // Show info message if already subscribed
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast('You are already subscribed to updates for this building!', 'info');
      }
      return;
    }
    
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmSubscription = async () => {
    if (!user || !buildingSlug || !buildingAddress) {
      console.error('Missing required data for subscription');
      return;
    }

    // Double-check subscription status before proceeding
    if (isAlreadySubscribed) {
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast('You are already subscribed to updates for this building!', 'info');
      }
      setIsModalOpen(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createBuildingSavedSearch(
        user.id,
        buildingSlug,
        buildingAddress
      );

      if (result.success) {
        // Close modal and show success message
        setIsModalOpen(false);
        // Update subscription status using the hook
        updateSubscriptionStatus(true);
        // Show success toast notification
        if (typeof window !== 'undefined' && window.showToast) {
          window.showToast('Successfully subscribed to property updates!', 'success');
        }
        console.log('Successfully subscribed to updates');
      } else {
        // Show error toast notification
        if (typeof window !== 'undefined' && window.showToast) {
          window.showToast(result.error || 'Failed to subscribe to updates', 'error');
        }
        console.error('Failed to subscribe:', result.error);
      }
    } catch (error) {
      console.error('Error subscribing to updates:', error);
      // Show error toast notification
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast('An error occurred while subscribing to updates', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseButton = () => {
    setIsVisible(false);
  };

  // Don't show the button if it's been closed
  if (!isVisible) return null;

  return (
    <>
      {isVisible && (
        <div className="floating-updates-button">
          <button 
            className="get-updates-btn"
            onClick={handleGetUpdatesClick}
            disabled={isCheckingSubscription || loading}
          >
            <span className="btn-text">
              {isCheckingSubscription ? 'Checking...' : 
               isAlreadySubscribed ? '✓ Subscribed' : 
               loading ? 'Loading...' : 'Get Updates'}
            </span>
            <span className="btn-icon">📧</span>
          </button>
          <button 
            className="close-btn" 
            aria-label="Close"
            onClick={handleCloseButton}
          >
            ×
          </button>
        </div>
      )}

      <UpdatesConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmSubscription}
        isSubmitting={isSubmitting}
        buildingAddress={buildingAddress}
      />
    </>
  );
}

export default FloatingUpdatesButton; 