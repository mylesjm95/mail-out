"use client";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/actions/authActions";

const SidebarDashboard = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
    <div className="dashboard__sidebar d-none d-lg-block">
      <div className="dashboard_sidebar_list">
        {sidebarItems.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <p
              className={`fz15 fw400 ff-heading ${
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
                      padding: '20px 30px',
                      color: 'inherit',
                      cursor: 'pointer',
                      fontSize: '14px',
                      height: '70px',
                      marginBottom: '10px',
                      borderRadius: '5px',
                      boxShadow: '0px 1px 4px rgba(24, 26, 32, 0.07)'
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
      </div>
    </div>
  );
};

export default SidebarDashboard;
