'use client';
import React from 'react';
import './UpdatesConfirmationModal.css';

const UpdatesConfirmationModal = ({ isOpen, onClose, onConfirm, isSubmitting = false }) => {
  console.log('UpdatesConfirmationModal render:', { isOpen, isSubmitting });
  
  const handleConfirm = () => {
    // Just call onConfirm without any data since email and preferences are now optional
    onConfirm();
  };

  if (!isOpen) {
    console.log('Modal not open, returning null');
    return null;
  }

  console.log('Rendering modal');

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-backdrop fade show"></div>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Get Property Updates
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
              disabled={isSubmitting}
            />
          </div>
          {/* End header */}

          <div className="modal-body">
            <p className="mb-4">
              Would you like to receive updates about new listings, price changes, and market updates for this property?
            </p>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Subscribing...
                </>
              ) : (
                'Subscribe to Updates'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatesConfirmationModal; 