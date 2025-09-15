"use client";
import React, { useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

const listingData = [
  {
    id: 1,
    title: "Equestrian Family Home",
    date: "December 31, 2022",
  },
  {
    id: 2,
    title: "Luxury villa in Rego Park",
    date: "December 31, 2022",
  },
  {
    id: 3,
    title: "Villa on Hollywood Boulevard",
    date: "December 31, 2022",
  },
  {
    id: 4,
    title: "Triple Story House for Rent",
    date: "December 31, 2022",
  },
  {
    id: 5,
    title: "Northwest Office Space",
    date: "December 31, 2022",
  },
  {
    id: 6,
    title: "House on the beverly hills",
    date: "December 31, 2022",
  },
  {
    id: 7,
    title: "Luxury villa called Elvado",
    date: "December 31, 2022",
  },
  {
    id: 8,
    title: "House on the Northridge",
    date: "December 31, 2022",
  },
  {
    id: 9,
    title: "Equestrian Family Home",
    date: "December 31, 2022",
  },
  {
    id: 10,
    title: "Luxury villa in Rego Park",
    date: "December 31, 2022",
  },
  {
    id: 11,
    title: "Villa on Hollywood Boulevard",
    date: "December 31, 2022",
  },
];

const SearchDataTable = () => {
  const [listings, setListings] = useState(listingData);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove the listing from state
      setListings(prev => prev.filter(listing => listing.id !== id));
      
      // Show success toast notification
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast('Saved search deleted successfully!', 'success');
      }
    } catch (error) {
      console.error('Error deleting saved search:', error);
      // Show error toast notification
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast('Failed to delete saved search', 'error');
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id) => {
    // TODO: Implement edit functionality
    if (typeof window !== 'undefined' && window.showToast) {
      window.showToast('Edit functionality coming soon!', 'info');
    }
  };

  const handleFullScreen = (id) => {
    // TODO: Implement full screen functionality
    if (typeof window !== 'undefined' && window.showToast) {
      window.showToast('Full screen functionality coming soon!', 'info');
    }
  };

  return (
    <table className="table-style3 table at-savesearch">
      <thead className="t-head">
        <tr>
          <th scope="col">Listing title</th>
          <th scope="col">Date Created</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody className="t-body">
        {listings.map((listing, index) => (
          <tr key={listing.id}>
            <th scope="row">{listing.title}</th>
            <td>{listing.date}</td>
            <td>
              <div className="d-flex">
                <button
                  className="icon"
                  style={{ border: "none" }}
                  onClick={() => handleFullScreen(listing.id)}
                  data-tooltip-id={`full_screen-${listing.id}`}
                >
                  <span className="flaticon-fullscreen-1" />
                </button>
                <button
                  className="icon"
                  style={{ border: "none" }}
                  onClick={() => handleEdit(listing.id)}
                  data-tooltip-id={`edit-${listing.id}`}
                >
                  <span className="fas fa-pen fa" />
                </button>
                <button
                  className="icon"
                  style={{ border: "none" }}
                  onClick={() => handleDelete(listing.id)}
                  disabled={deletingId === listing.id}
                  data-tooltip-id={`delete-${listing.id}`}
                >
                  <span className={`flaticon-bin ${deletingId === listing.id ? 'text-muted' : ''}`} />
                </button>

                <ReactTooltip
                  id={`full_screen-${listing.id}`}
                  place="top"
                  content="Full Screen"
                />
                <ReactTooltip
                  id={`edit-${listing.id}`}
                  place="top"
                  content="Edi"
                />
                <ReactTooltip
                  id={`delete-${listing.id}`}
                  place="top"
                  content="Delete"
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SearchDataTable;
