'use client';
import { ErrorBoundary } from 'react-error-boundary';

function CondoListingsErrorFallback({ error, resetErrorBoundary }) {
  return (
    <section className="pb90 pb30-md pt-0">
      <div className="container">
        <div className="row align-items-md-center justify-content-between">
          <div className="col-lg-9">
            <div className="main-title2">
              <h2 className="title">Properties in this Building</h2>
              <p className="paragraph">
                Discover available units and recent sales
              </p>
            </div>
          </div>
        </div>
        
        <div className="row">
          <div className="col-12">
            <div className="error-container text-center py-5">
              <div className="error-icon mb-3">
                <i className="far fa-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
              </div>
              <h4 className="text-danger mb-3">Unable to Load Property Listings</h4>
              <p className="text-muted mb-4">
                We&apos;re having trouble loading the property listings for this building. 
                This might be a temporary issue.
              </p>
              <button 
                onClick={resetErrorBoundary}
                className="ud-btn btn-thm"
              >
                <i className="fas fa-redo me-2"></i>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CondoListingsError({ children }) {
  return (
    <ErrorBoundary
      FallbackComponent={CondoListingsErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Condo listings error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
} 