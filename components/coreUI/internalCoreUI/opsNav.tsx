"use client";

import React, { useEffect, useState, useRef, useImperativeHandle } from "react";

const flashCycles = 3;
const flashOnDuration = 500;
const flashOffDuration = 500;

export interface OpsNavHandle {
  flash: () => void;
}

const OpsNav = React.forwardRef<OpsNavHandle, object>(
  function OpsNav(_props, ref) {
    const [time, setTime] = useState(new Date());
    const [flashOn, setFlashOn] = useState(false);
    const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

    useEffect(() => {
      const timerId = setInterval(() => {
        setTime(new Date());
      }, 1000);
      return () => clearInterval(timerId);
    }, []);

    useEffect(() => {
      return () => {
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];
      };
    }, []);

    const flash = () => {
      if (timeoutsRef.current.length) {
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];
      }

      const cycleLength = flashOnDuration + flashOffDuration;
      for (let i = 0; i < flashCycles; i++) {
        const base = i * cycleLength;
        timeoutsRef.current.push(setTimeout(() => setFlashOn(true), base));
        timeoutsRef.current.push(
          setTimeout(() => setFlashOn(false), base + flashOnDuration),
        );
      }
      timeoutsRef.current.push(
        setTimeout(() => setFlashOn(false), flashCycles * cycleLength),
      );
    };

    useImperativeHandle(ref, () => ({ flash }), []);

    const formattedTime = time.toLocaleTimeString("en-GB", {
      timeZone: "Etc/GMT-7",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const bgClass = flashOn
      ? "bg-[#85101f] text-black"
      : "bg-[#171717] text-white";

    return (
      <div className="blp_prop mb-8">
        <nav
          className={`fixed top-0 left-0 right-0 ${bgClass} flex items-center justify-between text-sm p-1`}
        >
          <span className="select-none hover:text-neutral-100 ease-in-out duration-300">
            operator panel
          </span>
          <span className="justify-self-end">{formattedTime}</span>
        </nav>
      </div>
    );
  },
);

export default OpsNav;
