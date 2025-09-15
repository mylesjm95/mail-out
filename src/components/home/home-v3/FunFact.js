"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

const CounterWithAnimation = ({ end }) => {
  const countRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
      }
    }, options);

    const currentRef = countRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (inView) {
      const target = parseInt(end);
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60fps
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [inView, end]);

  return (
    <span ref={countRef}>
      {count}
    </span>
  );
};

const FunFact = () => {
  const funFacts = [
    { number: 80, text: "Completed Property" },
    { number: 99, text: "Satisfied Customers" },
    { number: 50, text: "Home ownership" },
  ];

  return (
    <>
      {funFacts.map((fact, index) => (
        <div className="col-sm-6 col-lg-4" key={index}>
          <div className="funfact_one">
            <div className="details">
              <ul className="ps-0 d-flex mb-0">
                <li>
                  <div className="timer">
                    <CounterWithAnimation end={fact.number} />
                  </div>
                </li>
                <li>
                  <span>%</span>
                </li>
              </ul>
              <p className="text mb-0">{fact.text}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default FunFact;
