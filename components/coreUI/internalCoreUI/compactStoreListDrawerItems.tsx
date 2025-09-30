import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import DynamicLucideIcon from "@/components/coreUI/customIcons";
import { Ban, icons, Users, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import InternalOrderButton from "@/components/coreUI/internalCoreUI/internalOrderButton";

interface MenuItem {
  name: string;
  price: number;
  description: string;
}

interface SystemStatus {
  isOnline: string | boolean;
  queueCount: number | string;
  queueTimeMin: number | string;
  receivingOrders: string | boolean;
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

interface CompactStoreListDrawerItemsProps {
  restaurant: Restaurant;
}

export default function CompactStoreListDrawerItems({
  restaurant,
}: CompactStoreListDrawerItemsProps) {
  const status = restaurant.status?.[0];
  const isOnline = status?.isOnline === true || status?.isOnline === "true";
  const isReceiving =
    status?.receivingOrders === true || status?.receivingOrders === "true";
  const queueCount = Number(status?.queueCount ?? 0);
  return (
    <DrawerContent className="dark font-outfit fixed bottom-0 left-0 right-0 w-full max-w-2xl mx-auto flex flex-col rounded-t-[10px] h-[80%] outline-none">
      <div className="flex-1 overflow-y-auto sidebar">
        <div className="max-w-2xl mx-auto pb-2">
          <DrawerTitle className="text-center my-2 sticky top-0 bg-[#0a0a0a] pb-1 mb-3">
            Order for {restaurant.name}
          </DrawerTitle>

          <div className="mx-4 mb-8 flex items-center">
            <DynamicLucideIcon
              iconName={restaurant.icon as keyof typeof icons}
            />
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
                  {isOnline ? (
                    <Badge
                      variant="secondary"
                      className="bg-green-900/50 text-green-400 border border-green-800 font-normal"
                    >
                      Online
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-red-900/50 text-red-400 border border-red-800 font-normal"
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
                    {queueCount} {queueCount === 1 ? "Order" : "Orders"}
                  </span>
                </div>

                <div className="pt-2 border-t border-neutral-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-300">
                      Order Status
                    </span>
                    {isReceiving ? (
                      <Badge className="bg-green-900/50 text-green-400 border border-green-800 font-normal">
                        Accepting Orders
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-red-900/50 text-red-400 border border-red-800 font-normal"
                      >
                        Not Accepting Orders
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="pt-4">
              <p className="text-xl">Menu</p>
              <div className="pt-2">
                {restaurant.menu.map((item, index) => (
                  <div
                    key={index}
                    className="border border-neutral-800 rounded-md p-4 mb-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-md">{item.name}</p>
                        <p className="text-sm text-neutral-400">
                          <span className="text-xl">{item.price}</span>{" "}
                          <span className="font-medium">THB</span>
                        </p>
                      </div>

                      {isReceiving ? (
                        <InternalOrderButton
                          itemName={item.name}
                          price={item.price}
                          storeName={restaurant.name}
                        />
                      ) : (
                        <Button className="w-32" disabled>
                          <Ban />
                          Unavailable
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DrawerContent>
  );
}
