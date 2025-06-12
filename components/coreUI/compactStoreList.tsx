"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import DynamicLucideIcon from "@/components/coreUI/customIcons";
import { Clock, icons, Users, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MenuItem {
  name: string;
  price: string;
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
        const response = await fetch("/testData/stores.json");
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      {restaurant.status[0].queueCount == 1
                        ? "Order"
                        : "Orders"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </DrawerTrigger>
            <DrawerContent className="dark font-outfit max-w-2xl mx-auto">
              <DrawerTitle className="text-center my-2">
                Order for {restaurant.name}
              </DrawerTitle>
              <div className="mx-4 mb-8 flex items-center">
                <DynamicLucideIcon
                  iconName={restaurant.icon as keyof typeof icons}
                ></DynamicLucideIcon>
                <div className="ml-3">
                  <p className="text-lg">{restaurant.name}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-muted-foreground capitalize">
                      {restaurant.cuisine} Cuisine
                    </p>
                  </div>
                </div>
              </div>
              <div className="mx-4 mb-8">
                <Card className="w-full bg-neutral-900 border-neutral-800">
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wifi className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-neutral-300">
                          POS System
                        </span>
                      </div>
                      {restaurant.status[0].isOnline == "true" ? (
                        <Badge
                          variant="secondary"
                          className="bg-green-900/50 text-green-400 border border-green-800 font-normal"
                        >
                          Online
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-red-900/50 text-red-400 border border-red-800"
                        >
                          Offline
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium text-neutral-300">
                          Queue Length
                        </span>
                      </div>
                      <span className="text-sm text-neutral-200">
                        {restaurant.status[0].queueCount}{" "}
                        {restaurant.status[0].queueCount == 1
                          ? "Order"
                          : "Orders"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-medium text-neutral-300">
                          Approx. Wait Time
                        </span>
                      </div>
                      <span className="text-sm text-neutral-200">
                        {restaurant.status[0].queueTimeMin}{" "}
                        {restaurant.status[0].queueTimeMin == 1
                          ? "Minute"
                          : "Minutes"}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-neutral-800">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-300">
                          Order Status
                        </span>
                        {restaurant.status[0].receivingOrders == "true" ? (
                          <Badge className="bg-green-900/50 text-green-400 border border-green-800 font-normal">
                            Accepting Orders
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-red-900/50 text-red-400 border border-red-800"
                          >
                            Not Accepting Orders
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </DrawerContent>
          </Drawer>
        ))}
      </div>
    </div>
  );
}
