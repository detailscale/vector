"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface CartItem {
  itemName: string;
  price: number;
}

interface InternalOrderButtonProps {
  itemName: string;
  price: number;
}

export default function InternalOrderButton({
  itemName,
  price,
}: InternalOrderButtonProps) {
  const handleOrderClick = () => {
    try {
      const newItem: CartItem = { itemName, price };
      const existingCartJSON = localStorage.getItem("cartItems");
      const cart: CartItem[] = existingCartJSON
        ? JSON.parse(existingCartJSON)
        : [];

      cart.push(newItem);

      localStorage.setItem("cartItems", JSON.stringify(cart));
      toast.success(<div className="font-outfit">Item added to cart</div>, {
        description: (
          <div className="font-outfit">{itemName} added to cart</div>
        ),
      });
    } catch (error) {
      console.error("Failed to update cart in localStorage", error);
      toast.error("Failed to add item to cart");
    }
  };

  return (
    <Button className="cursor-pointer w-22" onClick={handleOrderClick}>
      <ShoppingCart />
      Order
    </Button>
  );
}
