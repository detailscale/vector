"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import CompactStoreListDrawerItems from "@/components/coreUI/internalCoreUI/compactStoreListDrawerItems";

interface MenuItem {
  name: string;
  price: number;
  description: string;
}

interface SystemStatus {
  isOnline: string;
  queueCount: number;
  queueTimeMin: number;
  receivingOrders: string;
}

interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  icon: string;
  ratings: number;
  menu: MenuItem[];
  pageURL: string;
  status: SystemStatus[];
}

export default function CompactStoreList() {
  const [restaurants, setRestaurants] = React.useState<Restaurant[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("/api/stores", { cache: "no-store" });
        if (!response.ok) {
          console.error("HTTP error ", response.status);
        }
        const data: Restaurant[] = await response.json();
        setRestaurants(data);
      } catch (error) {
        console.error("Fetch error ", error);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants().catch((error) => {
      console.error("Fetch error ", error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto dark">
        <h2 className="text-xl mb-3">Explore</h2>
        <div className="grid xs:grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent>
                <div className="h-4 bg-neutral-800 rounded mb-2"></div>
                <div className="h-3 bg-neutral-800 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto dark">
      <h2 className="text-xl mb-3">Explore</h2>
      <div className="grid xs:grid-cols-1 sm:grid-cols-2 gap-4">
        {restaurants.map((restaurant) => (
          <Drawer key={restaurant.id}>
            <DrawerTrigger asChild>
              <Card
                className="duration-150 cursor-pointer hover:bg-neutral-800 ease-in-out select-none"
                key={restaurant.id}
              >
                <CardContent>
                  <h3 className="text-base font-medium text-left">
                    {restaurant.name}
                  </h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground capitalize">
                      {restaurant.cuisine}
                    </span>
                    <p className="text-xs">
                      {restaurant.status[0].queueCount} Active{" "}
                      {restaurant.status[0].queueCount === 1
                        ? "Order"
                        : "Orders"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </DrawerTrigger>
            <CompactStoreListDrawerItems restaurant={restaurant} />
          </Drawer>
        ))}
      </div>
    </div>
  );
}
