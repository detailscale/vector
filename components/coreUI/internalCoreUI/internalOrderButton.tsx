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

export function addToCart(itemName: string, price: number) {
  try {
    const newItem: CartItem = { itemName, price };
    const existingCartJSON = localStorage.getItem("cartItems");
    const cart: CartItem[] = existingCartJSON
      ? JSON.parse(existingCartJSON)
      : [];

    cart.push(newItem);
    localStorage.setItem("cartItems", JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("cartUpdated"));

    toast.success(
      <div className="font-outfit select-none">Item added to cart</div>,
      {
        description: (
          <div className="font-outfit select-none">
            <span>{itemName}</span> added to cart
          </div>
        ),
      },
    );
  } catch (error) {
    console.error("Failed to update cart in localStorage", error);
    toast.error(
      <div className="font-outfit select-none">Failed to add item to cart</div>,
      {
        action: {
          label: <div className="font-outfit select-none">Clear Cart</div>,
          onClick: () => {
            localStorage.removeItem("cartItems");
            window.dispatchEvent(new CustomEvent("cartUpdated"));
          },
        },
        description: (
          <div className="font-outfit italic select-none">
            Contact administrator if the issue persists.
          </div>
        ),
      },
    );
  }
}

export default function InternalOrderButton({
  itemName,
  price,
}: InternalOrderButtonProps) {
  const handleOrderClick = () => {
    addToCart(itemName, price);
  };

  return (
    <Button className="cursor-pointer w-22" onClick={handleOrderClick}>
      <ShoppingCart />
      Order
    </Button>
  );
}
