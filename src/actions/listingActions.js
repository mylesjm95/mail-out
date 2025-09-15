'use server';

import { getActiveListings, getRecentlySoldListings, fetchFromAmpre } from '@/lib/apiUtils';
import { getCachedData, setCachedData } from '@/lib/cache';
import prisma from '@/lib/prisma';

// Fetch condo units for a specific building
export async function getCondoUnits(slug) {
  const active = await getActiveListings(slug);
  const sold = await getRecentlySoldListings(slug, 90); // Last 90 days, adjustable

  return {
    availableUnits: active,
    recentlySold: sold,
  };
}

// Fetch a single listing by ListingKey with caching
export async function getListingByKey(listingKey) {
  try {
    if (!listingKey) {
      throw new Error('ListingKey is required');
    }

    // Check cache first
    const cacheKey = `listing_${listingKey}`;
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      console.log(`Cache hit for listing: ${listingKey}`);
      return cachedData;
    }

    console.log(`Cache miss for listing: ${listingKey}, fetching from API`);
    
    // Use fetchFromAmpre directly with ListingKey filter
    const filter = `ListingKey eq '${listingKey}'`;
    const listings = await fetchFromAmpre(filter);
    
    if (!listings || listings.length === 0) {
      throw new Error('Listing not found');
    }

    const listingData = listings[0];
    
    // Process the listing with media data
    const { processListingsWithMedia } = await import('@/lib/imageUtils.js');
    const processedListings = await processListingsWithMedia([listingData]);
    const processedListing = processedListings[0] || listingData;
    
    // Cache the result
    setCachedData(cacheKey, processedListing);
    
    return processedListing;
  } catch (error) {
    console.error('Error fetching listing by key:', error);
    throw error;
  }
}

// Fetch building data by slug
export async function getBuildingBySlug(slug) {
  try {
    const building = await prisma.building.findUnique({
      where: { slug },
      include: {
        buildingAgents: {
          include: {
            agent: {
              select: { id: true, name: true, email: true, phone: true, isActive: true }
            }
          }
        }
      }
    });

    return building;
  } catch (error) {
    console.error('Error fetching building:', error);
    return null;
  }
}