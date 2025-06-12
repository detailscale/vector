"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

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
    minute: "2-digit"
  });

  return (
    <div className="font-outfit">
      <nav className="grid h-8 flex-shrink-0 grid-cols-3 items-center bg-[#171717] px-4 text-neutral-300 text-sm">
        <Link href='/'>
          <div className="relative select-none hover:text-neutral-100 ease-in-out duration-300">psord</div>
        </Link>
        <div></div>
        <div className="justify-self-end">{formattedTime}</div>
      </nav>
    </div>
  );
}
