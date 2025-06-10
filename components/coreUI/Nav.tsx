"use client";

import React, { useEffect, useState } from "react";

export default function Nav() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const formattedTime = time.toLocaleTimeString("en-GB", {
    timeZone: "Etc/GMT-7",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="font-outfit">
      <nav className="grid h-8 flex-shrink-0 grid-cols-3 items-center bg-[#171717] px-4 text-neutral-300 text-sm">
        <div className="relative select-none">psord</div>
        <div></div>
        <div className="justify-self-end">{formattedTime}</div>
      </nav>
    </div>
  );
}
