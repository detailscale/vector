"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Search, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface CartItem {
  itemName: string;
  price: string;
}

export default function TopBar() {
  const [badgeCount, setBadgeCount] = useState(0);

  const getCartCount = () => {
    try {
      const existingCartJSON = localStorage.getItem("cartItems");
      if (existingCartJSON) {
        const cart: CartItem[] = JSON.parse(existingCartJSON);
        return cart.length;
      }
      return 0;
    } catch (error) {
      console.error("Failed to read cart from localStorage: ", error);
      toast.error("Failed to read cart data: " + error, {
        description: "Cart items will be reset.",
      });
      localStorage.removeItem("cartItems");
      return 0;
    }
  };

  useEffect(() => {
    setBadgeCount(getCartCount());

    const handleStorageChange = () => {
      setBadgeCount(getCartCount());
    };

    window.addEventListener("cartUpdated", handleStorageChange);

    window.addEventListener("storage", (e) => {
      if (e.key === "cartItems") {
        setBadgeCount(getCartCount());
      }
    });

    return () => {
      window.removeEventListener("cartUpdated", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

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
                    <span className="text-xs text-white leading-none select-none font-outfit pb-[1px] tabular-nums">
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
