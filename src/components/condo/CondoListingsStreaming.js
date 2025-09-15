import { getCondoUnits } from '@/actions/listingActions';
import PropertyByCitiesWrapper from '@/components/home/home-v3/PropertyByCitiesWrapper';
import { validateEnvironment } from '@/lib/env';
import { memo } from 'react';

async function CondoListingsStreaming({ slug }) {
  // Fetch condo data asynchronously (this will be streamed)
  let condoData = null;
  let hasError = false;
  
  try {
    // Check if environment variables are available
    if (!validateEnvironment()) {
      console.warn('Required environment variables are missing');
      hasError = true;
    } else {
      condoData = await getCondoUnits(slug);
    }
  } catch (error) {
    console.error('Error fetching condo data:', error);
    hasError = true;
    // Continue with null data - the component will handle this gracefully
  }

  // If there was an error, return a fallback component
  if (hasError) {
    return (
      <section className="pb90 pb30-md pt-0">
        <div className="container">
          <div className="row">
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
              <div className="text-center py-5">
                <div className="mb-3">
                  <i className="far fa-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
                </div>
                <h4 className="text-warning mb-3">Property Listings Temporarily Unavailable</h4>
                <p className="text-muted">
                  We're experiencing technical difficulties loading the property listings. 
                  Please try again later or contact support if the issue persists.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Pass the data to the existing PropertyByCitiesWrapper
  return <PropertyByCitiesWrapper slug={slug} condoData={condoData} />;
}

// Memoize the component to prevent unnecessary re-renders
export default memo(CondoListingsStreaming); 