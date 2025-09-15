# Condo Listings Integration - Streaming Approach

This implementation integrates condo listings into the existing "Discover Popular Properties" section with for sale/for rent tabs, using Next.js 15's streaming features for optimal performance and user experience.

## Architecture

### Components

1. **Condo Page (Server Component)** - Uses Suspense for streaming
2. **CondoListingsStreaming.js** - Async server component that fetches data
3. **PropertyByCitiesWrapper.jsx** - Client component that handles tab switching and displays data
4. **CondoListings.js** - Client component that displays condo data using existing card structure
5. **CondoListings.css** - Minimal styles for sold listings

### Key Features

#### 1. Streaming with Suspense
- Data fetching is wrapped in Suspense for progressive loading
- Page loads immediately, condo listings appear when ready
- Fallback shows the section structure while data loads

#### 2. Server-Side Data Fetching
- Data is fetched at the server level (no client-side API calls)
- Better performance and SEO
- Eliminates repeated data fetching

#### 3. Seamless Integration
- Integrates condo listings into the existing "Discover Popular Properties" section
- Uses the same for sale/for rent tabs as the main site
- Maintains consistent design and user experience

#### 4. Tab Filtering
- Filters condo listings based on current tab (rent/sale)
- Shows appropriate properties for each tab
- Maintains tab state and functionality

#### 5. Image Optimization
- Uses `getOptimizedImageUrl` from imageUtils for proper image handling
- Includes error handling for failed image loads
- Falls back to default property image

#### 6. Error Handling
- Graceful error handling at the server level
- Shows user-friendly error message if data fetching fails
- Page continues to load even if condo data is unavailable

## Benefits

1. **Progressive Loading**: Page loads immediately, listings appear when ready
2. **Better Performance**: Server-side data fetching eliminates client-side API calls
3. **Reduced Data Fetching**: Data is fetched once at the server level
4. **Unified Experience**: Condo listings appear in the same section as other properties
5. **Design Consistency**: Uses the same card design and tab system
6. **SEO Friendly**: Data is available at render time
7. **Error Resilience**: Page loads even if condo data fails to load

## Usage

The integration works by:
1. **Streaming**: Condo page uses Suspense to stream the condo listings section
2. **Async Fetching**: `CondoListingsStreaming` fetches data asynchronously
3. **Data Passing**: Condo data is passed as props to `PropertyByCitiesWrapper`
4. **Client Level**: Component detects it's a condo page and shows condo-specific title
5. **Tab System**: Uses the same tab system to filter between rent/sale properties
6. **Display**: Renders condo data in existing card format

## Data Flow

```
Server Component (Condo Page)
├── Uses Suspense for streaming
├── Shows fallback while data loads
└── Renders other page sections immediately

Async Server Component (CondoListingsStreaming)
├── Fetches condo data with getCondoUnits(slug)
├── Handles errors gracefully
└── Passes data to PropertyByCitiesWrapper

Client Component (PropertyByCitiesWrapper)
├── Receives condo data as props
├── Manages tab state (rent/sale)
├── Passes filtered data to CondoListings
└── Shows appropriate title and description

Client Component (CondoListings)
├── Receives condo data and current tab
├── Transforms data to match FeaturedListings format
├── Filters data based on current tab
└── Renders cards with proper styling
```

## Streaming Benefits

- **Immediate Page Load**: Header, hero, partners, and other sections load immediately
- **Progressive Enhancement**: Condo listings appear when data is ready
- **Error Isolation**: If condo data fails, only that section is affected
- **Better UX**: Users see the page structure while waiting for data

## Performance Optimizations

### 1. Memoization
- `CondoListingsStreaming` is memoized to prevent unnecessary re-renders
- `PropertyByCitiesWrapper` is memoized and uses `useMemo` for data filtering
- Prevents multiple API calls when components re-render

### 2. Data Transformation
- Properly handles AMPRE API response structure
- Maps API fields to component expectations:
  - `TransactionType` → `forRent` boolean
  - `ListPrice`/`ClosePrice` → formatted price display
  - Address components → formatted title and location
  - `BedroomsAboveGrade` + `BedroomsBelowGrade` → total bedrooms

### 3. Image Handling
- Fetches actual property images via AMPRE Media API
- Uses `/api/media/[listingKey]` route to proxy image requests
- Falls back to placeholder images if no media found
- Integrates with `processListingsWithMedia` for optimized image loading
- Next.js configured to allow `trreb-image.ampre.ca` hostname

### 4. Single API Call
- Data is fetched once at the server level via streaming
- No client-side API calls
- Tab switching only filters existing data, doesn't trigger new requests

### 5. Hydration Error Prevention
- Completely removed AOS attributes to eliminate hydration mismatches
- Server and client render identical HTML
- No conditional rendering that could cause hydration errors
- Clean console with no React warnings

### 6. Consistent Image Sizing
- All images are fixed at 382x248px dimensions
- Uses `object-fit: cover` for consistent cropping
- Images maintain aspect ratio regardless of source dimensions
- Preserves original overlay positioning and hover effects
- Maintains original card design and functionality

### 7. Floating Updates Button
- Appears only on condo pages at the bottom center of the screen
- Modern gradient design with hover effects
- Includes a close button to dismiss the button
- Responsive design that adapts to mobile screens
- Smooth slide-up animation on page load
- **Authentication Integration**: 
  - If user is not signed in, clicking opens the auth modal
  - If user is authenticated, opens confirmation modal with preferences
  - Uses custom `useAuth` hook to check authentication status

### 8. Updates Confirmation Modal
- **Styled to match auth modal**: Same design language and components
- **Email input**: Pre-filled with user's email from authentication
- **Update preferences**: Checkboxes for different notification types
  - New Listings
  - Price Changes  
  - Market Updates
- **Form validation**: Required email field
- **Responsive design**: Adapts to mobile screens
- **Loading states**: Shows spinner during submission
- **Success handling**: Creates saved search in database and shows confirmation

### 9. Saved Search Integration
- **Database Schema**: Simplified SavedSearch table with User relation
- **Server Actions**: Create, remove, and manage saved searches
- **Building Information**: Stores building slug and address data
- **User Preferences**: Saves notification preferences as JSON
- **Duplicate Prevention**: Unique constraint on userId + buildingSlug
- **Active Status**: Tracks active/inactive subscriptions

### 10. Individual Listing Page Integration
- **Server Action**: `getListingByKey()` fetches single listing by ListingKey
- **URL Structure**: `/condo/[slug]/[unit]` where unit is the ListingKey
- **Data Integration**: All existing components receive `listingData` prop
- **Clickable Addresses**: Listing cards link to individual listing pages
- **New Tab Navigation**: Links open in new tab for better UX
- **Fallback Handling**: Page works with default data if API fails
- **No Layout Changes**: Existing components and styling preserved

### 11. Streaming with Loading Skeletons
- **Proper Streaming**: Condo listings section uses Suspense for progressive loading
- **Skeleton Loading**: Beautiful animated skeleton cards while data loads
- **Immediate Page Load**: Header, hero, and other sections load instantly
- **Progressive Enhancement**: Listing cards appear when data is ready
- **Error Resilience**: If API fails, page still loads with fallback content
- **Smooth UX**: No blank spaces or layout shifts during loading

### 12. Next.js 15 Best Practices Implementation
- **Server Components**: Root layout converted to server component for better performance
- **Dynamic Metadata**: SEO-optimized metadata generation for each building
- **Error Boundaries**: Proper error handling with user-friendly fallbacks
- **Performance Optimizations**: SWC minification, compression, and modern image formats
- **React 19**: Using latest React features and optimizations
- **Strict Mode**: Enabled for better development experience and error detection

## Authentication Hook

### useAuth Hook (`src/hooks/useAuth.js`)
- Custom React hook for checking user authentication status
- Uses Supabase client to get current session
- Listens for auth state changes
- Returns `{ user, loading, isAuthenticated }`
- Used by FloatingUpdatesButton and Header components to determine user state

### Header Authentication Integration
- **Not Authenticated**: Shows "Login / Register" button that opens auth modal
- **Authenticated**: Shows "My Account" button that links to profile page
- **Add Property Button**: Removed from both DefaultHeader and home-v3 Header
- **Consistent Experience**: Same behavior across all pages

### Modal Components
- **Auth Modal**: Existing Bootstrap modal for login/signup
- **Updates Confirmation Modal**: Custom modal for subscription preferences
  - Matches auth modal styling
  - Includes email and preference checkboxes
  - Handles form submission and validation

## Data Structure

Expected data format from `getCondoUnits`:
```javascript
{
  availableUnits: [
    {
      id: string,
      title: string,
      price: number,
      location: string,
      bedrooms: number,
      bathrooms: number,
      sqft: number,
      image: string,
      forRent: boolean // Determines which tab it appears in
    }
  ],
  recentlySold: [
    {
      id: string,
      title: string,
      price: number,
      location: string,
      bedrooms: number,
      bathrooms: number,
      sqft: number,
      image: string,
      soldDate: string,
      forRent: boolean
    }
  ]
}
```

## Design Integration

The component seamlessly integrates with the existing design by:
- Using the same `listing-style5` class structure
- Maintaining the same grid layout (`col-sm-6 col-lg-4 col-xl-3`)
- Using the existing tab system and styling
- Adding minimal sold-specific styling
- Keeping the same hover effects and interactions 