import React from "react";
import ContextSearch from "@/components/coreUI/contextSearch";

export default function TopSearchModule() {
  return (
    <div className="font-outfit">
      <p className="text-4xl text-center">What will you order?</p>
      <ContextSearch />
    </div>
  );
}
