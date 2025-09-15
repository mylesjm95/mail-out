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
      const duration = 6000; // 6 seconds
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
    {
      number: "4",
      unit: "M",
      text: "Awward Winning",
    },
    {
      number: "12",
      unit: "K",
      text: "Property Ready",
    },
    {
      number: "20",
      unit: "M",
      text: "Happy Customer",
    },
  ];

  return (
    <>
      {funFacts.map((item, index) => (
        <div className="col-md-4" key={index}>
          <div className="funfact_one text-center">
            <div className="details">
              <ul className="ps-0 mb-0 d-flex justify-content-center">
                <li>
                  <div className="timer">
                    {" "}
                    <CounterWithAnimation end={item.number} />
                  </div>
                </li>
                <li>
                  <span>{item.unit}</span>
                </li>
              </ul>
              <p className="text mb-0">{item.text}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default FunFact;
