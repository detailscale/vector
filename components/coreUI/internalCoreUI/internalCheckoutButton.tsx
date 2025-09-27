"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Props = {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon" | null;
  onSuccess?: (data: any) => void;
};

export default function InternalCheckoutButton({
  className,
  size = "lg",
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const cartJson = localStorage.getItem("cartItems");
      if (!cartJson) {
        toast.error("cart is empty");
        return;
      }

      let cart: any;
      try {
        cart = JSON.parse(cartJson);
      } catch (e) {
        toast.error("invalid cart data, clearing");
        localStorage.removeItem("cartItems");
        return;
      }

      const res = await fetch("/api/orderPlacement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cart),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = (data as any)?.error || "checkout failed";
        toast.error(msg);
        return;
      }

      toast.success("Order placed");
      if (typeof window !== "undefined") {
        localStorage.removeItem("cartItems");
        window.dispatchEvent(new Event("cartUpdated"));
      }
      onSuccess?.(data);
    } catch (err) {
      toast.error("unexpected error during checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className={className}
      size={size as any}
      onClick={handleCheckout}
      disabled={loading}
    >
      {loading ? "Processing" : "Proceed to Checkout"}
    </Button>
  );
}
