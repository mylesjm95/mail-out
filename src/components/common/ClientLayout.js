'use client';
import { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import ToastContainer from "./ToastContainer";

export default function ClientLayout({ children }) {
  useEffect(() => {
    // Initialize Bootstrap
    if (typeof window !== "undefined") {
      import("bootstrap");
    }
  }, []);

  useEffect(() => {
    // Initialize AOS
    Aos.init({
      duration: 1200,
      once: true,
    });
  }, []);

  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
} 