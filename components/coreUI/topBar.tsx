import React from "react";
import { Button } from "@/components/ui/button";
import { Bell, Search, ShoppingCart } from "lucide-react";

const badgeCount = 12;

export default function TopBar() {
  return (
    <main>
      <div className="pt-5 max-w-2xl mx-auto">
        <div className="flex justify-between items-center w-full">
          <Button className="w-8 h-8 bg-[#171717] rounded-sm border border-[#2f2f2f] cursor-pointer hover:bg-[#262626] transition-all duration-150 ease-in-out">
            <Search />
          </Button>

          <div className="flex gap-2">
            <div className="relative">
              <Button className="w-8 h-8 bg-[#171717] rounded-sm border border-[#2f2f2f] p-2 cursor-pointer hover:bg-[#262626] transition-all duration-150 ease-in-out">
                {badgeCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white leading-none select-none font-outfit pb-[1px]">
                      {badgeCount}
                    </span>
                  </div>
                )}
                <ShoppingCart />
              </Button>
            </div>
            <Button className="w-8 h-8 bg-[#171717] rounded-sm border border-[#2f2f2f] p-2 cursor-pointer hover:bg-[#262626] transition-all duration-150 ease-in-out">
              <Bell />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
