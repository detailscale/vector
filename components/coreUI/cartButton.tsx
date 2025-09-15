"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface CartItem {
  itemName: string;
  price: number;
}

interface GroupedCartItem {
  itemName: string;
  price: number;
  quantity: number;
}

export default function CartButton() {
  const [badgeCount, setBadgeCount] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getCartItems = (): CartItem[] => {
    try {
      const existingCartJSON = localStorage.getItem("cartItems");
      if (existingCartJSON) {
        return JSON.parse(existingCartJSON);
      }
      return [];
    } catch (error) {
      console.error("Failed to read cart from localStorage: ", error);
      toast.error("Failed to read cart data: " + error, {
        description: "Cart items will be reset.",
      });
      localStorage.removeItem("cartItems");
      return [];
    }
  };

  // ICYNI
  // const getCartCount = () => {
  //   const items = getCartItems();
  //   return items.length;
  // };

  const groupCartItems = (items: CartItem[]): GroupedCartItem[] => {
    const grouped: { [key: string]: GroupedCartItem } = {};

    items.forEach((item) => {
      if (grouped[item.itemName]) {
        grouped[item.itemName].quantity += 1;
      } else {
        grouped[item.itemName] = {
          itemName: item.itemName,
          price: item.price,
          quantity: 1,
        };
      }
    });

    return Object.values(grouped);
  };

  const updateCart = (newItems: CartItem[]) => {
    localStorage.setItem("cartItems", JSON.stringify(newItems));
    setCartItems(newItems);
    setBadgeCount(newItems.length);

    // Dispatch custom event to update other components
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const addItem = (itemName: string, price: number) => {
    const currentItems = getCartItems();
    const newItem: CartItem = { itemName, price };
    const updatedItems = [...currentItems, newItem];
    updateCart(updatedItems);
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
  };

  const removeOneItem = (itemName: string) => {
    const currentItems = getCartItems();
    const itemIndex = currentItems.findIndex(
      (item) => item.itemName === itemName,
    );

    if (itemIndex !== -1) {
      const updatedItems = [...currentItems];
      updatedItems.splice(itemIndex, 1);
      updateCart(updatedItems);
      toast.success(
        <div className="font-outfit select-none">Item removed from cart</div>,
        {
          description: (
            <div className="font-outfit select-none">
              <span>{itemName}</span> removed from cart
            </div>
          ),
        },
      );
    }
  };

  const removeAllItems = (itemName: string) => {
    const currentItems = getCartItems();
    const updatedItems = currentItems.filter(
      (item) => item.itemName !== itemName,
    );
    updateCart(updatedItems);
    toast.success(
      <div className="font-outfit select-none">
        {itemName} cleared from cart
      </div>,
    );
  };

  const getTotalPrice = (): number => {
    const items = getCartItems();
    return items.reduce((total, item) => total + item.price, 0);
  };

  useEffect(() => {
    const items = getCartItems();
    setCartItems(items);
    setBadgeCount(items.length);

    const handleStorageChange = () => {
      const updatedItems = getCartItems();
      setCartItems(updatedItems);
      setBadgeCount(updatedItems.length);
    };

    window.addEventListener("cartUpdated", handleStorageChange);

    window.addEventListener("storage", (e) => {
      if (e.key === "cartItems") {
        handleStorageChange();
      }
    });

    return () => {
      window.removeEventListener("cartUpdated", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const groupedItems = groupCartItems(cartItems);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-8 h-8 bg-[#171717] rounded-sm border border-[#2f2f2f] p-2 cursor-pointer hover:bg-[#262626] transition-all duration-150 ease-in-out">
          {badgeCount > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white leading-none select-none font-mono pb-[1px]">
                {badgeCount}
              </span>
            </div>
          )}
          <ShoppingCart />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto dark font-outfit">
        <DialogHeader>
          <DialogTitle>
            <span className="font-normal">
              Your Cart ({badgeCount} {badgeCount === 1 ? "item" : "items"})
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {groupedItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Your cart is empty
            </div>
          ) : (
            <>
              {groupedItems.map((item) => (
                <div
                  key={item.itemName}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="">{item.itemName}</h4>
                    <p className="text-sm text-muted-foreground">
                      ${item.price} each
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => removeOneItem(item.itemName)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>

                    <span className="min-w-[2rem] text-center tabular-nums">
                      {item.quantity}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => addItem(item.itemName, item.price)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 ml-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => removeAllItems(item.itemName)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg">
                  <span>Total</span>
                  <span>${getTotalPrice()}</span>
                </div>
              </div>

              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
