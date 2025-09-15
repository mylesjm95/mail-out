"use client";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/actions/authActions";

const DboardMobileNavigation = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      const result = await logout();
      
      if (result.success) {
        // Redirect to home page after successful logout
        router.push('/');
        router.refresh();
      } else {
        console.error('Logout failed:', result.error);
        // Even if logout fails, redirect to home page
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Redirect to home page even if there's an error
      router.push('/');
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const sidebarItems = [
    {
      title: "MAIN",
      items: [
        {
          href: "/dashboard-home",
          icon: "flaticon-discovery",
          text: "Dashboard",
        },
        {
          href: "/dashboard-message",
          icon: "flaticon-chat-1",
          text: "Message",
        },
      ],
    },
    {
      title: "MANAGE LISTINGS",
      items: [
        {
          href: "/dashboard-add-property",
          icon: "flaticon-new-tab",
          text: "Add New Property",
        },
        {
          href: "/dashboard-my-properties",
          icon: "flaticon-home",
          text: "My Properties",
        },
        {
          href: "/dashboard-my-favourites",
          icon: "flaticon-like",
          text: "My Favorites",
        },
        {
          href: "/dashboard-saved-search",
          icon: "flaticon-search-2",
          text: "Saved Search",
        },
        {
          href: "/dashboard-reviews",
          icon: "flaticon-review",
          text: "Reviews",
        },
      ],
    },
    {
      title: "MANAGE ACCOUNT",
      items: [
        {
          href: "/dashboard-my-package",
          icon: "flaticon-protection",
          text: "My Package",
        },
        {
          href: "/dashboard-my-profile",
          icon: "flaticon-user",
          text: "My Profile",
        },
        {
          action: handleLogout,
          icon: "flaticon-exit",
          text: "Logout",
          isLogout: true,
        },
      ],
    },
  ];

  return (
    <div className="dashboard_navigationbar d-block d-lg-none">
      <div className="dropdown">
        <button
          className="dropbtn"
          onClick={() => setIsDropdownOpen((prevOpen) => !prevOpen)}
        >
          <i className="fa fa-bars pr10" /> Dashboard Navigation
        </button>
        <ul className={`dropdown-content ${isDropdownOpen ? "show" : ""}`}>
          {sidebarItems.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <p
                className={`fz15 fw400 ff-heading mt30 pl30 ${
                  sectionIndex === 0 ? "mt-0" : "mt30"
                }`}
              >
                {section.title}
              </p>
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="sidebar_list_item">
                  {item.isLogout ? (
                    <button
                      onClick={item.action}
                      disabled={isLoggingOut}
                      className="items-center logout-btn"
                      style={{
                        background: 'none',
                        border: 'none',
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 30px',
                        color: 'inherit',
                        cursor: 'pointer'
                      }}
                    >
                      <i className={`${item.icon} mr15`} />
                      {isLoggingOut ? 'Logging out...' : item.text}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`items-center ${
                        pathname == item.href ? "-is-active" : ""
                      } `}
                    >
                      <i className={`${item.icon} mr15`} />
                      {item.text}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DboardMobileNavigation;
